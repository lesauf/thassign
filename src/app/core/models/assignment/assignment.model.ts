import { FormControl, FormGroup } from '@angular/forms';
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
import { exit } from 'process';

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

  /**
   * Theme of the assignment
   */
  @IsString()
  @IsOptional()
  title: string;

  /**
   * Description of the assignment
   */
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  hall = 'main'; // "main" | "second" | "third"

  @IsInt()
  @IsOptional()
  number: number; // like public talk number

  private _assignableUsers: User[];

  private _assignableAssistants: User[];

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(props?: object, allParts?: Part[], allUsers?: User[]) {
    if (props) {
      // Converting week to Luxon date if not
      if (!props['week']?.hasOwnProperty('isLuxonDateTime')) {
        const refDate = DateTime.utc();

        props['week'] = DateTime.fromISO(props['week'], {
          zone: refDate.zone,
          locale: refDate.locale,
        });
      }

      // Get part, assignee, assistant
      props = this.convertForeignKeys(props, allParts, allUsers);

      Object.assign(this, props);
    }
  }

  /**
   * Replace part, assignee and assistant with model object.
   * if coming from the DB. The form contain already the right Objects types
   * @param props
   * @param allParts
   * @param allUsers
   */
  convertForeignKeys(props: object, allParts?: Part[], allUsers?: User[]) {
    // Part
    if (allParts && props['part']) {
      const part = allParts.find((part) => part.name === props['part']);
      props['part'] = part ? part : '';
    }

    if (allUsers) {
      // Assignee
      if (props['assignee']) {
        const assignee = allUsers.find(
          (user) => user._id === props['assignee']
        );
        props['assignee'] = assignee ? assignee : '';
      }

      // Assistant
      if (props['assistant']) {
        const assistant = allUsers.find(
          (user) => user._id === props['assistant']
        );
        props['assistant'] = assistant ? assistant : '';
      }
    }

    return props;
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
    if (!this.title) {
      delete this.title;
    }
    if (!this.description) {
      delete this.description;
    }
    if (!this.number) {
      delete this.number;
    }
  }

  toFormGroup() {
    return new FormGroup({
      week: new FormControl(this.week || ''),
      part: new FormControl(this.part || ''),
      assignee: new FormControl(this.assignee || ''),
      hall: new FormControl(this.hall || ''),
      ownerId: new FormControl(this.ownerId || ''),
      position: new FormControl(this.position),
      assistant: new FormControl(this.assistant || ''),
      title: new FormControl(this.title || ''),
      description: new FormControl(this.description || ''),
      number: new FormControl(this.number || ''),
    });
  }

  /**
   * Convert to a standard object for saving
   */
  toObject() {
    return {
      ...(this._id && { _id: this._id }),
      ownerId: this.ownerId,
      week: this.week.toFormat('yyyyMMdd'),
      part: this.part.name,
      position: this.position,

      ...(this.assignee && { assignee: this.assignee._id }),
      ...(this.assistant && { assistant: this.assistant._id }),
      ...(this.title && { title: this.title }),
      ...(this.description && { description: this.description }),
      ...(this.hall && { hall: this.hall }),
      ...(this.number && { number: this.number }),
    };
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
   * The unique identifier of this assignment in the form
   */
  get key() {
    return this.week.toFormat('yyyyMMdd') + this.position;
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
}
