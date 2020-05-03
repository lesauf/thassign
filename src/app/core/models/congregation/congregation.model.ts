import {
  IsBoolean,
  IsString,
  IsInt,
  IsOptional,
  IsUUID,
} from 'class-validator';

/**
 * Minimum data for a standard congregation
 */
export class Congregation {
  // _id: Joi.string().alphanum(),
  @IsUUID()
  @IsOptional()
  // tslint:disable-next-line: variable-name
  _id: string;

  // @(jf.string().required())
  @IsString()
  name: string;

  // @(jf.string().required())
  @IsString()
  country: string;

  /**
   * User id of the creator
   */
  // @(jf.string().required())
  @IsString()
  ownerId: string;

  // Joi.date().default(Date.now()),
  @IsInt()
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

  constructor(props?: object) {
    if (props) {
      Object.assign(this, props);
    }
  }

  /**
   * Create instances from JSON or array of JSON objects
   *
   * @param properties JSON object with properties
   */
  public static fromJson(props?: object) {
    if (props instanceof Array) {
      return props.map((obj) => new Congregation(obj));
    } else {
      return new Congregation(props);
    }
  }
}
