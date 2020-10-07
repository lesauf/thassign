import { Injectable } from '@angular/core';

import { CommonService } from '@src/app/core/services/common.service';
import { MessageService } from '@src/app/core/services/message.service';
// import { any } from 'server/src/modules/parts/part.model';
import { StitchService } from '@src/app/core/services/stitch.service';
import { Part } from '@src/app/core/models/part/part.model';
import { partMocks } from '@src/app/core/mocks/parts.mock';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendService } from '@src/app/core/services/backend.service';

/**
 * Get data about parts from storage
 */
@Injectable({
  providedIn: 'root',
})
export class PartService extends CommonService<Part> {
  allParts: any[] = [];

  /**
   * Object storing the nice names of meeting parts,
   * grouped by meetings
   */
  meetingParts = {
    weekend: [
      'weekend.publicTalk.chairman',
      'weekend.publicTalk.speaker',
      'weekend.watchtower.conductor',
      'weekend.watchtower.reader',
    ],
    'midweek-students': [
      'clm.treasures.bible-reading',
      'clm.ministry.initial-call',
      'clm.ministry.return-visit',
      'clm.ministry.return-visit',
      'clm.ministry.bible-study',
      'clm.ministry.talk',
      'clm.ministry.assistant',
    ],
  };

  protected collectionName = 'parts';
  protected serviceName = 'PartService';

  constructor(
    protected messageService: MessageService,
    protected backendService: BackendService
  ) {
    super();

    // this.fetchParts();
    this.storeParts(partMocks);
  }

  /**
   * Get all parts
   */
  getParts() {
    return this.dataStore.getValue();
  }

  /**
   * Get all parts from the server and store them
   */
  storeParts(parts: any[]): Part[] {
    this.log('Stored parts', 'PartService');

    // const result = await this.callFunction('getAllParts');

    const allParts = this.createPart(parts) as Part[];
    this.updateStore(allParts);

    return allParts;
  }

  /**
   * get the parts objects of the current meeting
   */
  getPartsByMeeting(meetingName: string): Part[] {
    const parts = this.getParts();


    const partsOfMeeting = parts.filter((part) =>
      this.meetingParts[meetingName].includes(part.name)
    );

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
    const allPartsGrouped = [];
    // list of meeting names
    const meetings = [];

    this.getParts().forEach((part) => {
      // if the meeting name is already saved, we skip
      if (
        !meetings.find((meeting) => {
          return meeting === part.meeting;
        })
      ) {
        allPartsGrouped.push(
          this.getParts().filter((p) => p.meeting === part.meeting)
        );

        meetings.push(part.meeting);
      }
    });
    // console.log(allPartsGrouped, meetings);
    return { parts: allPartsGrouped, meetings: meetings };
  }

  /**
   * Create Part instances from JSON or array of JSON objects
   *
   * @param props JSON object/array with properties
   */
  createPart(props?: object): Part | Part[] {
    if (props instanceof Array) {
      return props.map((obj) => new Part(obj)) as Part[];
    } else {
      return new Part(props) as Part;
    }
  }

  getPartByName(partName: string) {
    return this.getParts().find((p) => p.name === partName);
  }
}

// async getPartsNames() {
//   const partsNames = [];

//   this.getParts().forEach((part) => {
//     partsNames.push(part.name);
//   });
//   return partsNames;
// }
