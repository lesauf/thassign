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
} from 'class-validator';

export class User {
  @IsUUID()
  @IsOptional()
  // Joi.string().alphanum()
  _id: string;

  // @(jf.string().required())
  @IsString()
  firstName: string;

  // @(jf.string().required())
  @IsString()
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
  @IsString()
  @IsIn(['man', 'woman'])
  genre: string;

  // Joi.string()
  //   .email({ tlds: { allow: false } })
  //   .allow(null, ''),
  @IsEmail()
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
}
