// import * as Joi from '@hapi/joi';
// // const Joi = require('@hapi/joi');
// // import 'joi-extract-type'; // Help define Type from Joi Schema
// // Joi.objectId = require('joi-objectid')(Joi);
// // require('joi-objectid')(Joi);
// import * as Mongoose from 'mongoose';
// // import { partSchema } from '../parts/part.schema';

// /**
//  * Minimum data for a standard assignment
//  */
// export const assignmentSchema = Joi.object({
//   week: Joi.string(),
//   part: Joi.string(),
//   assignee: Joi.string().required(),
//   assistant: Joi.string().optional(),
//   position: Joi.number().default(1), // 'Assignment position for same part'), // like many Initial Calls, for example
//   title: Joi.string().optional(), // theme of the assignment
//   hall: Joi.string().optional(), // "main" | "second" | "third"
//   number: Joi.number().optional(), // like public talk number
//   createdAt: Joi.date().default(Date.now()), // 'Creation date'),
//   updatedAt: Joi.date(),
//   deleted: Joi.boolean().default(false),
//   ownerId: Joi.string(),
// }).unknown(true); // Enable other keys

// // export type assignmentSchematype = Joi.extractType<typeof assignmentSchema>;
// // export type AssignmentType = assignmentSchematype & Mongoose.Document & any;
