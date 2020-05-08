import { Injectable } from '@angular/core';

import { CommonService } from './common.service';
import { MessageService } from './message.service';
// import { any } from 'server/src/modules/parts/part.model';
import { StitchService } from './stitch.service';
import { Part } from '../models/part/part.model';

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
  async getParts() {
    await this.init();

    return this.allParts;
  }

  /**
   * Get all parts from the server and store them in the
   * allParts property
   */
  async getAllParts() {
    console.log('Fetching parts from server');

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
    await this.init();

    const allPartsGrouped = [];
    // list of meeting names
    const meetings = [];

    // this.stitchService
    //   .callFunction('getPartsGroupedByMeeting')
    //   .then((meetingsParts) => {
    //     meetingsParts.forEach((meetingPart) => {
    //       allPartsGrouped.push(meetingPart.parts);
    //       meetings.push(meetingPart._id);
    //     });

    //     console.log('fetched parts grouped by meeting');
    //   });

    this.allParts.forEach((part) => {
      // if the meeting name is already saved, we skip
      if (
        !meetings.find((meeting) => {
          return meeting === part.meeting;
        })
      ) {
        allPartsGrouped.push(
          this.allParts.filter((p) => p.meeting === part.meeting)
        );

        meetings.push(part.meeting);
      }
    });

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

  getPartName(partId): string {
    const part = this.getPartById(partId);

    return part.name;
  }

  getPartById(partId): Part {
    const part = this.allParts.find(
      (p) => p._id.toHexString() === partId.toHexString()
    );

    return part;
  }

  async getPartByName(partName: string) {
    partName = encodeURIComponent(name);

    return await this.collection.findOne({ name: partName });
  }
}
