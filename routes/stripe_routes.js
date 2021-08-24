import stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const router = express.Router();

const { DOMAIN } = process.env;

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({

    line_items: [
      {
        price: 'price_1JRygpECH3c1LoiQdPDfXg8i',
        quantity: 1,
      },
    ],

    payment_method_types: [
      'card',
      'acss_debit',
    ],

    mode: 'payment',
    success_url: `${DOMAIN}/success.html`,
    cancel_url: `${DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

export default router;
