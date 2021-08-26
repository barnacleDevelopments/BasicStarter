/*
AUTHOR: Devin Davis
DATE: August 25th, 2021
FILE: cart_model.js
*/

import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'userId is required.'],
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'CartItem',
  }],
}, { timestamps: true });

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

cartSchema.post('save', handleE11000);
cartSchema.post('update', handleE11000);
cartSchema.post('findOneAndUpdate', handleE11000);
cartSchema.post('insertMany', handleE11000);

export default mongoose.model('Cart', cartSchema);
