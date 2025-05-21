import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

interface CheckoutSessionRequest {
  lookup_key: string
  organizationId: string
}

if (!process.env.BASE_URL) {
  throw new Error('BASE_URL is not set');
}

const baseUrl = process.env.BASE_URL;

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  console.log('USER', user);
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const body = await request.json() as CheckoutSessionRequest;
  
  const prices = await stripe.prices.list({
    lookup_keys: [body.lookup_key],
    expand: ['data.product'],
  });

  console.log('PRICES', prices);
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    // customer: body.stripeCustomerId ?? undefined,
    customer_email: user.email,
    client_reference_id: body.organizationId,
    line_items: [
      {
        price: prices.data[0].id,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${baseUrl}/api/stripe/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?canceled=true`,
  });
  // console.log('SESSION', session);
 
  if (!session.url) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: session.url });
  // return NextResponse.redirect(session.url);
}