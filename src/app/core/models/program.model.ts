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
  @IsObject()
  @IsOptional()
  _id: string;

  @IsString()
  meeting: 'midweek' | 'weekend';

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
}
