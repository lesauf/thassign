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
import * as changeCase from 'change-case';
// import * as mongooseLeanVirtuals from 'mongoose-lean-virtuals';

import { userSchema } from './user.schema';
import { PartModel, PartSchema } from '../parts/part.model';

// Passing Mongoose to Joigoose
// const Joigoose = joigooseModule(Mongoose);

/**
 * Custom setter to convert a string to titlecase
 */
function convertToTitleCase(text: string) {
  return changeCase.capitalCase(text.toLowerCase());
}

// Define mongoose schema from Joi's one
const mongooseUserSchema = new Mongoose.Schema(Joigoose.convert(userSchema), {
  // versionKey: false,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
  // timestamps: true
});

// Defining parts as array of Foreign keys
mongooseUserSchema.add({
  parts: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: PartModel
    }
  ]
});
// / [{ type: Schema.Types.ObjectId, ref: 'Story' }]

// Hooks for createdAt and updatedAt
mongooseUserSchema.pre('save', function(next) {
  if (!this['createdAt']) {
    this['createdAt'] = new Date();
  }
  this['updatedAt'] = new Date();
  next();
  // this.save({}, { $set: { createdAt: new Date(), updatedAt: new Date() } });
});

mongooseUserSchema.pre('findOneAndUpdate', function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

// Soft delete plugin
mongooseUserSchema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true
});

// Paginate plugin
mongooseUserSchema.plugin(mongoosePaginate);

// Define setters for schema
mongooseUserSchema.path('firstName').set(convertToTitleCase);
mongooseUserSchema.path('lastName').set(convertToTitleCase);

// Some virtual properties
mongooseUserSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});
mongooseUserSchema.virtual('type').get(function() {
  let generatedType = '';
  if (this.genre === 'man') {
    if (this.child) {
      generatedType = 'boy';
    } else if (this.overseer === 'elder') {
      generatedType = 'elder';
    } else if (this.overseer === 'ministerial-servant') {
      generatedType = 'ministerial-servant';
    } else {
      generatedType = 'man';
    }
  } else {
    generatedType = this.child ? 'girl' : 'woman';
  }

  return generatedType;
});
mongooseUserSchema.virtual('progress').get(function() {
  let generatedProgress = '';
  if (!this.publisher) {
    generatedProgress = 'not-publisher';
  } else {
    if (!this.baptized) {
      generatedProgress = 'unbaptized-publisher';
    }
  }
  return generatedProgress;
});

// register each method at schema
mongooseUserSchema.method('getFullName', function(): string {
  return this.firstName + ' ' + this.lastName;
});

// Attach virtuals to the results of mongoose queries when using .lean()
// UserSchema.plugin(mongooseLeanVirtuals);

// MODEL
export const UserModel = Mongoose.model<any>('users', mongooseUserSchema);
// export default UserModel;

// Type
// type UserType = userSchematype & Mongoose.Document & any;
// export const UserSchema = mongooseUserSchema;

// module.exports = UserModel;
// module.exports = mongooseUserSchema;
// export { UserModel, UserType }
