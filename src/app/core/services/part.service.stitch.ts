import { Injectable } from '@angular/core';
const {
  HttpRequest,
  HttpMethod
} = require('mongodb-stitch-browser-services-http');

import { CommonService } from './common.service';
import { MessageService } from './message.service';
// import { any } from 'server/src/modules/parts/part.model';
import { ConstantsService } from './constants.service';

/**
 * Get data about parts from storage
 */
@Injectable({
  providedIn: 'root'
})
export class PartServiceStitch extends CommonService {
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
      reader: 'weekend.watchtower.reader'
    },
    students: {
      bibleReading: 'clm.treasures.bible-reading',
      initialCall: 'clm.ministry.initial-call',
      firstReturnVisit: 'clm.ministry.first-return-visit',
      secondReturnVisit: 'clm.ministry.second-return-visit',
      bibleStudy: 'clm.ministry.bible-study',
      studentTalk: 'clm.ministry.talk',
      studentAssistant: 'clm.ministry.assistant'
    }
  };

  collection: any;

  // private partsUrl = 'api/part'; // URL to web api

  constructor(
    // messageService: MessageService,
    protected constantsService: ConstantsService
  ) {
    super(null, constantsService);

    this.collection = this.db.collection('parts');
  }

  /**
   * populate allParts property once and for all
   */
  async fetchParts() {
    if (this.allParts.length === 0) {
      await this.getAllParts();
    }
  }

  /**
   * Get all parts from the server
   */
  getParts() {}

  /**
   * Get all parts from the server and store them in the
   * allParts property
   */
  async getAllParts() {
    // const request = new HttpRequest.Builder()
    //   .withMethod(HttpMethod.GET)
    //   .withUrl(
    //     'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/thassign-oykwx/service/PartService/incoming_webhook/getAllPartsHook'
    //   )
    //   .build();

    // const response = await this.dbService.execute(request);
    // const allParts = JSON.parse(response.body);
    // // console.log(response.body);

    // return allParts;
    return await this.authenticate().then(() => {
      console.log('[MongoDB Stitch] Parts fetched from Stitch');
      return this.collection.find({}).asArray();
    });
  }

  /**
   * get the parts objects of the current meeting
   */
  async getPartsByMeeting(meetingName: string) {
    meetingName = encodeURIComponent(meetingName);
    await this.fetchParts();

    const partsOfMeeting = [];
    Object.keys(this.meetingParts[meetingName]).forEach(partName => {
      partsOfMeeting[partName] = this.allParts.find(
        part => part.name === this.meetingParts[meetingName][partName]
      );
    });

    return partsOfMeeting;
  }

  /**
   * Get all part grouped by meeting
   */
  getPartsGroupedByMeeting() {}

  getPartsNames() {}

  getPartById(_id: string) {
    _id = encodeURIComponent(_id);
  }

  getPartByName(name: string) {
    name = encodeURIComponent(name);
  }
}
