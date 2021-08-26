/*
AUTHOR: Devin Davis
DATE: August 25th, 2021
FILE: cart_model.js
*/

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Product',
  },
  quantity: {
    type: Number,
    required: [true, 'quantity is required.'],
  },
}, { timestamps: true });

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

cartItemSchema.post('save', handleE11000);
cartItemSchema.post('update', handleE11000);
cartItemSchema.post('findOneAndUpdate', handleE11000);
cartItemSchema.post('insertMany', handleE11000);

export default mongoose.model('CartItem', cartItemSchema);
