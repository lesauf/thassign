import { Injectable } from '@angular/core';
const {
  AnonymousCredential,
  BSON,
  RemoteMongoClient,
  Stitch,
  UserPasswordAuthProviderClient,
  UserPasswordCredential,
} = require('mongodb-stitch-browser-sdk');
const {
  HttpMethod,
  HttpRequest,
  HttpServiceClient,
} = require('mongodb-stitch-browser-services-http');

@Injectable()
export class StitchService {
  readonly stitchAppClient = Stitch.initializeDefaultAppClient(
    'thassign-oykwx'
  );

  readonly db = this.stitchAppClient
    .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
    .db('thassign');

  protected webHookClientUrlParams = {
    scheme: 'https',
    host: 'webhooks.mongodb-stitch.com',
    path: '/api/client/v2.0/app/thassign-oykwx/',
    query: {},
    fragment: '',
    username: '',
    password: '',

    // 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/';
  };

  webHookClientUrl =
    'webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/';

  isLoggedIn() {
    return this.stitchAppClient.auth.isLoggedIn;
  }

  getUser() {
    return this.stitchAppClient.auth.user;
  }

  logout() {
    return this.stitchAppClient.auth.logout();
  }

  /**
   *
   * @param username username
   * @param password password
   * @returns // Returns a promise that resolves to the authenticated user
   */
  authenticate(username: string = 'lesauf', password: string = 'password') {
    const credential = new UserPasswordCredential(username, password);

    return this.stitchAppClient.auth.loginWithCredential(credential);
  }

  async createUserAccount(username: string, password: string) {
    const emailPasswordClient = Stitch.defaultAppClient.auth.getProviderClient(
      UserPasswordAuthProviderClient.factory
    );

    await emailPasswordClient.registerWithEmail(username, password);

    console.log('Successfully created new user account');
    // Authenticate
    return await this.authenticate(username, password);
  }

  /**
   * Will be used for confirm user through an email
   * @see https://docs.mongodb.com/stitch/authentication/userpass/
   */
  confirmUserAccount() {
    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    // Confirm the user's email/password account
    const emailPassClient = Stitch.defaultAppClient.auth.getProviderClient(
      UserPasswordAuthProviderClient.factory
    );

    return emailPassClient.confirmUser(token, tokenId);
  }

  /**
   * @param colName Collection name
   */
  getCollectionByName(colName: string) {
    return this.db.collection(colName);
  }

  getDbService(serviceName: string) {
    return this.stitchAppClient.getServiceClient(
      HttpServiceClient.factory,
      serviceName
    );
  }

  // getServiceWebHookUrl(serviceName: string) {
  //   return (
  //     this.webHookClientUrl + 'service/' + serviceName + '/incoming_webhook/'
  //   );
  // }

  /**
   *
   * @param serviceName Stitch Service Name
   * @param hookName Webhook name
   * @param dbService to avoid recreating it
   */
  async callFunction(functionName: string, params?: any[]) {
    await this.stitchAppClient.auth.logout();
    try {
      if (!this.stitchAppClient.auth.isLoggedIn) {
        await this.authenticate();
        console.log('logging in');
      } else {
        console.log('Already logged in');
      }

      const response = await this.stitchAppClient.callFunction(
        functionName,
        params
      );
      console.log(functionName, ':', response);

      return response;
    } catch (error) {
      throw error;
    }
  }
}
