import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsString,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsUUID,
  IsDefined,
  MinLength,
} from 'class-validator';
import { DateTime } from 'luxon';

import { Part, ObjectId } from '../part/part.model';
import { User } from '../user/user.model';

export class Assignment {
  @IsObject()
  @IsOptional()
  week: DateTime;

  @IsString()
  part: Part = null;

  @IsString()
  assignee: User = null;

  @IsString()
  @IsOptional()
  assistant: User = null;

  /**
   * Zero-based position of the assignment in its week
   */
  @IsInt()
  position = 1;

  @IsString()
  @IsOptional()
  title: string = null; // theme of the assignment

  @IsString()
  @IsOptional()
  hall = 'main'; // "main" | "second" | "third"

  @IsInt()
  @IsOptional()
  number: number = null; // like public talk number

  @IsString()
  ownerId: string;

  // Joi.date().default(Date.now()),
  @IsDate()
  @IsOptional()
  createdAt: Date = new Date();

  // Joi.date(),
  @IsDate()
  @IsOptional()
  updatedAt: Date = null;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted = false;

  // Joi.date(),
  @IsDate()
  @IsOptional()
  deletedAt: Date = null;

  // Joi.string(),
  @IsInt()
  @IsOptional()
  deletedBy: string = null;

  private _assignableUsers: User[];

  private _assignableAssistants: User[];

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(props?: object) {
    if (props) {
      if (!props['week'].hasOwnProperty('isLuxonDateTime')) {
        const refDate = DateTime.utc();
        props['week'] = DateTime.fromJSDate(props['week'], {
          zone: refDate.zone,
          locale: refDate.locale,
        });
      }

      Object.assign(this, props);
    }
  }

  /**
   * The unique identifier of this assignment in the form
   */
  get key() {
    return this.week.toISODate() + this.position;
  }

  set assignableUsers(users: User[]) {
    this._assignableUsers = users;
  }

  get assignableUsers() {
    return this._assignableUsers;
  }

  set assignableAssistants(users: User[]) {
    this._assignableAssistants = users;
  }

  get assignableAssistants() {
    return this._assignableAssistants;
  }

  /**
   * Create instances from JSON or array of JSON objects
   *
   * @param properties JSON object with properties
   */
  public static fromJson(properties?: object) {
    if (properties instanceof Array) {
      return properties.map((obj) => new Assignment(obj));
    } else {
      return new Assignment(properties);
    }
  }

  /**
   * Convert the user to the format accepted in the db
   * for example, replace parts with their ids
   */
  //  prepareToSave(): void {
  //    // Replace part, user, assignee with their ids
  //    this.part = (this.part as Part)._id;

  //    this.assignee = ...(this.assignee !== null && (this.assignee as User)._id);

  //    this.assistant = (this.part as Part)._id;
  //  }
}
