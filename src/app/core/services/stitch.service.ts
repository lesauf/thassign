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

  authenticate() {
    const credential = new UserPasswordCredential('lesauf', 'password');

    this.stitchAppClient.auth
      .loginWithCredential(credential)
      // Returns a promise that resolves to the authenticated user
      .then((authedUser) =>
        console.log(`successfully logged in with id: ${authedUser.id}`)
      )
      .catch((err) => console.error(`login failed with error: ${err}`));

    // return this.stitchAppClient.auth.loginWithCredential(
    //   new AnonymousCredential()
    // );
  }

  createUserAccount(username: string, password: string) {
    const emailPasswordClient = Stitch.defaultAppClient.auth.getProviderClient(
      UserPasswordAuthProviderClient.factory
    );

    emailPasswordClient
      .registerWithEmail(username, password)
      .then(() => console.log('Successfully sent account confirmation email!'))
      .catch((err) => console.error('Error registering new user:', err));
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
  async executeHook(serviceName: string, hookName: string, dbService) {
    // this.stitchAppClient.auth.logout();
    try {
      // if (this.stitchAppClient.auth.isLoggedIn) {
      await this.authenticate();
      // } else {
      //   console.log('Already logged in');
      // }

      const webHookUrl =
        this.webHookClientUrlParams.scheme +
        '://' +
        // 'lesauf:password@' +
        this.webHookClientUrl +
        'service/' +
        serviceName +
        '/incoming_webhook/' +
        hookName;

      this.webHookClientUrlParams.path =
        this.webHookClientUrlParams.path +
        'service/' +
        serviceName +
        '/incoming_webhook/' +
        hookName;
      this.webHookClientUrlParams.username = 'lesauf@gmail.com';
      this.webHookClientUrlParams.password = 'password';

      const buildRequest = new HttpRequest(this.webHookClientUrlParams);
      buildRequest.method = HttpMethod.GET;
      // console.log(request.Builder());
      // const buildRequest = new HttpRequest.Builder()
      //   .withMethod(HttpMethod.GET)
      //   .withUrl(webHookUrl)
      //   .withHeaders({
      //     Authorization: [`Basic ${btoa('lesauf:password')}`],
      //   })
      //   // .withEncodeBodyAsJson(true)
      //   // .withBody({
      //   //   // user_id: this.stitchAppClient.auth.user.id,
      //   //   email: 'lesauf@gmail.com',
      //   //   password: 'password',
      //   // })
      //   .build();
      // buildRequest.username = 'lesauf@gmail.com';
      // buildRequest.password = 'password';
      console.log(buildRequest);
      //   {
      //   username: 'lesauf@gmail.com',
      //   password: 'password',
      // }

      const response = await dbService.execute(buildRequest);
      return JSON.parse(response.body);
    } catch (error) {
      throw error;
    }
  }
}
