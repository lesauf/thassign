import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AssignmentCommon } from '../assignment.common';
import { DateTime, Interval } from 'luxon';

import { MY_FORMATS } from 'src/app/shared/components/month-picker/month-picker.component';

@Component({
  selector: 'app-assignment-midweek',
  templateUrl: './assignment-midweek.component.html',
  styleUrls: ['./assignment-midweek.component.scss']
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

  constructor() { }

  ngOnInit() { }

  async ngOnChanges(changes: SimpleChanges) {
    const firstMondayOfMonth = this.month.set({ weekday: 8 }).setLocale('fr'); // set the date as the first monday of the month
    const endTime = firstMondayOfMonth.plus({ days: 6 }).setLocale('fr');

    this.week = Interval.fromDateTimes(firstMondayOfMonth, endTime);
    // console.log(firstMondayOfMonth);
  }

  ngOnDestroy() { }
}
