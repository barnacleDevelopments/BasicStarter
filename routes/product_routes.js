import express from 'express';

// DB MODELS
import Product from '../models/product_model.js';

const router = express.Router();

router.get('/products', async (req, res, next) => {
  // get all the product
  const products = await Product.find({});

  res.render('product/products', { products });
});

router.get('/products/:id', async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });

  res.render('product/product', { product });
});

router.post('/products', (req, res, next) => {

});

router.put('/products/id', (req, res, next) => {

});

router.delete('/products/id', (req, res, next) => {

});

export default router;
