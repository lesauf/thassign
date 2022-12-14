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

import { Part } from '@src/app/core/models/part/part.model';
import { Assignment } from '@src/app/core/models/assignment/assignment.model';

export class User {
  @IsObject()
  @IsOptional()
  // Joi.string().alphanum()
  // tslint:disable-next-line: variable-name
  _id: string;

  // @(jf.string().required())
  @MinLength(1, { message: 'error.firstName.any.empty' })
  firstName: string;

  // @(jf.string().required())
  @MinLength(1, { message: 'error.lastName.any.empty' })
  @IsOptional()
  lastName: string;

  // Joi.string().optional().allow('man', 'woman')
  @IsString({ message: 'error.genre.any.empty' })
  @IsIn(['man', 'woman'])
  genre: string;

  /**
   * User id of the creator
   */
  // @(jf.string().required())
  @IsString()
  ownerId: string;

  /**
   * Congregation Id
   */
  // Joi.string()
  @IsString()
  @IsOptional()
  congregation: string;

  // Joi.string()
  //   .email({ tlds: { allow: false } })
  //   .allow(null, ''),
  @IsEmail({}, { message: 'error.email.string.email' })
  @IsOptional()
  email: string;

  // Joi.boolean().optional().default(true),
  @IsBoolean()
  @IsOptional()
  baptized;

  // Joi.boolean().optional().default(true),
  @IsBoolean()
  @IsOptional()
  publisher: boolean;

  // Joi.boolean().optional().default(false),
  @IsBoolean()
  @IsOptional()
  child: boolean;

  // Joi.string().optional().allow(null, ''),
  @IsString()
  @IsOptional()
  phone: string;

  // Joi.string().optional().allow(null),
  @IsString()
  @IsOptional()
  overseer: string;

  // Joi.boolean().optional().default(false), // Cannot receive assignments
  @IsBoolean()
  @IsOptional()
  disabled: boolean;

  // Joi.string().optional(),
  @IsString()
  @IsOptional()
  hashedPassword: string;

  /**
   * Array of Part _ids
   */
  // Joi.array().allow(null),
  @IsArray()
  parts: Part[] | string[] = [];

  @IsArray()
  assignments: object = null;

  // Joi.boolean().optional().default(false), // Can modify programs
  @IsBoolean()
  @IsOptional()
  activated: boolean;

  // Joi.date().default(Date.now()),
  @IsDate()
  @IsOptional()
  createdAt: Date;

  // Joi.date(),
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted = false;

  // Joi.date(),
  @IsDate()
  @IsOptional()
  deletedAt: Date;

  // Joi.string(),
  @IsInt()
  @IsOptional()
  deletedBy: string;

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(
    userProperties?: object,
    allParts?: Part[],
    allAssignments?: Assignment[]
  ) {
    if (userProperties) {
      // If the Users are coming from the DB (first part is an ObjectId),
      // convert parts names array to an array of Part
      // console.log('User props: ', userProperties);

      if (
        allParts &&
        userProperties['parts'] &&
        typeof userProperties['parts'][0] === 'string'
      ) {
        userProperties['parts'] = userProperties['parts']
          ? userProperties['parts'].map((partName: any) =>
              allParts.find((part: Part) => {
                return partName === part.name;
              })
            )
          : [];
      }

      // get the assignments of the user
      const assignments = {};
      if (allAssignments && userProperties['_id'] !== undefined) {
        // First filter the user assignments
        userProperties['assignments'] = allAssignments.filter(
          (ass: Assignment) => {
            return ass.assignee?._id === userProperties['_id'];
          }
        );
        // Convert them to Map
        userProperties['assignments'].forEach((ass) => {
          const key = ass.key;
          assignments[key] = ass;
        });
        userProperties['assignments'] = assignments;
      }
      // console.log(userProperties);
      // Assign the properties to this object
      Object.assign(this, userProperties);
    }
  }

  /**
   * Convert the user to the format accepted in the db
   * for example, replace parts with their ids
   */
  prepareToSave(): void {
    // Replace parts with their names
    this.parts = (this.parts as Part[]).map((part) => part.name);

    // Remove empty fields
    // if (!this.email) {
    //   delete this.email;
    // }
    // if (!this.phone) {
    //   delete this.phone;
    // }
    // if (!this.overseer) {
    //   delete this.overseer;
    // }
    // if (!this.congregation) {
    //   delete this.congregation;
    // }

    // Remove the get properties
    // delete this.fullName;
  }

  /**
   * Convert to a standard object for saving
   */
  toObject() {
    // Define updatedAt field if the _id field exist
    if (this._id === undefined) {
      this.createdAt = new Date();
    } else {
      this.updatedAt = new Date();
    }

    return {
      ...(this._id && { _id: this._id }),
      ownerId: this.ownerId,
      firstName: this.firstName,
      deleted: this.deleted,
      ...(this.genre && { genre: this.genre }),
      parts: this.parts,
      assignments: this.assignments,

      ...(this.email !== undefined && { email: this.email }),
      ...(this.lastName !== undefined && { lastName: this.lastName }),
      ...(this.congregation !== undefined && {
        congregation: this.congregation,
      }),
      ...(this.baptized !== undefined && { baptized: this.baptized }),
      ...(this.publisher !== undefined && { publisher: this.publisher }),
      ...(this.child !== undefined && { child: this.child }),
      ...(this.phone !== undefined && { phone: this.phone }),
      ...(this.overseer !== undefined && { overseer: this.overseer }),
      ...(this.disabled !== undefined && { disabled: this.disabled }),
      ...(this.hashedPassword !== undefined && {
        hashedPassword: this.hashedPassword,
      }),
      ...(this.activated !== undefined && { activated: this.activated }),
      ...(this.createdAt !== undefined && { createdAt: this.createdAt }),
      ...(this.updatedAt !== undefined && { updatedAt: this.updatedAt }),
      ...(this.deletedAt !== undefined && { deletedAt: this.deletedAt }),
      ...(this.deletedBy !== undefined && { deletedBy: this.deletedBy }),
    };
  }

  /**
   * Create instances from JSON or array of JSON objects
   * These are coming from the form for example
   * @param userProperties JSON object with properties
   */
  // public static fromJson(userProperties?: object) {
  //   if (userProperties instanceof Array) {
  //     return userProperties.map((obj) => new User(obj));
  //   } else {
  //     return new User(userProperties);
  //   }
  // }

  // Some virtual properties
  get fullName() {
    if (this.lastName) {
      return this.firstName + ' ' + this.lastName;
    }
    return this.firstName ? this.firstName : 'UPDATE INFOS !';
  }

  get type(): string {
    let generatedType = '';
    if (this.genre === 'man') {
      if (this.child) {
        generatedType = 'boy';
      } else if (this.overseer === 'elder') {
        generatedType = 'elder';
      } else if (this.overseer === 'ministerial-servant') {
        generatedType = 'ministerial-servant';
      } else {
        generatedType = 'man';
      }
    } else if (this.genre === 'woman') {
      generatedType = this.child ? 'girl' : 'woman';
    } else {
      generatedType = 'unknown';
    }

    return generatedType;
  }

  set type(type: string) {}

  get progress() {
    let progress = '';
    if (!this.baptized) {
      progress = 'not-publisher'; // default value
      if (this.publisher) {
        progress = 'unbaptized-publisher';
      }
    }

    return progress;
  }

  set progress(progress) {}

  /**
   * List of meetings the users have parts on
   */
  get meetingsAssignable(): string[] {
    const _meetingsAssignable = [];

    this.parts?.forEach((part) => {
      if (!_meetingsAssignable.includes(part['meeting'])) {
        _meetingsAssignable.push(part['meeting']);
      }
    });

    return _meetingsAssignable;
  }

  set meetingsAssignable(meetingsAssignable) {}

  get assignmentsDisplay(): string {
    let aDisplay = '';

    Object.values(this.assignments).forEach((v, k) => {
      aDisplay = aDisplay + v.week.toLocaleString();
    });

    return aDisplay;
  }

  set assignmentsDisplay(assignmentsDisplay) {}

  get lastAssignment(): Assignment {
    if (!Object.keys(this.assignments).length) {
      return null;
    }

    const keys = Object.keys(this.assignments);
    // the key of the assignments is a string
    keys.sort();
    //   (a, b) => {
    //   if (a.week < b.week) {
    //     return 1;
    //   }

    //   if (a.week > b.week) {
    //     return -1;
    //   }
    //   return 0;
    // });
    const lastKey = keys.pop();

    return this.assignments[lastKey];
    // return this.assignments[0];
  }

  set lastAssignment(lastAssignment) {}
}
