/*
AUTHOR: Devin Davis
DATE: August 24th, 2021
FILE: project_model.js
*/

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
}, { timestamps: true });

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

productSchema.post('save', handleE11000);
productSchema.post('update', handleE11000);
productSchema.post('findOneAndUpdate', handleE11000);
productSchema.post('insertMany', handleE11000);

export default mongoose.model('Product', productSchema);
