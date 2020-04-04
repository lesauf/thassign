import * as Joi from '@hapi/joi';
// const Joi = require('@hapi/joi');
import 'joi-extract-type'; // Help define Type from Joi Schema
// Joi.objectId = require('joi-objectid')(Joi);
// require('joi-objectid')(Joi);

/**
 * Minimum data for a standard part
 */
export const partSchema = Joi.object({
  _id: Joi.string().alphanum(),
  name: Joi.string().required(),
  meeting: Joi.string()
    .required()
    .allow('midweek', 'midweek-students', 'weekend'),
  withTitle: Joi.boolean().optional(), // Does it need a title
  withAssistant: Joi.boolean().optional(), // Does it need an assistant
  after: Joi.string().optional(),
  byAnOverseer: Joi.boolean().optional(), // Is it an overseer assignment?
  byABrother: Joi.boolean().optional(), // Is it a brother assignment ?
}).unknown(true); // Enable other keys

export type Part = Joi.extractType<typeof partSchema>;
// export type Part = partSchematype & Mongoose.Document;
