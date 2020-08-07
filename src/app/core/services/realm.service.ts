import { Injectable } from '@angular/core';
import * as Realmweb from 'realm-web';
// import { assert } from 'console';

@Injectable({
  providedIn: 'root',
})
export class RealmService {
  app: Realmweb.App = new Realmweb.App({ id: 'thassign-realm-fihun' });

  constructor() {}

  /**
   *
   * @param username username
   * @param password password
   * @returns // Returns a promise that resolves to the authenticated user
   */
  async authenticate(username: string, password: string) {
    // Create userPass credentials
    const credentials = Realmweb.Credentials.emailPassword(username, password);

    try {
      // Authenticate the user
      const user: Realmweb.User = await this.app.logIn(credentials);
      // App.currentUser updates to match the logged in user
      // assert(user.id === this.app.currentUser.id);

      return user;
    } catch (err) {
      console.error('Failed to log in', err);
    }
  }

  isLoggedIn(): boolean {
    return this.app.currentUser !== null;
  }

  getUser() {
    return this.app.currentUser;
  }

  /**
   * Normally called once when the user register
   */
  setUserData(data: {
    userId: string;
    firstName: string;
    lastName: string;
  }): void {}

  logout() {}

  refreshCustomData() {}

  async createUserAccount(email: string, password: string) {
    await this.app.emailPasswordAuth.registerUser(email, password);

    console.log('Successfully created new user account');

    // Authenticate at once
    return await this.authenticate(email, password);
  }

  /**
   * Will be used for confirm user through an email
   * @see https://docs.mongodb.com/stitch/authentication/userpass/
   */
  confirmUserAccount() {}

  resetPassword() {}

  /**
   * @param colName Collection name
   */
  getCollectionByName(colName: string) {}

  getDbService(serviceName: string) {}

  /**
   *
   * @param serviceName Stitch Service Name
   * @param hookName Webhook name
   * @param dbService to avoid recreating it
   */
  async callFunction(functionName: string, params?: any[]) {
    try {
      // const response = await this.app.currentUser.functions[functionName](
      //   ...params
      // );

      // const response = await this.app.functions.callFunction(
      //   functionName,
      //   params
      // ); // ArgsTransformation error

      const response = await this.app.functions[functionName](params);

      console.log(functionName, ':Params', params, '=>', response);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
