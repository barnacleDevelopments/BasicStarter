/*
AUTHOR: Devin Davis
DATE: July 27th, 2021
FILE: user_model.js
*/

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required.'],
  },
  reset_password_token: String,
  reset_password_expires: String,
}, { timestamps: true });

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

userSchema.post('save', handleE11000);
userSchema.post('update', handleE11000);
userSchema.post('findOneAndUpdate', handleE11000);
userSchema.post('insertMany', handleE11000);

export default mongoose.model('User', userSchema);
