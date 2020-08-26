import { Injectable, NgZone } from '@angular/core';
import firebase from 'nativescript-plugin-firebase';
import { Observable } from 'rxjs';

import { User } from '@src/app/core/models/user/user.model';
// const firebase = require('nativescript-plugin-firebase');

/**
 * Firestore data converter type
 */
type Converter = {
  toFirestore(data: any): any;
  fromFirestore(snapshot, options): any;
};

@Injectable()
export class FirebaseService {
  user: User;

  private data: Array<any> = [];

  constructor(private ngZone: NgZone) {} // private authService: AuthService,

  async init() {
    try {
      await firebase.init({
        // Listen to changes on auth state
        // onAuthStateChanged: (data) => {
        //   // optional but useful to immediately re-logon the user when they revisit your app
        //   console.log(
        //     data.loggedIn ? 'Logged in to Firebase' : 'Logged out from Firebase'
        //   );
        //   if (data.loggedIn) {
        //     this.user = new User({
        //       _id: data.user.uid,
        //       firstName: data.user.displayName,
        //       email: data.user.email,
        //       ownerId: data.user.uid,
        //     });
        //     console.log(
        //       "User's email address:" +
        //         (data.user.email ? data.user.email : 'N/A')
        //     );
        //   } else {
        //     this.user = null;
        //   }
        // },
      });
      console.log('firebase.init done');
    } catch (error) {
      console.log(`firebase.init error: ${error}`);
    }
  }

  /**
   * Create user and authenticate him at once
   * then save it in the users collection
   * @param email
   * @param password
   */
  async createUserAccount(
    email: string,
    password: string
  ): Promise<firebase.User> {
    try {
      await firebase.createUser({
        email: email,
        password: password,
      });

      return await firebase.login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: email,
          password: password,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async authenticate(provider: any, email?: string, password?: string) {
    try {
      if (provider === 'emailPassword') {
        return await firebase.login({
          type: firebase.LoginType.PASSWORD,
          passwordOptions: {
            email: email,
            password: password,
          },
        });
      }

      if (provider === 'google') {
        return await firebase.login({
          type: firebase.LoginType.GOOGLE,
          // Optional
          // googleOptions: {
          //   hostedDomain: 'mygsuitedomain.com',
          //   // NOTE: no need to add 'profile' nor 'email',
          //   // because they are always provided
          //   // NOTE 2: requesting scopes means you may access those properties,
          //   // but they are not automatically fetched by the plugin
          //   scopes: ['https://www.googleapis.com/auth/user.birthday.read']
          // }
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   */
  async isLoggedIn(): Promise<boolean> {
    var user = await firebase.getCurrentUser();

    return user != null;
  }

  async logout(): Promise<any> {
    return await firebase.logout();
  }

  /**
   * return the current signed in user (or null)
   */
  getSignedInUser(): User {
    return this.user;
  }

  /**
   * Insert, replace or merge one document in the specified collection
   * @param collection
   * @param data
   * @param id
   * @param merge
   */
  upsertOneDoc(
    collection: string,
    converter: Converter,
    data: any,
    id?: string,
    merge = false
  ): Promise<any> {
    if (id) {
      // update/merge
      return (
        firebase.firestore
          // .collection(this.getCollectionWithConverter(collection, converter))
          .collection(collection)
          .doc(id)
          .set(converter.toFirestore(data), { merge: merge })
      );
    } else {
      // add
      return firebase.firestore
        .collection(collection)
        .add(converter.toFirestore(data));
    }
  }

  /**
   * @see https://github.com/angular/angularfire/issues/2291#issuecomment-600911909
   *
   * @param collName
   * @param converter
   */
  getCollectionWithConverter(collName, converter) {
    // return firebase.firestore.collection(collName).withConverter(converter);
  }

  /**
   * Return an observable on a collection
   * @param collName
   */
  listenToCollection(collName): Observable<any> {
    return Observable.create((subscriber) => {
      firebase.firestore
        .collection(collName)
        .where('ownerId', '==', this.user._id)
        .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
          this.ngZone.run(() => {
            this.data = [];
            snapshot.forEach((docSnap) => this.data.push(docSnap.data()));
            subscriber.next(this.data);
          });
        });
    });
  }

  test() {
    return this.firestoreCollectionObservable();

    // return this.listenToCollection('items');

    // return firebase.firestore.collection('cities');
    //   , (ref) =>
    //   ref.where('capital', '==', true)
    // );
  }

  firestoreCollectionObservable(): Observable<any[]> {
    return Observable.create((subscriber) => {
      const colRef: firebase.firestore.CollectionReference = firebase.firestore.collection(
        'items'
      );

      colRef
        // .where('capital', '==', true)
        .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
          this.ngZone.run(() => {
            this.data = [];
            snapshot.forEach((docSnap) => this.data.push(docSnap.data()));
            subscriber.next(this.data);
          });
        });
    });
  }
}
