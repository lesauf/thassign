import { Injectable, NgZone } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'nativescript-plugin-firebase';
import { Observable } from 'rxjs';
// const firebase = require('nativescript-plugin-firebase');

@Injectable()
export class FirebaseService {
  private data: Array<any> = [];

  constructor(private zone: NgZone) {} // private authService: AuthService,

  init() {
    // firebase
    //   .init({
    //     // Optionally pass in properties for database, authentication and cloud messaging,
    //     // see their respective docs.
    //   })
    //   .then(
    //     () => {
    //       console.log('firebase.init done');
    //     },
    //     (error) => {
    //       console.log(`firebase.init error: ${error}`);
    //     }
    //   );
  }

  test() {
    return this.firestoreCollectionObservable();
    // return firebase.firestore.collection('cities');
    //   , (ref) =>
    //   ref.where('capital', '==', true)
    // );
  }

  firestoreCollectionObservable(): Observable<any[]> {
    return Observable.create((subscriber) => {
      const colRef: firebase.firestore.CollectionReference = firebase.firestore.collection(
        'cities'
      );
      colRef.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
        this.zone.run(() => {
          this.data = [];
          snapshot.forEach((docSnap) => this.data.push(docSnap.data()));
          subscriber.next(this.data);
        });
      });
    });
  }
}
