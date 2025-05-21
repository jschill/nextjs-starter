import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  // return NextResponse.json({ received: true });
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }
  console.log('===========Webhook received event', event.type)

  switch (event.type) {
    case 'customer.created':
    case 'customer.updated':
    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
    case 'customer.subscription.paused':
    case 'customer.subscription.pending_update_applied':
    case 'customer.subscription.pending_update_expired':
    case 'customer.subscription.resumed':
    case 'customer.subscription.trial_will_end':
    case 'customer.subscription.updated':
      console.log('OK, Webhook will work', event)
      const subscription = event.data.object as Stripe.Subscription;
      console.log('---- subscription', subscription)
      await handleSubscriptionChange(event.type, subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}