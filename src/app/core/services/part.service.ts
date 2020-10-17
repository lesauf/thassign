import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
      'clm.ministry.bible-study',
      'clm.ministry.talk',
      'clm.ministry.assistant',
    ],
  };

  protected collectionName = 'parts';
  protected serviceName = 'PartService';

  constructor(
    protected messageService: MessageService,
    protected backendService: BackendService,
    protected translateService: TranslateService
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
    // this.log('Stored parts', 'PartService');

    // const result = await this.callFunction('getAllParts');

    const allParts = this.createPart(parts) as Part[];
    this.updateStore(allParts);

    return allParts;
  }

  /**
   *
   * @param title translated title
   * @param partSection
   */
  getPartByTranslatedTitle(
    title: string,
    partSection: 'chairman' | 'treasures' | 'ministry' | 'christianLiving',
    description: string
  ) {
    const parts = this.getParts();

    // Get if the title is among the translated part
    // Text comparisons are made on lowercase
    const correspondingPart = parts.find((part) => {
      const t: string = this.getTranslationOf(part.name);
      return t.toLowerCase() == title.toLowerCase();
    });
    if (correspondingPart !== undefined) {
      return correspondingPart;
    } else if (partSection === 'treasures') {
      // Digging or Treasures talk
      return this.getPartByName('clm.talk-or-discussion');
    } else {
      // Song and prayer
      const song = this.getTranslationOf('song').toLowerCase();
      const prayer = this.getTranslationOf('prayer').toLowerCase();
      if (
        title.toLowerCase().includes(song) &&
        title.toLowerCase().includes(prayer)
      ) {
        return this.getPartByName('clm.prayer');
      }

      // Songs, Opening/concluding comments
      // or presentation videos (last from ministry)
      const openingComments = this.getTranslationOf(
        'comments.opening'
      ).toLowerCase();
      const concludingComments = this.getTranslationOf(
        'comments.concluding'
      ).toLowerCase();
      if (
        (title.toLowerCase().includes(song) && description === '') || //song
        title.toLowerCase() === openingComments.toLowerCase() || // op comment
        title.toLowerCase() === concludingComments.toLowerCase() || // concl co
        partSection === 'ministry' // presentation vids
      ) {
        return this.getPartByName('clm.chairman');
      }

      return this.getPartByName('clm.talk-or-discussion');
    }

    console.log(title, partSection);
  }

  /**
   * Get the translations of a key
   * @param key
   */
  getTranslationOf(key: string, interpolateParams?: Object): string {
    return this.translateService.instant(key, interpolateParams);
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
    // list of part types (General, Talk or Discussion, Students)
    const types = [];

    this.getParts().forEach((part) => {
      // if the meeting type is already saved, we skip

      if (
        !types.find((type) => {
          return type === part.type;
        })
      ) {
        allPartsGrouped.push(
          this.getParts().filter((p) => p.type === part.type)
        );

        types.push(part.type);
      }
    });
    // console.log(allPartsGrouped, meetings);
    return { parts: allPartsGrouped, meetings: types };
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
