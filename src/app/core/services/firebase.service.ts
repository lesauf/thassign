import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { User } from '@src/app/core/models/user/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseService {
  user: User;

  constructor(
    // private authService: AuthService,
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) {
    this.fireAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.user = new User({
          _id: user.uid,
          firstName: user.displayName,
          email: user.email,
          ownerId: user.uid,
        });
        // console.log('Auth Changed', this.user);
      } else {
        this.user = null;
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
  ): Promise<firebase.auth.UserCredential> {
    try {
      await this.fireAuth.createUserWithEmailAndPassword(email, password);

      return await this.fireAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  async authenticate(provider: any, email?: string, password?: string) {
    try {
      if (provider === 'emailPassword') {
        return await this.fireAuth.signInWithEmailAndPassword(email, password);
      }

      if (provider === 'google') {
        return await this.fireAuth.signInWithPopup(
          new firebase.auth.GoogleAuthProvider()
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   */
  async isLoggedIn(): Promise<boolean> {
    var user = await this.fireAuth.currentUser;

    return user != null;
  }

  logout() {
    return this.fireAuth.signOut();
  }

  /**
   * return the current signed in user (or null)
   */
  getSignedInUser(): User {
    return this.user;
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
    converter: object,
    data: any,
    id?: string,
    operation: 'set' | 'delete' = 'set',
    merge = false
  ): Promise<any> {
    if (!id) {
      if (operation === 'set') {
        // Generate id for that insert
        id = this.firestore.createId();
        data['_id'] = id;
      } else {
        // Error: delete operation without specified id
        throw new Error('No doc id specified for a delete operation');
      }
    }

    if (operation === 'set') {
      // add/update/merge
      return this.firestore
        .collection(this.getCollectionWithConverter(collection, converter))
        .doc(id)
        .set(data, { merge: merge });
    } else {
      // Delete
      return this.firestore
        .collection(this.getCollectionWithConverter(collection, converter))
        .doc(id)
        .delete();
    }
  }

  /**
   * Insert, replace, merge or delete many documents in the specified collection
   * @param collection
   * @param converter
   * @param data
   * @param operation
   * @param merge
   */
  upsertManyDocs(
    collection: string,
    converter: object,
    data: any[],
    operation: 'set' | 'delete' = 'set',
    merge = false
  ) {
    // Get a new write batch
    var batch = this.firestore.firestore.batch();

    // Loop through the array to add them to the batch
    data.forEach((item) => {
      if (!item._id) {
        if (operation === 'set') {
          // Generate id for that insert
          item['_id'] = this.firestore.createId();
        } else {
          // delete operation without specified id
          throw new Error('No doc id specified for a delete operation');
        }
      }

      const colRef = this.firestore
        .collection(this.getCollectionWithConverter(collection, converter))
        .doc(item['_id']);

      if (operation === 'set') {
        batch.set(colRef.ref, item, { merge: merge });
      } else {
        batch.delete(item['_id']);
      }
    });

    // Commit the batch
    batch.commit().catch((err) => console.error(err));
  }

  /**
   * @see https://github.com/angular/angularfire/issues/2291#issuecomment-600911909
   *
   * @param collName
   * @param converter
   */
  getCollectionWithConverter(collName, converter): CollectionReference {
    return firebase.firestore().collection(collName).withConverter(converter);
  }

  /**
   * Return an observable on a collection
   * @param collName
   */
  listenToCollection(collName): Observable<any> {
    return this.firestore
      .collection(collName, (ref) => ref.where('ownerId', '==', this.user._id))
      .valueChanges();
  }

  test() {
    return this.firestore
      .collection('cities', (ref) => ref.where('capital', '==', true))
      .valueChanges();
  }
}
