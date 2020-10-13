import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

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
  program: Program;

  constructor(
    protected backendService: BackendService,
    protected epubService: EpubService,
    protected messageService: MessageService,
    protected partService: PartService
  ) {
    super();
  }

  /**
   * Get the english programs list (the reference) either from the DB
   * or the epub file
   * @param meeting
   * @param month
   */
  async getReferencePrograms(meeting: meetingName, month: DateTime) {
    let programs = new Map();

    if (meeting === 'midweek') {
      // get the midweek meeting from the db ()
      const dbResults = await this.backendService
        .getCollectionWithConverter('referencePrograms', new ProgramConverter())
        .where('month', '==', month.toISO())
        .get();
      
      if (!dbResults.empty) {
        dbResults.forEach(function(doc) {
          programs.set(doc.id, doc.data());
        });
      } else {
        // If not in the db get it from the epub and save in the db
        // if not found in the epub throw error
        const epubFilename = 'mwb_E_' + month.toFormat('yyyyMM');
        programs = (await this.getProgramFromEnglishEpub(
          epubFilename
        ));

        await this.backendService.upsertManyDocs(
          'referencePrograms',
          new ProgramConverter(),
          Array.from(programs.values())
        );
      }
    }
    else if (meeting === 'weekend') {
    }
    else {
      this.messageService.add(meeting + ': There is not such meeting for now');
    }

    return programs;
  }

  /**
   * For now I can only safely extract program from english epub
   * @todo Modify to extract from any language epub
   * @param epubFilename
   * @param week
   */
  async getProgramFromEnglishEpub(epubFilename: string, week?: DateTime) {
    if (this.epubService.getLanguageFromEpubFilename(epubFilename) !== 'E') {
      this.messageService.log('Please provide the english epub for ' + epubFilename);
    }

    const roughPrograms = await this.epubService.getProgramsFromEpub(
      epubFilename
    );

    const convPrograms = this.convertPrograms(roughPrograms) as Program[];
    const programs = new Map();
    convPrograms.forEach(program => {
      programs.set(program.week.toISO(), program);
    });

    return programs;
  }

  /**
   * Create Program instances from JSON or array of JSON objects
   *
   * @param roughPrograms JSON object/array with properties
   */
  convertPrograms(roughPrograms: object): Program | Program[] {
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
}
