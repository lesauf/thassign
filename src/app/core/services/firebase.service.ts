import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class FirebaseService {
  constructor(
    // private authService: AuthService,
    private firestore: AngularFirestore
  ) {}

  init() {}

  test() {
    return this.firestore
      .collection('cities', (ref) => ref.where('capital', '==', true))
      .valueChanges();
  }
}
