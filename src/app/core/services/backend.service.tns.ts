import { Injectable } from '@angular/core';

import { FirebaseService } from '@src/app/core/services/firebase.service';

@Injectable()
export class BackendService extends FirebaseService {
  // init() {}

  /**
   * Some test queries to check the connexion
   */
  // test() {}

  async callFunction(functionName, parameters?: any[]) {
    try {
      return null;
    } catch (error) {
      throw error;
    }
  }

  // isLoggedIn(): boolean {
  //   return false;
  // }

  // async authenticate(username, password) {
  //   return { id: null };
  // }

  refreshCustomData() {}

  // createUserAccount(email: string, password: string) {
  //   return { id: null };
  // }

  // logout() {}

  // getUser() {
  //   return { id: null, customData: {} };
  // }
}
