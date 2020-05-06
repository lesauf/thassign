import {
  IsBoolean,
  IsString,
  IsIn,
  IsOptional,
  IsUUID,
  IsObject,
} from 'class-validator';

/**
 * Minimum data for a standard part
 */
export class Part {
  facultative: string;

  @IsObject()
  @IsOptional()
  _id: { id: object; toHexString() };

  // @(jf.string().required())
  @IsString()
  name: string;

  // @(jf.string().required().allow('midweek', 'midweek-students', 'weekend'))
  @IsString()
  @IsIn(['midweek', 'midweek-students', 'weekend'])
  meeting: string;

  /**
   * Does it need a title
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  withTitle: boolean;

  /**
   * Does it need an assistant
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  withAssistant: boolean;

  @IsString()
  @IsOptional()
  // @(jf.string().optional())
  after: string;

  /**
   * Is it an overseer assignment?
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  byAnOverseer: boolean;

  /**
   * Is it a brother assignment ?
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  byABrother: boolean;
}
