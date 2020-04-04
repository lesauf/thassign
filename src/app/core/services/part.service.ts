import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
const {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
} = require('mongodb-stitch-browser-sdk');

import { CommonService } from './common.service';
import { MessageService } from './message.service';

import { PartModel } from '../../../../server/src/modules/parts/part.model';
// import { PARTS } from '../mocks/parts.mock';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

// const client = Stitch.initializeDefaultAppClient('thassign-oykwx');

// const db = client
//   .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
//   .db('thassign');

/**
 * Get data about parts from storage
 */
@Injectable({
  providedIn: 'root',
})
export class PartService extends CommonService {
  allParts: any[] = [];

  /**
   * Object storing the nice names of meeting parts,
   * grouped by meetings
   */
  meetingParts = {
    weekend: {
      chairman: 'weekend.publicTalk.chairman',
      speaker: 'weekend.publicTalk.speaker',
      conductor: 'weekend.watchtower.conductor',
      reader: 'weekend.watchtower.reader',
    },
    students: {
      bibleReading: 'clm.treasures.bible-reading',
      initialCall: 'clm.ministry.initial-call',
      firstReturnVisit: 'clm.ministry.first-return-visit',
      secondReturnVisit: 'clm.ministry.second-return-visit',
      bibleStudy: 'clm.ministry.bible-study',
      studentTalk: 'clm.ministry.talk',
      studentAssistant: 'clm.ministry.assistant',
    },
  };

  private partsUrl = 'api/part'; // URL to web api

  constructor(private http: HttpClient, messageService: MessageService) {
    super(messageService);

    // client.auth
    //   .loginWithCredential(new AnonymousCredential())
    //   .then(user =>
    //     db
    //       .collection('parts')
    //       .updateOne(
    //         { owner_id: client.auth.user.id },
    //         { $set: { number: 42 } },
    //         { upsert: true }
    //       )
    //   )
    //   .then(() =>
    //     db
    //       .collection('parts')
    //       .find({ owner_id: client.auth.user.id }, { limit: 100 })
    //       .asArray()
    //   )
    //   .then(docs => {
    //     console.log('Found docs', docs);
    //     console.log('[MongoDB Stitch] Connected to Stitch');
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }

  /**
   * populate allParts property once and for all
   */
  async init() {
    if (this.allParts.length === 0) {
      await this.getAllParts();
    }
  }

  /**
   * Get all parts from the server
   */
  getParts(): Observable<any[]> {
    // if there are params, encode and convert them to url params
    return this.http.get<any[]>(this.partsUrl).pipe(
      tap((_) => this.log('fetched parts')),
      catchError(this.handleError('getParts', []))
    );
  }

  /**
   * Get all parts from the server and store them in the
   * allParts property
   */
  async getAllParts() {
    // if there are params, encode and convert them to url params
    this.allParts = await this.http
      .get<any[]>(this.partsUrl)
      .pipe(
        tap((_) => this.log('Fetched parts')),
        catchError(this.handleError('getAllParts', []))
      )
      .toPromise();
  }

  // getPartsByMeeting(meetingName: string) {
  //   const meetingNameEncoded = encodeURIComponent(meetingName);
  //   return this.http
  //     .get<any[]>(this.partsUrl + `/meeting/${meetingNameEncoded}`)
  //     .pipe(
  //       tap(_ => this.log(`fetched parts of meeting ${meetingName}`)),
  //       catchError(this.handleError('getParts', []))
  //     );
  // }

  /**
   * get the parts objects of the current meeting
   */
  async getPartsByMeeting(meetingName: string) {
    await this.init();

    const partsOfMeeting = [];
    Object.keys(this.meetingParts[meetingName]).forEach((partName) => {
      partsOfMeeting[partName] = this.allParts.find(
        (part) => part.name === this.meetingParts[meetingName][partName]
      );
    });

    return partsOfMeeting;
  }

  /**
   * Get all part grouped by meeting
   * @todo Use a sql query on MongoDb
   */
  getPartsGroupedByMeeting(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.partsUrl + '/group/meeting').pipe(
      tap((_) => this.log('fetched parts grouped by meeting')),
      catchError(this.handleError('getParts', []))
    );
  }

  getPartsNames(): Observable<Array<string>> {
    return this.http.get<Array<string>>(this.partsUrl + '/names').pipe(
      tap((_) => this.log('fetched parts names')),
      catchError(this.handleError('getParts', []))
    );
  }

  getPartById(_id: string) {
    _id = encodeURIComponent(_id);
    return this.http.get<any>(this.partsUrl + `/id/${_id}`).pipe(
      tap((_) => this.log('fetched part ' + _id)),
      catchError(this.handleError('getParts', []))
    );
  }

  getPartByName(name: string) {
    name = encodeURIComponent(name);
    return this.http.get<any[]>(this.partsUrl + `/name/${name}`).pipe(
      tap((_) => this.log('fetched part ' + name)),
      catchError(this.handleError('getParts', []))
    );
  }
}
