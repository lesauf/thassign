import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AssignmentCommon } from '@src/app/modules/assignments/components/assignment.common';
import { DateTime, Interval } from 'luxon';

import { MY_FORMATS } from '@src/app/shared/components/month-picker/month-picker.component';
import { ProgramService } from '@src/app/core/services/program.service';
import { Program } from '@src/app/core/models/program.model';

@Component({
  selector: 'app-assignment-midweek',
  templateUrl: './assignment-midweek.component.html',
  styleUrls: ['./assignment-midweek.component.scss'],
})
export class AssignmentMidweekComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input()
  /**
   * Starting day of the month of this program
   */
  month: DateTime;

  @Output()
  editMode: EventEmitter<any> = new EventEmitter();

  currentWeek: DateTime;

  dateFormat = MY_FORMATS.display.dateA11yLabel;

  /**
   * Map of week to programs
   */
  programs: Map<string, Program>;

  constructor(protected programService: ProgramService) {}

  ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    // Get the first week as the first monday of the month
    this.currentWeek = this.month.set({ weekday: 8 });

    this.programs = await this.programService.getReferencePrograms(
      'midweek',
      this.month
    );
  }

  ngOnDestroy() {}

  getMondays() {
    let d = new Date();
    let month = d.getMonth();
    let tuesdays = [];

    d.setDate(1);

    // Get the first Monday in the month
    d.setDate(d.getDate() + ((8 - d.getDay()) % 7));
    // while (d.getDay() !== 1) {
    //     d.setDate(d.getDate() + 1);
    // }

    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
      tuesdays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
    }

    return tuesdays;
  }
}
