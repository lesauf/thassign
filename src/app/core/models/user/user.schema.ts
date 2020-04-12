import * as Joi from '@hapi/joi';

/**
 * Minimum data for a standard user
 */
export const userSchema = Joi.object({
  _id: Joi.string().alphanum(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  genre: Joi.string().optional().allow('man', 'woman'),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow(null, ''),
  baptized: Joi.boolean().optional().default(true),
  publisher: Joi.boolean().optional().default(true),
  child: Joi.boolean().optional().default(false),
  phone: Joi.string().optional().allow(null, ''),
  overseer: Joi.string().optional().allow(null),
  disabled: Joi.boolean().optional().default(false), // Cannot receive assignments
  hashedPassword: Joi.string().optional(),
  congregation: Joi.string(), // Congregation Id
  parts: Joi.array().allow(null),
  activated: Joi.boolean().optional().default(false), // Can modify program
  createdAt: Joi.date().default(Date.now()),
  updatedAt: Joi.date(),
  deleted: Joi.boolean().default(false),
  deletedAt: Joi.date(),
  ownerId: Joi.string().required(),
}).unknown(true); // Enable other keys

export type User = Joi.extractType<typeof userSchema>;
