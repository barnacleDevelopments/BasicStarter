/*
AUTHOR: Devin Davis
DATE: August 24th, 2021
FILE: order_model.js
*/

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: [true, 'Name is required.'],
  },
  unit: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  province: {
    type: String,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  zipCode: {
    type: String,
  },
}, { timestamps: true });

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

orderSchema.post('save', handleE11000);
orderSchema.post('update', handleE11000);
orderSchema.post('findOneAndUpdate', handleE11000);
orderSchema.post('insertMany', handleE11000);

export default mongoose.model('Order', orderSchema);
