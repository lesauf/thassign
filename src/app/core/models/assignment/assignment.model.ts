import {
  IsBoolean,
  IsDate,
  IsString,
  IsInt,
  IsObject,
  IsOptional,
} from 'class-validator';
import { DateTime } from 'luxon';

import { Part, ObjectId } from '@src/app/core/models/part/part.model';
import { User } from '@src/app/core/models/user/user.model';

export class Assignment {
  @IsObject()
  @IsOptional()
  // Joi.string().alphanum()
  // tslint:disable-next-line: variable-name
  _id: string;

  @IsObject()
  @IsOptional()
  week: DateTime;

  @IsString()
  part: Part;

  @IsString()
  assignee: User;

  @IsString()
  ownerId: string;

  @IsString()
  @IsOptional()
  assistant: User;

  /**
   * Zero-based position of the assignment in its week
   */
  @IsInt()
  position = 1;

  @IsString()
  @IsOptional()
  title: string; // theme of the assignment

  @IsString()
  @IsOptional()
  hall = 'main'; // "main" | "second" | "third"

  @IsInt()
  @IsOptional()
  number: number; // like public talk number

  // // Joi.date().default(Date.now()),
  // @IsDate()
  // @IsOptional()
  // createdAt: Date;

  // // Joi.date(),
  // @IsDate()
  // @IsOptional()
  // updatedAt: Date;

  // // deleted: Joi.boolean().default(false),
  // @IsBoolean()
  // @IsOptional()
  // deleted = false;

  // // Joi.date(),
  // @IsDate()
  // @IsOptional()
  // deletedAt: Date;

  // // Joi.string(),
  // @IsInt()
  // @IsOptional()
  // deletedBy: string;

  private _assignableUsers: User[];

  private _assignableAssistants: User[];

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(props?: object) {
    if (props) {
      // Converting week to Luxon date
      if (!props['week']?.hasOwnProperty('isLuxonDateTime')) {
        const refDate = DateTime.utc();

        props['week'] = DateTime.fromISO(props['week'], {
          zone: refDate.zone,
          locale: refDate.locale,
        });
      }

      // Setting position
      // if (props['part']) {
      //   this.position = props['part'].position;
      // }

      // converting part to Part
      // if (props['part'].constructor.name !== 'Part') {

      // }

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
  prepareToSave(): void {
    // Remove empty fields
    if (!this.assistant) {
      delete this.assistant;
    }
    // if (!this.deletedAt) {
    //   delete this.deletedAt;
    // }
    // if (!this.deletedBy) {
    //   delete this.deletedBy;
    // }
    // if (!this.updatedAt) {
    //   delete this.updatedAt;
    // }
    if (!this.title) {
      delete this.title;
    }
    if (!this.number) {
      delete this.number;
    }

    // Remove also createdAt ?
    // if (this.createdAt) {
    //   delete this.createdAt;
    // }
  }

  /**
   * Convert to a standard object for saving
   */
  toObject() {
    // Define updatedAt field if the _id field exist
    // if (this._id === undefined) {
    //   this.createdAt = new Date();
    // } else {
    //   this.updatedAt = new Date();
    // }

    return {
      ...(this._id && { _id: this._id }),
      ownerId: this.ownerId,
      week: this.week,
      part: this.part,
      assignee: this.assignee,
      position: this.position,

      ...(this.assistant && { assistant: this.assistant }),
      ...(this.title && { title: this.title }),
      ...(this.hall && { hall: this.hall }),
      ...(this.number && { number: this.number }),
      // ...(this.createdAt && { createdAt: this.createdAt }),
      // ...(this.updatedAt && { updatedAt: this.updatedAt }),
      // ...(this.deletedAt && { deletedAt: this.deletedAt }),
      // ...(this.deletedBy && { deletedBy: this.deletedBy }),
    };
  }
}
