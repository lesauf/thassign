import {
  IsBoolean,
  IsString,
  IsIn,
  IsOptional,
  IsUUID,
  IsObject,
  IsNumber,
  IsInt,
} from 'class-validator';

/**
 * @see https://mongodb.github.io/node-mongodb-native/2.2/api/ObjectID.html
 */
export type ObjectId = {
  id: string | number;
  /**
   * Creates an ObjectID from a hex string representation of an ObjectID
   */
  createFromHexString(hexString: string): ObjectId;
  /**
   * Creates an ObjectID from a second based number,
   * with the rest of the ObjectID zeroed out.
   * Used for comparisons or sorting the ObjectID.
   */
  createFromTime(time: number): ObjectId;
  /**
   * Checks if a value is a valid bson ObjectId
   * @return true if the value is a valid bson ObjectId, return false otherwise.
   */
  isValid(): boolean;
  /**
   * Compares the equality of this ObjectID with otherID
   */
  equals(otherID: object): boolean;
  /**
   * Generate a 12 byte id buffer used in ObjectID's
   */
  generate(time?: number): Buffer;
  /**
   * Returns the generation date (accurate up to the second)
   * that this ID was generated.
   */
  getTimestamp(): Date;
  /**
   * Return the ObjectID id as a 24 byte hex string representation
   */
  toHexString(): string;
};

/**
 * Minimum data for a standard part
 */
export class Part {
  @IsString()
  @IsOptional()
  _id: string;

  // @(jf.string().required())
  @IsString()
  name: string;

  // @(jf.string().required().allow('midweek', 'midweek-students', 'weekend'))
  @IsString()
  @IsIn(['midweek', 'midweek-students', 'weekend'])
  meeting: string;

  /**
   * Zero-based position of the assignment in its week
   */
  @IsInt()
  position = 0;

  /**
   * Does it need a title
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  withTitle?: boolean;

  /**
   * Does it need an assistant
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  withAssistant?: boolean;

  @IsString()
  @IsOptional()
  // @(jf.string().optional())
  after?: string;

  /**
   * Is it an overseer assignment?
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  byAnOverseer?: boolean;

  /**
   * Is it a brother assignment ?
   */
  // @(jf.boolean().optional())
  @IsBoolean()
  @IsOptional()
  byABrother?: boolean;

  constructor(properties?: object) {
    // Assign the properties to this object
    Object.assign(this, properties);
  }
}
