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
  part: string;

  @IsString()
  assignee: string;

  @IsString()
  @IsOptional()
  assistant: string;

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
  createdAt: number = Date.now();

  // Joi.date(),
  @IsDate()
  @IsOptional()
  updatedAt: number;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted = false;

  // Joi.date(),
  @IsDate()
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
  constructor(userProperties?: object) {
    if (userProperties) {
      Object.assign(this, userProperties);
    }
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
