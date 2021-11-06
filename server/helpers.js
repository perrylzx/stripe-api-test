import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY_TEST,
);

const verifyWebhookAndReturnPaymentStatus = (req, webhookSecret) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  const signature = req.headers['stripe-signature'];

  if (webhookSecret) {
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        webhookSecret,
      );

      // Extract the object from the event.
      const paymentData = event.data;
      const eventType = event.type;
      return { data: { paymentData, eventType }, error: null };
    } catch (err) {
      console.log('⚠️Webhook signature verification failed.');
      return { data: null, error: err };
    }
  } else {
    return {
      data: { paymentData: req.body.data, eventType: req.body.type },
      error: null,
    };
  }
};

export default verifyWebhookAndReturnPaymentStatus;
