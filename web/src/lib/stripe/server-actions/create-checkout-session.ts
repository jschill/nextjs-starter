"use server"
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";

interface CheckoutSessionRequest {
  lookup_key: string
  organizationId: string
}

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set');
}

const baseUrl = process.env.BASE_URL;

export async function createCheckoutSession(request: CheckoutSessionRequest) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const prices = await stripe.prices.list({
    lookup_keys: [request.lookup_key],
    expand: ['data.product'],
  });

  if (!prices.data.length) {
    throw new Error('Price not found')
  }

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    customer_email: user.email,
    client_reference_id: request.organizationId,
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${baseUrl}/subscription/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?canceled=true`,
    metadata: {
      organizationId: request.organizationId,
      userId: user.id,
    },
  });
 
  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  return { success: true, url: session.url };
}