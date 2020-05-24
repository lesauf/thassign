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
import { Part } from '../part/part.model';
import { User } from '../user/user.model';

export class Assignment {
  @IsObject()
  @IsOptional()
  // Joi.string().alphanum()
  // tslint:disable-next-line: variable-name
  _id: { toHexString() };

  @IsString()
  @IsDate()
  week: Date;

  @IsString()
  part: Part;

  @IsString()
  assignee: User;

  @IsString()
  @IsOptional()
  assistant: User;

  @IsInt()
  position = 1; // 'Assignment position for same part'), // like many Initial Calls, for example

  @IsString()
  @IsOptional()
  title: string; // theme of the assignment

  @IsString()
  @IsOptional()
  hall = 'main'; // "main" | "second" | "third"

  @IsInt()
  @IsOptional()
  number: number; // like public talk number

  @IsString()
  ownerId: string;

  // Joi.date().default(Date.now()),
  @IsDate()
  @IsOptional()
  createdAt: Date = new Date();

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

  private _assignableUsers: User[];

  private _assignableAssistants: User[];

  /**
   * @todo Sanitize/clean the object passed (apply some rules,
   * like women can not give public talks ...)
   */
  constructor(userProperties?: object) {
    if (userProperties) {
      Object.assign(this, userProperties);
    }
  }

  /**
   * The unique identifier of this assignment in the form
   */
  get key() {
    return this.part.name + this.week.toISOString() + this.position;
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
}
