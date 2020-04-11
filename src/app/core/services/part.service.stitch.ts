import { Injectable } from '@angular/core';

import { CommonService } from './common.service';
import { MessageService } from './message.service';
// import { any } from 'server/src/modules/parts/part.model';
import { StitchService } from './stitch.service';

/**
 * Get data about parts from storage
 */
@Injectable({
  providedIn: 'root',
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

  // private partsUrl = 'api/part'; // URL to web api

  constructor(
    messageService: MessageService,
    protected stitchService: StitchService
  ) {
    super('parts', 'PartService', messageService, stitchService);
  }

  /**
   * populate allParts property once and for all
   * @todo rename init
   */
  async init() {
    if (this.allParts.length === 0) {
      this.allParts = await this.getAllParts();
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
    const allParts = await this.stitchService.callFunction('getAllParts');

    return allParts;
  }

  /**
   * get the parts objects of the current meeting
   */
  getPartsByMeeting(meetingName: string) {
    meetingName = encodeURIComponent(meetingName);
    // await this.init();

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
   *
   * Maintaining actually 2 arrays:
   * 1. parts: any[] subarrays of parts for a meeting
   * 2. meetings: string[] array of meetings names to retrieve the keys
   */
  async getPartsGroupedByMeeting() {
    const meetingsParts = await this.stitchService.callFunction(
      'getPartsGroupedByMeeting'
    );

    const allPartsGrouped = [];
    // list of meeting names
    const meetings = [];

    meetingsParts.forEach((meetingPart) => {
      allPartsGrouped.push(meetingPart.parts);
      meetings.push(meetingPart._id);
    });

    this.log('fetched parts grouped by meeting');

    return { parts: allPartsGrouped, meetings: meetings };
  }

  async getPartsNames() {
    await this.init();

    const partsNames = [];

    this.allParts.forEach((part) => {
      partsNames.push(part.name);
    });
    return partsNames;
  }

  async getPartById(id: string) {
    id = encodeURIComponent(id);

    return await this.collection.findOne({ _id: id });
  }

  async getPartByName(partName: string) {
    partName = encodeURIComponent(name);

    return await this.collection.findOne({ name: partName });
  }
}
