import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  MinLength,
  IsDate,
  IsDateString,
} from 'class-validator';
import { DateTime } from 'luxon';

import { Assignment } from '@src/app/core/models/assignment/assignment.model';
import { Part } from './part/part.model';

export class Program {
  /**
   * For reference programs the _id is the month string
   */
  @IsObject()
  @IsOptional()
  _id: string;

  @IsString()
  meeting: 'midweek' | 'weekend';

  /**
   * Store the month to speed up search
   */
  @IsObject()
  @IsOptional()
  month: DateTime;

  @IsObject()
  @IsOptional()
  week: DateTime;

  @IsArray()
  assignments: Assignment[];

  @IsString()
  ownerId: string;

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(props?: object, allParts?: Part[]) {
    if (props) {
      // Converting week and month to Luxon date if not
      if (!props['week']?.hasOwnProperty('isLuxonDateTime')) {
        const refDate = DateTime.utc();

        props['week'] = DateTime.fromISO(props['week'], {
          zone: refDate.zone,
          locale: refDate.locale,
        });
        props['month'] = DateTime.fromISO(props['month'], {
          zone: refDate.zone,
          locale: refDate.locale,
        });
      }

      // Object to convert
      if (allParts) {
        props['assignments'] = props['assignments']
          ? props['assignments'].map(
              (roughAssignment: any) => new Assignment(roughAssignment)
            )
          : [];
      }

      // Assign the properties to this object
      Object.assign(this, props);
    }
  }

  /**
   * Convert to a standard object for saving
   */
  toObject(): object {
    let assignments = [];

    // Convert assignments to simple objects
    this.assignments.forEach((ass) => {
      assignments.push(ass.toObject());
    });

    return {
      month: this.week.toFormat('yyyyMM'),
      week: this.week.toFormat('yyyyMMdd'),
      assignments: assignments,
      meeting: this.meeting,
      ...(this._id ? { _id: this._id } : null),
      ...(this.ownerId ? { ownerId: this.ownerId } : null),
    };
  }

  toFormGroup(ownerId: string) {
    const assignmentsArray = [];

    // Prepare the assignments form array
    this.assignments.forEach((assignment) => {
      assignmentsArray[assignment.position] = assignment.toFormGroup();
    });

    // Now prepare the program form itself
    return new FormGroup({
      _id: new FormControl(this._id || ''),
      month: new FormControl(this.month || ''),
      week: new FormControl(this.week || ''),
      meeting: new FormControl(this.meeting || ''),
      ownerId: new FormControl(this.ownerId || ownerId),
      assignments: new FormArray(assignmentsArray),
    });
  }
}
