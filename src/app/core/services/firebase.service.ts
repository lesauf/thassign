import { Injectable, inject } from '@angular/core';
import { Auth, User as FirebaseUser, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentData,
} from '@angular/fire/compat/firestore';
import { Firestore, doc, onSnapshot, DocumentReference, docSnapshots, OrderByDirection, WhereFilterOp, collection, setDoc, deleteDoc, getDoc, runTransaction } from '@angular/fire/firestore';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import { getAuth, onAuthStateChanged,  } from "firebase/auth";
// import 'firebase/compat/firestore';

import { User } from '@src/app/core/models/user/user.model';

@Injectable()
export class FirebaseService {
  doc: DocumentReference;
  signedInUser: User;
  private fireAuth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  constructor(
	// private authService: AuthService,
	private angularFirestore: AngularFirestore,
  ) {
	onAuthStateChanged(this.fireAuth, (user: FirebaseUser) => {
		if (user) {
		this.signedInUser = new User({
			_id: user.uid,
			firstName: user.displayName,
			email: user.email,
			ownerId: user.uid,
		});
	// console.log('Auth Changed', this.signedInUser);
		} else {
			this.signedInUser = null;
		}
	});
  }

 

  init() {}

  /**
   * Create user and authenticate him at once
   * then save it in the users collection
   * @param email
   * @param password
   */

 
  async createUserAccount(
	email: string,
	password: string
  ): Promise<UserCredential> {
	try {
		return await createUserWithEmailAndPassword(this.fireAuth, email, password);
	} catch (error) {
		const errorCode = error.code;
    	const errorMessage = error.message;
  		throw error;
	}
  }
 
 

  async authenticate(provider: any, email?: string, password?: string) {
	try {
  	if (provider === 'emailPassword') {
    	return await signInWithEmailAndPassword(this.fireAuth, email, password);
  	}

  	if (provider === 'google') {
    	return await signInWithPopup(this.fireAuth, new GoogleAuthProvider());
  	}
	} catch (error) {
  	throw error;
	}
  }
 

  /**
   *
   */

 
  async isLoggedIn(): Promise<boolean> {
	const user = await this.fireAuth.currentUser;

	return user != null;
  }

  logout() {
	return this.fireAuth.signOut();
  }


  /**
   * return the current signed in user (or null)
   */

 
  getSignedInUser(): User {
	return this.signedInUser;
  }
 

  /**
   * Insert, replace, merge or delete one document in the specified collection
   * @param collection
   * @param converter
   * @param data
   * @param id
   * @param operation
   * @param merge
   */

  
  upsertOneDoc(
	collection: string,
	data: any,
	id?: string,
	operation: 'set' | 'delete' = 'set',
	merge = false,
	converter?: object
  ): Promise<any> {
	if (!id) {
		if (operation === 'set') {
			// Generate id for that insert
			id = this.angularFirestore.createId();
			data['_id'] = id;
		} else {
			// Error: delete operation without specified id
			throw new Error('No doc id specified for a delete operation');
		}
	}

	if (operation === 'set') {
		// add/update/merge
		let docRef = doc(this.getCollectionWithConverter(collection, converter), id);
		return setDoc(docRef, data, { merge: merge });
	} else {
		// Delete
		let docRef = doc(this.getCollectionWithConverter(collection, converter), id);
		return deleteDoc(docRef);
	}
  }
  

  /**
   * Insert, replace, merge or delete many documents in the specified collection
   * @param collection
   * @param converter
   * @param data In case of delete, contains an array of ids to delete
   * @param operation
   * @param merge
   */
  async upsertManyDocs(
	collection: string,
	data: any[],
	operation: 'set' | 'delete' = 'set',
	merge = false,
	converter?: object
  ): Promise<any> {
	await runTransaction(this.firestore, async (batch) => {
		// Loop through the array to add them to the batch
		data.forEach((item) => {
			let currentId;

			if (!item._id) {
				if (operation === 'set') {
					// Generate id for that insert
					item['_id'] = doc(this.getCollectionWithConverter(collection, converter)).id;
					currentId = item['_id'];
				} else {
					// delete operation without specified id
					// The item is the id to delete
					currentId = item;
				}
			} else {
				currentId = item._id;
			}

			const colRef = doc(this.getCollectionWithConverter(collection, converter), currentId);

			if (operation === 'set') {
				batch.set(colRef, item, { merge: merge });
			} else {
				batch.delete(colRef);
			}
		});
	});
  }
  

  /**
   * @see https://github.com/angular/angularfire/issues/2291#issuecomment-600911909
   *
   * @param collName
   * @param converter
   */
  getCollectionWithConverter(collName: string, converter?: any) {
	if (converter !== undefined) {
  	return collection(this.firestore, collName).withConverter(converter);
	} else {
  	return collection(this.firestore, collName);
	}
  }

  

  /**
   * Return an observable on a collection
   * @param collName
   */
  getQueryForCurrentUser(
	collName,
	sortField?: string,
	sortDirection: OrderByDirection = 'asc'
  ): AngularFirestoreCollection<unknown> {
	return this.angularFirestore.collection(collName, (ref) => {
  	const query = ref.where('ownerId', '==', this.signedInUser._id);

  	if (sortField !== undefined) {
    	return query.orderBy(sortField, sortDirection);
  	} else {
    	return query;
  	}
	});
  }
 
  async getDocById(collName: string, docId: string, converter?: any): Promise<any> {
	let docRef = doc(this.getCollectionWithConverter(collName, converter), docId);
	return await getDoc(docRef);
  }

  /**
   * Get data in a given range
   * @param collName Collection name
   * @param field
   * @param start
   * @param end
   */
  async getDocsInRange(
	collName: string,
	field: string,
	start: any,
	end: any
  ): Promise<any[]> {
	const querySnapshot = await this.getQueryForCurrentUser(collName)
  	.ref.where(field, '>', start)
  	.where(field, '<', end)
  	.get();

	const data = [];

	querySnapshot.forEach((doc) => {
  	data.push(doc.data());
	});

	return data;
  }

  paginateQuery(
	collName: string,
	converter: any, //firebase.firestore.FirestoreDataConverter<unknown>,
	sortField: string = 'lastName',
	sortOrder: OrderByDirection = 'asc',
	pageSize: number = 50,
	pageIndex: number = 1,
	filters: Array<{
  	field: string;
  	opStr: WhereFilterOp;
  	value: any;
	}>
  ) {
	const colRef = this.angularFirestore.firestore
  	.collection(collName)
  	.withConverter(converter)
  	.where('ownerId', '==', this.signedInUser._id)
  	.orderBy(sortField, sortOrder)
  	.startAfter(pageSize * pageIndex)
  	.limit(pageSize);
	if (filters.length) {
  	filters.forEach((filter) =>
    	colRef.where(filter.field, filter.opStr, filter.value)
  	);
	}
  }

  test() {
	return this.angularFirestore
  	.collection('cities', (ref) => ref.where('capital', '==', true))
  	.valueChanges();
  }
  
}
