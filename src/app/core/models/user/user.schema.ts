import * as Joi from '@hapi/joi';

/**
 * Minimum data for a standard user
 */
export const userSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  genre: Joi.string().required().allow('man', 'woman'),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow(null, ''),
  baptized: Joi.boolean().optional().default(false),
  publisher: Joi.boolean().optional().default(false),
  child: Joi.boolean().optional().default(false),
  phone: Joi.string().optional().allow(null, ''),
  overseer: Joi.string().optional().allow(null),
  disabled: Joi.boolean().optional().default(false), // Cannot receive assignments
  hashedPassword: Joi.string().optional(),
  congregation: Joi.string(), // Congregation Id
  parts: Joi.array().allow(null),
  activated: Joi.boolean().optional().default(false), // Can modify program
  createdAt: Joi.date(), // .default(Date.now(), 'Creation date'),
  updatedAt: Joi.date(),
  deleted: Joi.boolean().default(false),
  deletedAt: Joi.date(),
  ownerId: Joi.string(),
}).unknown(true); // Enable other keys

// export type userSchematype = Joi.extractType<typeof userSchema>;
// export type UserType = userSchematype & Mongoose.Document & any;
