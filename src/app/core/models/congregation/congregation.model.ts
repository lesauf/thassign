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
  updatedAt: number;

  // deleted: Joi.boolean().default(false),
  @IsBoolean()
  deleted = false;

  // Joi.date(),
  @IsInt()
  deletedAt: number;
}
