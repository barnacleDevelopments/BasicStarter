/*
AUTHOR: Devin Davis
DATE: July 24th, 2021
FILE: comment_routes.js
*/

// DEPENDENCIES
import express from 'express';

// MODELS
import Cart from '../models/cart_model.js';
import CartItem from '../models/cart_item_model.js';

// MIDDLEWARE 
import isLoggedIn from '../middleware/is_logged_in.js';

// CATEGORY ROUTES
const router = express.Router();

router.get('/cart', isLoggedIn, async (req, res, next) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({ userId })
    .populate({
      path: 'items',
      populate: {
        path: 'product',
      },
    });

  if (!cart) {
    cart = await Cart.create({
      userId,
    });
  }

  res.render('cart', { cart });
});

router.post('/cart', isLoggedIn, async (req, res, next) => {
  const userId = req.user.id;
  const { quantity, productId } = req.body;

  // get the cart
  const oldCart = await Cart.findOne({ userId })
    .populate({
      path: 'items',
      populate: {
        path: 'product',
      },
    });

  // if old cart does not exist create cart and add the item to the cart
  if (!oldCart) {
    // create cart item
    const newCartItem = await CartItem.create({
      product: productId,
      quantity,
    });

    await Cart.create({
      userId,
      items: [newCartItem.id],
    });
  } else {
    // check if product is already in cart
    const existingCartItem = oldCart.items.find((ci) => (
      ci.product.id === productId
    ));

    if (existingCartItem) {
      existingCartItem.quantity += Number.parseInt(quantity);

      const cartItem = await CartItem.findOneAndUpdate(
        { _id: existingCartItem.id },
        { quantity: existingCartItem.quantity },
      );
    } else {
      const newCartItem = await CartItem.create({
        product: productId,
        quantity,
      });

      // update the cart with new item
      await Cart.findOneAndUpdate(
        { userId },
        { items: [...oldCart.items, newCartItem.id] },
        { new: true },
      );
    }
  }

  res.redirect('/cart');
});

export default router;
