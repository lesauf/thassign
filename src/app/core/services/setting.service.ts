import { Injectable } from '@angular/core';

export const DATE_FORMATS = {
  parse: 'DD/MM/YYYY',
  parseMonth: 'MM YYYY',
  display: 'DD/MM/YYYY',
  monthYearLabel: 'MMM YYYY',
  displayFull: 'LL',
  store: 'YYYY-MM-DD'
};

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  /**
   * Display the Students part ?
   * if undefined display all parts
   * 
   * Useful for CLM overseer or coordinator to filter the parts
   * he works on
   */
  displayStudentsParts: boolean = true;

  constructor() {
   
  }

  /**
   * Start day of week : 0 = Sunday | 1 = Monday
   */
  getStartDayOfWeek(): number {
    return 1;
  }

  getDateFormat(key: string) {
    return DATE_FORMATS[key];
  }
}
