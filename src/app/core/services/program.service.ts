import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { BehaviorSubject, interval, Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { BackendService } from '@src/app/core/services/backend.service';
import { CommonService } from '@src/app/core/services/common.service';
import { EpubService } from '@src/app/core/services/epub.service';
import { MessageService } from '@src/app/core/services/message.service';
import { PartService } from './part.service';
import { meetingName } from '@src/app/core/types/meeting.type';
import { ProgramConverter } from '@src/app/core/models/program.converter';
import { Program } from '@src/app/core/models/program.model';
/**
 * - Parse epub to extract all the assignments
 */
@Injectable({
  providedIn: 'root',
})
export class ProgramService extends CommonService<Program> {
  /**
   * Reference programs
   * Map of week to programs
   */
  referencePrograms: Map<string, Program[]>;

  /**
   * Map of lang -> shortLangCode
   */
  langs = { en: 'E', fr: 'F' };

  /**
   * Current month program store
   */
  private mProgramStore: BehaviorSubject<
    Map<string, Program>
  > = new BehaviorSubject(null);

  /**
   * Current month program observable
   */
  mPrograms: Observable<
    Map<string, Program>
  > = this.mProgramStore.asObservable();

  mwbLangCode: string;

  constructor(
    protected backendService: BackendService,
    protected epubService: EpubService,
    protected messageService: MessageService,
    protected partService: PartService,
    protected translateService: TranslateService
  ) {
    super();
  }

  /**
   * Create Program instances from JSON or map of JSON objects
   *
   * @param roughPrograms JSON object/array with properties
   */
  createProgram(roughPrograms: object): Program | Program[] {
    const allParts = this.partService.getParts();

    if (roughPrograms instanceof Array) {
      return roughPrograms.map(
        (obj) => new Program(this.convertAssignments(obj), allParts)
      ) as Program[];
    } else {
      return new Program(
        this.convertAssignments(roughPrograms),
        allParts
      ) as Program;
    }
  }

  /**
   * Get programs from store
   */
  getPrograms(): Program[] {
    return this.dataStore.getValue() as Program[];
  }

  /**
   * get program of the current month from the store
   *
   * @returns
   */
  async getProgramsByMonth(meeting: meetingName, month: DateTime) {
    const monthStr = month.toFormat('yyyyMM'); // 202011
    let mPrograms = this.convertProgramsToMap(this.dataStore.getValue()) as Map<
      string,
      Program
    >;

    if (mPrograms.size) {
      // If there are programs
      for (let [week, program] of mPrograms) {
        // Remove the programs whose week are not in this month
        if (program.meeting !== meeting && !program.month.equals(month)) {
          mPrograms.delete(week);
        }
      }

      this.mProgramStore.next(mPrograms);
    } 
    
    if (mPrograms.size === 0) {
      mPrograms = await this.getReferencePrograms(meeting, month);
    }

    this.mProgramStore.next(mPrograms);
  }

  /**
   * Get all programs from server
   */
  storePrograms(programs: Program[]): Program[] {
    try {
      // convert to Program objects
      const allPrograms = this.createProgram(programs) as Program[];
      // const allPrograms = programs;
      // console.log('Programs to put in the store :', allPrograms);
      this.updateStore(allPrograms);

      return allPrograms;
    } catch (error) {
      this.handleError('storePrograms', error, [], '');
    }
  }

  /**
   * Get the english programs list (the reference) either from the DB
   * or the epub file
   * @param meeting
   * @param month
   */
  async getReferencePrograms(meeting: meetingName, month: DateTime) {
    this.mwbLangCode = this.langs[this.translateService.currentLang];

    let programs = {};

    if (meeting === 'midweek') {
      // get the midweek meeting from the db ()
      // const dbResults = await this.backendService
      //   .getCollectionWithConverter('referencePrograms', new ProgramConverter())
      //   .where('month', '==', month.toFormat('yyyyMM'))
      //   .get();

      // if (!dbResults.empty) {
      //   // if (dbResults.exists) {
      //   dbResults.forEach(function (doc) {
      //     programs[doc.id] = doc.data();
      //   });
      // } else {
      // If not in the db get it from the epub and
      // if not found in the epub throw error
      const epubFilename = `mwb_${this.mwbLangCode}_${month.toFormat(
        'yyyyMM'
      )}`;
      programs = await this.getProgramFromEpub(epubFilename);

      // Save reference programs in the DB ?
      // await this.backendService.upsertManyDocs(
      //   'referencePrograms',
      //   Object.values(programs),
      //   'set',
      //   false,
      //   new ProgramConverter()
      // );
      // }
    } else if (meeting === 'weekend') {
      // Weekend meeting preparation goes here
    } else {
      this.messageService.add(meeting + ': There is not such meeting for now');
    }

    // Optionally convert the programs here to a map
    return this.convertProgramsToMap(programs);
  }

  /**
   * For now I can only safely extract program from english epub
   * @todo Modify to extract from any language epub
   * @param epubFilename
   * @param week
   */
  async getProgramFromEpub(epubFilename: string, week?: DateTime) {
    // if (this.epubService.getLanguageFromEpubFilename(epubFilename) !== 'E') {
    //   this.messageService.log(
    //     'Please provide the english epub for ' + epubFilename
    //   );
    // }

    const roughPrograms = await this.epubService.getProgramsFromEpub(
      epubFilename
    );

    const convPrograms = this.createProgram(roughPrograms) as Program[];

    // Convert the array to object{week -> program}
    const programs = {};
    convPrograms.forEach((program) => {
      programs[program.week.toFormat('yyyyMMdd')] = program;
    });

    return programs;
  }

  convertAssignments<T>(roughProgram: T): T {
    // Try to get the corresponding parts of the assignments
    roughProgram['assignments'].forEach((ass, index) => {
      roughProgram['assignments'][
        index
      ].part = this.partService.getPartByTranslatedTitle(
        ass.title,
        ass.partSection,
        ass.description
      );
    });

    return roughProgram;
  }

  convertProgramsToMap(programs: any) {
    const convPrograms = new Map();

    if (programs !== null) {
      Object.keys(programs).forEach((week) => {
        convPrograms.set(week, programs[week]);
      });
    }

    return convPrograms;
  }

  //////// Save methods //////////
  /**
   * Insert program if not existent, update it otherwise
   * @param program
   */
  async saveProgram(programs: Program[]): Promise<void> {
    try {
      await this.backendService.upsertManyDocs(
        'programs',
        Object.values(programs),
        'set',
        false,
        new ProgramConverter()
      );

      this.log(`updated program`);
    } catch (error) {
      this.handleError<any>('saveProgram', error);
    }
  }
}
