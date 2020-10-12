import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { EpubService } from '@src/app/core/services/epub.service';
import { PartService } from './part.service';
import { Program } from '@src/app/core/models/program.model';
/**
 * - Parse epub to extract all the assignments
 */
@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  program: Program;

  constructor(
    private epubService: EpubService,
    private partService: PartService
  ) {
    this.getProgramFromEnglishEpub('mwb_E_202011');
  }

  /**
   * For now I can only safely extract program from english epub
   * @todo Modify to extract from any language epub
   * @param epubFilename
   * @param week
   */
  async getProgramFromEnglishEpub(epubFilename: string, week?: DateTime) {
    if (this.epubService.getLanguageFromEpubFilename(epubFilename) !== 'E') {
      throw 'Please provide the english epub for ' + epubFilename;
    }

    const roughPrograms = await this.epubService.getProgramsFromEpub(
      epubFilename
    );

    const programs = this.convertPrograms(roughPrograms);

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
