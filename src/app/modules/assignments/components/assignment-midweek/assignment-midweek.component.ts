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

  week: Interval;

  dateFormat = MY_FORMATS.display.dateA11yLabel;

  constructor() {}

  ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    const firstMondayOfMonth = this.month.set({ weekday: 8 }).setLocale('fr'); // set the date as the first monday of the month
    const endTime = firstMondayOfMonth.plus({ days: 6 }).setLocale('fr');

    this.week = Interval.fromDateTimes(firstMondayOfMonth, endTime);
    // console.log(firstMondayOfMonth);
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
