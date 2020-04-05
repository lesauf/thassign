/**
 * Model definitions
 * @see https://stackoverflow.com/a/32780233/3234046
 */
import * as Mongoose from 'mongoose';
// import * as mongoose_delete from 'mongoose-delete';
const mongoose_delete = require('mongoose-delete');
// import * as mongoosePaginate from 'mongoose-paginate-v2';
const mongoosePaginate = require('mongoose-paginate-v2');
// import * as joigooseModule from 'joigoose';
const Joigoose = require('joigoose')(Mongoose);

import { assignmentSchema } from './assignment.schema';
import { PartModel, PartSchema } from '../parts/part.model';
import { UserModel } from '../users/user.model';

// Passing Mongoose to Joigoose
// const Joigoose = joigooseModule(Mongoose);

// Define mongoose schema from Joi's one
const mongooseAssignmentSchema = new Mongoose.Schema(
  Joigoose.convert(assignmentSchema),
  {
    // versionKey: false,
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
);

// Defining part, assignee and assistant as array of Foreign keys
mongooseAssignmentSchema.add({
  part: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: PartModel
  },
  assignee: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: UserModel
  },
  assistant: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: UserModel
  }
});

// Soft delete plugin
mongooseAssignmentSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true
});

// MODEL
export const Assignment = Mongoose.model<any>(
  'assignments',
  mongooseAssignmentSchema
);
