import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { LuxonDateAdapter } from '@src/app/core/adapters/luxon-date-adapter/luxon-date-adapter';
import { DateTime } from 'luxon';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'yyyy MM'
//   },
//   display: {
//     dateInput: 'MMMM yyyy',
//     monthYearLabel: 'MMMM yyyy',
//     dateA11yLabel: 'LLL dd',
//     monthYearA11yLabel: 'MMMM yyyy'
//   }
// };

export const MY_FORMATS = {
  parse: {
    dateInput: 'yyyy-LL', // 9 2019 -> September 2019
  },
  display: {
    dateInput: { year: 'numeric', month: 'long' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

/**
 * Display a datepicker fixed on months
 * and return the selected month
 *
 * @name MonthPickerComponent
 */
@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // {
    //   provide: DateAdapter,
    //   useClass: LuxonDateAdapter,
    // },
  ],
})
export class MonthPickerComponent implements OnInit, OnChanges {
  @Input() disablePicker: boolean;

  @Output() monthSelected: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('monthPicker') monthPicker: MatDatepicker<DateTime>;

  /**
   * Hold the previous selected month in case of rollback
   * @name previousSelectedMonth
   */
  previousSelectedMonth: DateTime;

  date = new FormControl();

  constructor(dateAdapter: LuxonDateAdapter) {
    // dateAdapter;
  }

  ngOnInit() {
    const firstDayOfMonth = DateTime.utc().startOf('month');
    // console.log(firstDayOfMonth.day);
    // Init the form with the current month
    this.date.setValue(firstDayOfMonth);
    this.emitValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // disable picker when
    if (this.disablePicker) {
      this.date.disable();
    } else {
      this.date.enable();
    }
  }

  /**
   * Emit the selected value
   *
   * @name emitValue
   */
  emitValue() {
    this.monthSelected.emit(this.date.value);
  }

  /**
   * Set the date as the selected month and close the picker
   *
   * @name monthPickerComponent#chosenMonthHandler
   */
  chosenMonthHandler(
    normalizedMonth: DateTime,
    datepicker: MatDatepicker<DateTime>
  ) {
    this.date.setValue(normalizedMonth);
    this.monthPicker.close();
    this.emitValue();
  }

  /**
   * Operate the month arrows
   *
   * @name navigateMonths
   * @param {string} direction - "previous" | "next"
   */
  navigateMonths(direction: string) {
    // get selected month by specifying the format to override any other format
    // defined by the change of locale
    let month: DateTime;

    if (direction === 'previous') {
      month = this.date.value.minus({ months: 1 });
    } else {
      month = this.date.value.plus({ months: 1 });
    }

    // Keep the previous selected month in case of rollback
    this.previousSelectedMonth = this.date.value;

    this.date.setValue(month);
    this.emitValue();
  }
}
