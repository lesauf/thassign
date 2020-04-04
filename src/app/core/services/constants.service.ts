import { Injectable } from '@angular/core';
const {
  AnonymousCredential,
  Stitch,
  RemoteMongoClient,
} = require('mongodb-stitch-browser-sdk');
const {
  HttpMethod,
  HttpRequest,
  HttpServiceClient,
} = require('mongodb-stitch-browser-services-http');

@Injectable()
export class ConstantsService {
  readonly stitchAppClient = Stitch.initializeDefaultAppClient(
    'thassign-oykwx'
  );

  readonly db = this.stitchAppClient
    .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
    .db('thassign');

  readonly webHookClientUrl =
    'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/';

  authenticate() {
    return this.stitchAppClient.auth.loginWithCredential(
      new AnonymousCredential()
    );
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

  getServiceWebHookUrl(serviceName: string) {
    return (
      this.webHookClientUrl + 'service/' + serviceName + '/incoming_webhook/'
    );
  }

  /**
   *
   * @param serviceName Stitch Service Name
   * @param hookName Webhook name
   * @param dbService to avoid recreating it
   */
  async executeHook(serviceName: string, hookName: string, dbService) {
    const webHookUrl =
      this.webHookClientUrl +
      'service/' +
      serviceName +
      '/incoming_webhook/' +
      hookName;

    const request = new HttpRequest.Builder()
      .withMethod(HttpMethod.GET)
      .withUrl(webHookUrl)
      .build();

    const response = await dbService.execute(request);
    return JSON.parse(response.body);
  }
}
