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
import { Part, ObjectId } from '../part/part.model';

export class User {
  @IsObject()
  @IsOptional()
  // Joi.string().alphanum()
  // tslint:disable-next-line: variable-name
  _id: ObjectId;

  // @(jf.string().required())
  @MinLength(1, { message: 'error.firstName.any.empty' })
  firstName: string;

  // @(jf.string().required())
  @MinLength(1, { message: 'error.lastName.any.empty' })
  lastName: string;

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

  // Joi.string().optional().allow('man', 'woman')
  @IsString({ message: 'error.genre.any.empty' })
  @IsIn(['man', 'woman'])
  genre: string;

  // Joi.string()
  //   .email({ tlds: { allow: false } })
  //   .allow(null, ''),
  @IsEmail({}, { message: 'error.email.string.email' })
  @IsOptional()
  email: string;

  // Joi.boolean().optional().default(true),
  @IsBoolean()
  @IsOptional()
  baptized = true;

  // Joi.boolean().optional().default(true),
  @IsBoolean()
  @IsOptional()
  publisher = true;

  // Joi.boolean().optional().default(false),
  @IsBoolean()
  @IsOptional()
  child = false;

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
  disabled = false;

  // Joi.string().optional(),
  @IsString()
  @IsOptional()
  hashedPassword: string;

  /**
   * Array of Part _ids
   */
  // Joi.array().allow(null),
  @IsArray()
  parts: Part[] | ObjectId[];

  // Joi.boolean().optional().default(false), // Can modify programs
  @IsBoolean()
  @IsOptional()
  activated = false;

  // Joi.date().default(Date.now()),
  @IsInt()
  @IsOptional()
  createdAt: number = Date.now();

  // Joi.date(),
  @IsInt()
  @IsOptional()
  updatedAt: number;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted = false;

  // Joi.date(),
  @IsInt()
  @IsOptional()
  deletedAt: number;

  // Joi.string(),
  @IsInt()
  @IsOptional()
  deletedBy: string;

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(userProperties?: object, allParts?: Part[]) {
    if (userProperties) {
      // If the Users are coming from the DB (first part is an ObjectId),
      // convert parts id array to an array of Part
      if (allParts && userProperties['parts'][0].hasOwnProperty('id')) {
        userProperties['parts'] = userProperties['parts'].map((partId: any) =>
          allParts.find((part: Part) => {
            return partId.equals(part._id);

            // return false;
          })
        );
      }

      // Assign the properties to this object
      Object.assign(this, userProperties);
    }
  }

  /**
   * Convert the user to the format accepted in the db
   * for example, replace parts with their ids
   */
  prepareToSave(): void {
    // Replace parts with their ids
    this.parts = (this.parts as Part[]).map((part) => part._id);
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
    return this.firstName + ' ' + this.lastName;
  }

  get type() {
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
    } else {
      generatedType = this.child ? 'girl' : 'woman';
    }

    return generatedType;
  }

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

  /**
   * List of meetings the users have parts on
   */
  get meetingsAssignable(): string[] {
    let _meetingsAssignable = [];

    this.parts.forEach((part) => {
      if (!_meetingsAssignable.includes(part['meeting'])) {
        _meetingsAssignable.push(part['meeting']);
      }
    });

    return _meetingsAssignable;
  }
}
