// import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { MomentDateAdapter } from '@angular/material-moment-adapter';
// import {
//   DateAdapter,
//   MAT_DATE_FORMATS,
//   MAT_DATE_LOCALE,
//   MatDatepicker,
//   MatDatepickerInputEvent
// } from '@angular/material/core';
// import {
//   MatDatepicker,
//   MatDatepickerInputEvent
// } from '@angular/material/datepicker';
// import * as moment from 'moment';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'DD/MM/YYYY'
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY'
//   }
// };

// @Component({
//   selector: 'app-week-picker',
//   templateUrl: './week-picker.component.html',
//   styleUrls: ['./week-picker.component.scss'],
//   providers: [
//     {
//       provide: DateAdapter,
//       useClass: MomentDateAdapter,
//       deps: [MAT_DATE_LOCALE]
//     },

//     { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
//   ]
// })
// export class WeekPickerComponent implements OnInit {
//   /**
//    * Day of week starting (0 = sunday, 6 = saturday)
//    */
//   @Input() startDayOfWeek: number;

//   @Output() weekSelected: EventEmitter<any> = new EventEmitter<any>();

//   /**
//    * Hold the previous selected month in case of rollback
//    */
//   previousSelectedWeek: moment.Moment;

//   date = new FormControl();

//   constructor() { }

//   ngOnInit() {
//     // Init the form with the current week
//     this.date.setValue(moment().weekday(this.startDayOfWeek));
//     this.emitValue();
//   }

//   /**
//    * Set the date as the first day of the selected week and
//    * Emit the selected value
//    */
//   dateChanged(normalizedWeek: MatDatepickerInputEvent<moment.Moment>) {
//     // const ctrlValue = moment(this.date.value.format('MM-YYYY'), 'MM-YYYY');
//     const ctrlValue = normalizedWeek.value.weekday(this.startDayOfWeek);
//     this.date.setValue(ctrlValue);
//     this.emitValue();
//   }

//   /**
//    * Operate the week arrows
//    * @param direction "previous" | "next"
//    */
//   navigateWeeks(direction: string) {
//     // get selected week by specifying the format to override any other format
//     // defined by the change of locale
//     const week = moment(
//       this.date.value.format(MY_FORMATS.parse.dateInput),
//       MY_FORMATS.parse.dateInput
//     );
//     if (direction === 'previous') {
//       week.subtract(1, 'week');
//     } else {
//       week.add(1, 'week');
//     }

//     // Keep the previous selected week in case of rollback
//     this.previousSelectedWeek = this.date.value;

//     this.date.setValue(week);
//     this.emitValue();
//   }

//   /**
//    * Send the value to the parent
//    */
//   emitValue() {
//     this.weekSelected.emit(this.date.value);
//   }

//   // disableWeekDays = (d: moment.Moment): boolean => {
//   //   const day = d.get('day');
//   //   // Enable only mondays to be selected.
//   //   return day === this.startDayOfWeek;
//   // };
// }
