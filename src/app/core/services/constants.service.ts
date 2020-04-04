import { Injectable } from '@angular/core';
const { Stitch, RemoteMongoClient } = require('mongodb-stitch-browser-sdk');

@Injectable()
export class ConstantsService {
  readonly stitchAppClient = Stitch.initializeDefaultAppClient(
    'thassign-oykwx'
  );

  readonly db = this.stitchAppClient
    .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
    .db('thassign');
}
