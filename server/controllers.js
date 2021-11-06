import Stripe from 'stripe';
import dotenv from 'dotenv';
import { generateAPIKey } from './customers';
import { Customer, ApiKey } from './db/models/index';

import verifyWebhookAndReturnPaymentStatus from './helpers';

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY_TEST);

export const createCheckoutSession = async (res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1Js2mXKj6dcUeI5mmi6W0zDS',
        },
      ],
      success_url:
        'http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5000/error',
    });
    res.send(session);
  } catch (err) {
    res.send(err);
  }
};

export const handleStripePaymentWebhook = async (req) => {
  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const { data, error } = verifyWebhookAndReturnPaymentStatus(
    req,
    webhookSecret,
  );

  if (data) {
    const { paymentData, eventType } = data;
    switch (eventType) {
      case 'checkout.session.completed': {
        const customerId = paymentData.object.customer;
        const subscriptionId = paymentData.object.subscription;

        console.log(
          `🤑 Customer ${customerId} subscribed to ${subscriptionId} 🤑`,
        );

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId,
        );
        const itemId = subscription.items.data[0].id;

        const { apiKey, hashedAPIKey } = generateAPIKey();

        console.log(`User's API Key: ${apiKey}`);
        console.log(`Hashed API Key: ${hashedAPIKey}`);

        // update database
        await Customer.create({
          id: customerId,
          ApiKey: hashedAPIKey,
          itemId,
          calls: 0,
          active: true,
        });
        await ApiKey.create({
          CustomerId: customerId,
          apiKey: hashedAPIKey,
        });

        break;
      }
      case 'invoice.paid':
        break;
      case 'invoice.payment_failed':
        break;
      default:
      // Unhandled event type
    }
  } else if (error) {
    console.log({ error });
  }
};
