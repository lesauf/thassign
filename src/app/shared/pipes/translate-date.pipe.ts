import { PipeTransform, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateTime, Interval } from 'luxon';
import { BehaviorSubject } from 'rxjs';

@Pipe({
  name: 'translateDate',
})
export class TranslateDatePipe implements PipeTransform {
  /**
   * Custom date formats
   */
  dateFormats = {
    'M-DD': {
      month: 'short',
      day: '2-digit',
    },
    'MM-DD': {
      month: 'medium',
      day: '2-digit',
    },
    'MMM-DD': {
      month: 'long',
      day: '2-digit',
    },
    'M-D': {
      month: 'short',
      day: 'numeric',
    },
    'MM-D': {
      month: 'medium',
      day: 'numeric',
    },
    'MMM-D': {
      month: 'long',
      day: 'numeric',
    },
  };
  /**
   * MomentPipe constructor
   */
  constructor(private translate: TranslateService) {}

  /**
   * Make Date dynamic
   * @param format one of the DateTime format constants
   */
  transform(value: DateTime | Interval | string, format?: any): any {
    // make the Date format configurable
    if (format !== undefined) {
      // if not one of DateTime constant, use my own
      format = DateTime.hasOwnProperty(format)
        ? DateTime[format]
        : this.dateFormats[format];
    } else {
      format = DateTime['DATETIME_SHORT'];
    }

    // Initial display of Date.
    // Insert the value into a new behaviour subject. If the language changes,
    // the behaviour subject will be updated
    const dateObs = new BehaviorSubject<string>(this.format(value, format));

    this.translate.onLangChange.subscribe(() => {
      // Rebuild the display of date
      dateObs.next(this.format(value, format));
    });

    return dateObs; // needs to be piped into the async pipe
  }

  /**
   * Handle the generation of the date string
   */
  format(dateVal: DateTime | Interval | string, format: any) {
    let dateString: string;

    // get the initial value and whether it is an interval
    if (Interval.isInterval(dateVal)) {
      // Setting the locale to both ends of the interval
      dateVal = dateVal.mapEndpoints((endPoint) =>
        endPoint.setLocale(this.translate.currentLang)
      );

      // building the interval string
      dateString =
        dateVal.start.toLocaleString(format) +
        ' - ' +
        dateVal.end.toLocaleString(format);
    } else if (DateTime.isDateTime(dateVal)) {
      dateVal.setLocale(this.translate.currentLang);

      dateString = dateVal.toLocaleString(format);
    } else {
      dateVal = DateTime.fromISO(dateVal).setLocale(this.translate.currentLang);
      dateString = dateVal.toLocaleString(format);
    }

    return dateString;
  }
}
