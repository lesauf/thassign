import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsString,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  IsDefined,
  MinLength,
} from 'class-validator';

export class User {
  @IsUUID()
  @IsOptional()
  // Joi.string().alphanum()
  // tslint:disable-next-line: variable-name
  _id: string;

  // @(jf.string().required())
  @IsString({ message: 'error.firstName.any.empty' })
  firstName: string;

  // @(jf.string().required())
  @IsString({ message: 'error.lastName.any.empty' })
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
  @IsUUID()
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
  baptized: boolean = true;

  // Joi.boolean().optional().default(true),
  @IsBoolean()
  @IsOptional()
  publisher: boolean = true;

  // Joi.boolean().optional().default(false),
  @IsBoolean()
  @IsOptional()
  child: boolean = false;

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
  disabled: boolean = false;

  // Joi.string().optional(),
  @IsString()
  @IsOptional()
  hashedPassword: string;

  /**
   * Array of Part _ids
   */
  // Joi.array().allow(null),
  @IsArray({ each: true })
  parts: string[];

  // Joi.boolean().optional().default(false), // Can modify programs
  @IsBoolean()
  @IsOptional()
  activated: boolean = false;

  // Joi.date().default(Date.now()),
  @IsInt()
  createdAt: number = Date.now();

  // Joi.date(),
  @IsInt()
  updatedAt: number;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted: boolean = false;

  // Joi.date(),
  @IsInt()
  deletedAt: number;

  constructor(userProperties?: object) {
    if (userProperties) {
      // User.fromJson(userProperties);

      Object.assign(this, userProperties);
    }
  }

  /**
   * Create instances from JSON or array of JSON objects
   *
   * @param userProperties JSON object with properties
   */
  public static fromJson(userProperties?: object) {
    if (userProperties instanceof Array) {
      return userProperties.map((obj) => new User(obj));
    } else {
      return new User(userProperties);
    }
  }

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
}
