import { Injectable } from '@angular/core';

import { Program } from '@src/app/core/models/program.model';

/**
 * - Parse epub to extract all the assignments
 */
@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  program: Program;

  constructor() {}
}
