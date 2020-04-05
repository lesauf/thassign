import * as Joi from '@hapi/joi';
import 'joi-extract-type'; // Help define Type from Joi Schema

/**
 * Minimum data for a standard congregation
 */
export const congregationSchema = Joi.object({
  // _id: Joi.string().alphanum(),
  name: Joi.string().required(),
  country: Joi.string(),
  createdAt: Joi.date(), // .default(Date.now(), 'Creation date'),
  updatedAt: Joi.date(),
  deleted: Joi.boolean().default(false),
  deletedAt: Joi.date(),
  ownerId: Joi.string(),
}).unknown(true); // Enable other keys

export type Congregation = Joi.extractType<typeof congregationSchema>;
