import { Injectable } from '@angular/core';
const {
  AnonymousCredential,
  Stitch,
  RemoteMongoClient,
} = require('mongodb-stitch-browser-sdk');

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

  getServiceWebHookUrl(serviceName: string) {
    return (
      this.webHookClientUrl + 'service/' + serviceName + '/incoming_webhook/'
    );
  }
}
