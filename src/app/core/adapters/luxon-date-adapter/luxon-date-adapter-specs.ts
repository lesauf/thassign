// import { LOCALE_ID } from '@angular/core';
// import { async, inject, TestBed } from '@angular/core/testing';
// import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';

// import { DateTime, Settings } from 'luxon';

// import { LuxonDateAdapter, LUXON_DATE_FORMATS } from './luxon-date-adapter';

// // avoid confusion when working with months
// const DEC = 12, FEB = 2, JAN = 1, MAR = 3;

// describe('LuxonDateAdapter', () => {
//   let adapter: LuxonDateAdapter;
//   let assertValidDate: (d: DateTime | null, valid: boolean) => void;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: MAT_DATE_LOCALE, useValue: 'en' },
//         { provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS },
//         { provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE] },
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(inject([DateAdapter], (dateAdapter: LuxonDateAdapter) => {
//     Settings.defaultLocale = 'en';
//     adapter = dateAdapter;
//     adapter.setLocale('en');

//     assertValidDate = (d: DateTime | null, valid: boolean) => {
//       expect(adapter.isDateInstance(d)).not.toBeNull(`Expected ${d} to be a date instance`);
//       expect(adapter.isValid(d)).toBe(valid,
//         `Expected ${d} to be ${valid ? 'valid' : 'invalid'},` +
//         ` but was ${valid ? 'invalid' : 'valid'}`);
//     };
//   }));

//   it('should get year', () => {
//     expect(adapter.getYear(DateTime.local(2017, JAN, 1))).toBe(2017);
//   });

//   it('should get month', () => {
//     expect(adapter.getMonth(DateTime.local(2017, JAN, 1))).toBe(0);
//   });

//   it('should get date', () => {
//     expect(adapter.getDate(DateTime.local(2017, JAN, 1))).toBe(1);
//   });

//   it('should get day of week', () => {
//     expect(adapter.getDayOfWeek(DateTime.local(2017, JAN, 1))).toBe(7);
//   });

//   it('should get same day of week in a locale with a different first day of the week', () => {
//     adapter.setLocale('fr');
//     expect(adapter.getDayOfWeek(DateTime.local(2017, JAN, 1))).toBe(7);
//   });

//   it('should get long month names', () => {
//     expect(adapter.getMonthNames('long')).toEqual([
//       'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
//       'October', 'November', 'December'
//     ]);
//   });

//   it('should get short month names', () => {
//     expect(adapter.getMonthNames('short')).toEqual([
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//     ]);
//   });

//   it('should get narrow month names', () => {
//     expect(adapter.getMonthNames('narrow')).toEqual([
//       'J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'
//     ]);
//   });

//   /** skipping this as it doesn't seem to work */
//   it('should get month names in a different locale', () => {
//     adapter.setLocale('zh');
//     expect(adapter.getMonthNames('long')).toEqual([
//       '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
//     ]);
//   });

//   it('should get date names', () => {
//     expect(adapter.getDateNames()).toEqual([
//       '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
//       '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
//     ]);
//   });

//   it('should get date names in a different locale', () => {
//     adapter.setLocale('ja-JP');
//     expect(adapter.getDateNames()).toEqual([
//       '1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日',
//       '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日', '31日'
//     ]);
//   });

//   it('should get long day of week names', () => {
//     expect(adapter.getDayOfWeekNames('long')).toEqual([
//       'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
//     ]);
//   });

//   it('should get short day of week names', () => {
//     expect(adapter.getDayOfWeekNames('short')).toEqual([
//       'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
//     ]);
//   });

//   it('should get narrow day of week names', () => {
//     expect(adapter.getDayOfWeekNames('narrow')).toEqual([
//       'M', 'T', 'W', 'T', 'F', 'S', 'S'
//     ]);
//   });

//   it('should get day of week names in a different locale', () => {
//     adapter.setLocale('ja-JP');
//     expect(adapter.getDayOfWeekNames('long')).toEqual([
//       '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'
//     ]);
//   });

//   it('should get year name', () => {
//     expect(adapter.getYearName(DateTime.local(2017, JAN, 1))).toBe('2017');
//   });

//   it('should get year name in a different locale', () => {
//     adapter.setLocale('ja-JP');
//     expect(adapter.getYearName(DateTime.local(2017, JAN, 1))).toBe('2017年');
//   });

//   it('should get first day of week', () => {
//     expect(adapter.getFirstDayOfWeek()).toBe(0);
//   });

//   /**
//    * The miss-match here is due to the fact that date-picker is 0 indexed for months
//    * Luxon is 1 indexed
//    */
//   it('should create Luxon#DateTime', () => {
//     expect(adapter.createDate(2017, JAN - 1, 1).toISODate()).toEqual(DateTime.local(2017, JAN, 1).toISODate());
//   });

//   it('should create Luxon#DateTime with low year number', () => {
//     expect(adapter.createDate(-1, 1, 1).year).toBe(-1);
//     expect(adapter.createDate(0, 1, 1).year).toBe(0);
//     expect(adapter.createDate(50, 1, 1).year).toBe(50);
//     expect(adapter.createDate(99, 1, 1).year).toBe(99);
//     expect(adapter.createDate(100, 1, 1).year).toBe(100);
//   });

//   it('should get today\'s date', () => {
//     expect(adapter.sameDate(adapter.today(), DateTime.local()))
//       .toBe(true, `should be equal to today's date`);
//   });

//   it('should parse string according to given format', () => {
//     expect(adapter.parse('01/02/2017', 'LL/dd/yyyy').toISODate())
//       .toEqual(DateTime.local(2017, JAN, 2).toISODate());
//     expect(adapter.parse('01/02/2017', 'dd/LL/yyyy').toISODate())
//       .toEqual(DateTime.local(2017, FEB, 1).toISODate());
//   });

//   it('should parse number', () => {
//     const timestamp = new Date().getTime();
//     expect(adapter.parse(timestamp).toISODate()).toEqual(DateTime.fromMillis(timestamp).toISODate());
//   });

//   it('should format date according to given format', () => {
//     expect(adapter.format(DateTime.local(2017, JAN, 2), 'LL/dd/yyyy')).toEqual('01/02/2017');
//     expect(adapter.format(DateTime.local(2017, JAN, 2), 'dd/LL/yyyy')).toEqual('02/01/2017');
//   });

//   it('should format with a different locale', () => {
//     expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('Jan 2, 2017');
//     adapter.setLocale('ja-JP');
//     expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('2017年1月2日');
//   });

//   it('should add years', () => {
//     expect(adapter.addCalendarYears(DateTime.local(2017, JAN, 1), 1).toISODate())
//       .toEqual(DateTime.local(2018, JAN, 1).toISODate());
//     expect(adapter.addCalendarYears(DateTime.local(2017, JAN, 1), -1).toISODate())
//       .toEqual(DateTime.local(2016, JAN, 1).toISODate());
//   });

//   it('should respect leap years when adding years', () => {
//     expect(adapter.addCalendarYears(DateTime.local(2016, FEB, 29), 1).toISODate())
//       .toEqual(DateTime.local(2017, FEB, 28).toISODate());
//     expect(adapter.addCalendarYears(DateTime.local(2016, FEB, 29), -1).toISODate())
//       .toEqual(DateTime.local(2015, FEB, 28).toISODate());
//   });

//   it('should add months', () => {
//     expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 1), 1).toISODate())
//       .toEqual(DateTime.local(2017, FEB, 1).toISODate());
//     expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 1), -1).toISODate())
//       .toEqual(DateTime.local(2016, DEC, 1).toISODate());
//   });

//   it('should respect month length differences when adding months', () => {
//     expect(adapter.addCalendarMonths(DateTime.local(2017, JAN, 31), 1).toISODate())
//       .toEqual(DateTime.local(2017, FEB, 28).toISODate());
//     expect(adapter.addCalendarMonths(DateTime.local(2017, MAR, 31), -1).toISODate())
//       .toEqual(DateTime.local(2017, FEB, 28).toISODate());
//   });

//   it('should add days', () => {
//     expect(adapter.addCalendarDays(DateTime.local(2017, JAN, 1), 1).toISODate())
//       .toEqual(DateTime.local(2017, JAN, 2).toISODate());
//     expect(adapter.addCalendarDays(DateTime.local(2017, JAN, 1), -1).toISODate())
//       .toEqual(DateTime.local(2016, DEC, 31).toISODate());
//   });

//   /** It's ok for the adapter to return the same object as DateTimes are immutable */
//   it('should clone', () => {
//     const date = DateTime.local(2017, JAN, 1);
//     expect(adapter.clone(date).toISODate()).toEqual(date.toISODate());
//     expect(adapter.clone(date)).toBe(date);
//   });

//   it('should compare dates', () => {
//     expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, JAN, 2))).toBeLessThan(0);
//     expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, FEB, 1))).toBeLessThan(0);
//     expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2018, JAN, 1))).toBeLessThan(0);
//     expect(adapter.compareDate(DateTime.local(2017, JAN, 1), DateTime.local(2017, JAN, 1))).toBe(0);
//     expect(adapter.compareDate(DateTime.local(2018, JAN, 1), DateTime.local(2017, JAN, 1))).toBeGreaterThan(0);
//     expect(adapter.compareDate(DateTime.local(2017, FEB, 1), DateTime.local(2017, JAN, 1))).toBeGreaterThan(0);
//     expect(adapter.compareDate(DateTime.local(2017, JAN, 2), DateTime.local(2017, JAN, 1))).toBeGreaterThan(0);
//   });

//   it('should clamp date at lower bound', () => {
//     expect(adapter.clampDate(
//       DateTime.local(2017, JAN, 1), DateTime.local(2018, JAN, 1), DateTime.local(2019, JAN, 1)))
//       .toEqual(DateTime.local(2018, JAN, 1));
//   });

//   it('should clamp date at upper bound', () => {
//     expect(adapter.clampDate(
//       DateTime.local(2020, JAN, 1), DateTime.local(2018, JAN, 1), DateTime.local(2019, JAN, 1)))
//       .toEqual(DateTime.local(2019, JAN, 1));
//   });

//   it('should clamp date already within bounds', () => {
//     expect(adapter.clampDate(
//       DateTime.local(2018, FEB, 1), DateTime.local(2018, JAN, 1), DateTime.local(2019, JAN, 1)))
//       .toEqual(DateTime.local(2018, FEB, 1));
//   });

//   it('should count today as a valid date instance', () => {
//     const d = DateTime.local();
//     expect(adapter.isValid(d)).toBe(true);
//     expect(adapter.isDateInstance(d)).toBe(true);
//   });

//   it('should count an invalid date as an invalid date instance', () => {
//     const d = DateTime.local(NaN);
//     expect(adapter.isValid(d)).toBe(false);
//     expect(adapter.isDateInstance(d)).toBe(true);
//   });

//   it('should count a string as not a date instance', () => {
//     const d = '1/1/2017';
//     expect(adapter.isDateInstance(d)).toBe(false);
//   });

//   it('should count a Date as not a date instance', () => {
//     const d = new Date();
//     expect(adapter.isDateInstance(d)).toBe(false);
//   });

//   it('should create valid dates from valid ISO strings', () => {
//     assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
//     assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
//     assertValidDate(adapter.deserialize('1937-01-01T12:00:27.87+00:20'), true);
//     assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
//     assertValidDate(adapter.deserialize('1/1/2017'), false);
//     expect(adapter.deserialize('')).toBeNull();
//     expect(adapter.deserialize(null)).toBeNull();
//     assertValidDate(adapter.deserialize(new Date()), true);
//     assertValidDate(adapter.deserialize(new Date(NaN)), false);
//     assertValidDate(adapter.deserialize(DateTime.local()), true);
//     assertValidDate(adapter.deserialize(DateTime.invalid('invalid date')), false);
//   });

//   it('returned Moments should have correct locale', () => {
//     adapter.setLocale('ja-JP');
//     expect(adapter.createDate(2017, JAN, 1).locale).toBe('ja-JP');
//     expect(adapter.today().locale).toBe('ja-JP');
//     expect(adapter.clone(DateTime.local()).locale).toBe('ja-JP');
//     expect(adapter.parse('01/01/2017', 'LL/dd/yyyy').locale).toBe('ja-JP');
//     expect(adapter.addCalendarDays(DateTime.local(), 1).locale).toBe('ja-JP');
//     expect(adapter.addCalendarMonths(DateTime.local(), 1).locale).toBe('ja-JP');
//     expect(adapter.addCalendarYears(DateTime.local(), 1).locale).toBe('ja-JP');
//   });

//   it('should not change locale of Moments passed as params', () => {
//     const date = DateTime.local();
//     expect(date.locale).toBe('en');
//     adapter.setLocale('ja-JP');
//     adapter.getYear(date);
//     adapter.getMonth(date);
//     adapter.getDate(date);
//     adapter.getDayOfWeek(date);
//     adapter.getYearName(date);
//     adapter.getNumDaysInMonth(date);
//     adapter.clone(date);
//     adapter.parse(date, 'LL/dd/yyyy');
//     adapter.format(date, 'LL/dd/yyyy');
//     adapter.addCalendarDays(date, 1);
//     adapter.addCalendarMonths(date, 1);
//     adapter.addCalendarYears(date, 1);
//     adapter.toIso8601(date);
//     adapter.isDateInstance(date);
//     adapter.isValid(date);
//     expect(date.locale).toBe('en');
//   });

//   it('should create invalid date', () => {
//     assertValidDate(adapter.invalid(), false);
//   });
// });

// describe('LuxonDateAdapter with MAT_DATE_LOCALE override', () => {
//   let adapter: LuxonDateAdapter;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
//         { provide: MAT_DATE_FORMATS, useValue: LUXON_DATE_FORMATS },
//         { provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_DATE_LOCALE] },
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(inject([DateAdapter], (d: LuxonDateAdapter) => {
//     adapter = d;
//   }));

//   it('should take the default locale id from the MAT_DATE_LOCALE injection token', () => {
//     expect(adapter.format(DateTime.local(2017, JAN, 2), 'DD')).toEqual('2017年1月2日');
//   });
// });
