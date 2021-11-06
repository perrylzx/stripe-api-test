/* eslint-disable no-console */
import express from 'express';

import {
  createCheckoutSession,
  handleStripePaymentWebhook,
} from '../controllers';

const app = express.Router();

app.post('/checkout', async (_, res) => {
  createCheckoutSession(res);
});

// Stripe requires raw request body to verify webhook signature
app.use(
  express.json({
    verify: (req, _, buffer) => {
      req.rawBody = buffer;
    },
  }),
);

app.post('/webhook', async (req) => {
  handleStripePaymentWebhook(req);
});

export default app;
