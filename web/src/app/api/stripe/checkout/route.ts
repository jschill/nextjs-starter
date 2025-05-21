import { eq } from 'drizzle-orm'
// import { db } from '@/db/drizzle';
// import { users, teams, teamMembers } from '@/lib/db/schema';
// import { setSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server'
// import { stripe } from '@/lib/payments/stripe'
import { stripe, Stripe } from "@/lib/stripe"
import { db } from '@/db'
import { NewSubscription } from '@/db/schemas'
import { createClient } from '@/utils/supabase/server'
import { getOrganizationById, setStripeCustomerIdForOrganization } from '@/db/queries'
import { insertSubscription } from '@/db/queries/subscriptions'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    const organizationIdFromSession = session.client_reference_id;
    if (!organizationIdFromSession) {
      throw new Error("No organization ID found in session's client_reference_id.");
    }

    const organization = await getOrganizationById(organizationIdFromSession);

    if (!organization) {
      throw new Error('Organization not found.');
    }

    if (user.id !== organization.ownerId) {
      throw new Error('Current user is not the owner of the organization.');
    }

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    // const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error('No plan found for this subscription.');
    }

    const productId = (plan?.product as Stripe.Product).id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    console.log('productId', productId)
    // console.log('SESSION', session);
    // return NextResponse.json({ success: true });
    await setStripeCustomerIdForOrganization(organization.id, session.customer.id);

    const newSubscription: NewSubscription = {
      organizationId: organization.id,
      stripeSubscriptionId: subscriptionId,
      stripeProductId: productId,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: subscription.status
    }
  
    console.log('---- newSubscription', newSubscription)
  
    await insertSubscription(newSubscription);

    // await db
    //   .update(teams)
    //   .set({
    //     stripeCustomerId: customerId,
    //     stripeSubscriptionId: subscriptionId,
    //     stripeProductId: productId,
    //     planName: (plan.product as Stripe.Product).name,
    //     subscriptionStatus: subscription.status,
    //     updatedAt: new Date(),
    //   })
    //   .where(eq(teams.id, userTeam[0].teamId));

    // await setSession(user[0]);    
    
    // return db.query.organizationMembers.findMany({
    //   where: eq(organizationMembers.userId, userId),
    //   with: {
    //     organization: true,
    //   },
    // })    

    // const user = await db
    //   .select()
    //   .from(users)
    //   .where(eq(users.id, Number(userId)))
    //   .limit(1);

    // if (user.length === 0) {
    //   throw new Error('User not found in database.');
    // }

    // const userTeam = await db
    //   .select({
    //     teamId: teamMembers.teamId,
    //   })
    //   .from(teamMembers)
    //   .where(eq(teamMembers.userId, user[0].id))
    //   .limit(1);

    // if (userTeam.length === 0) {
    //   throw new Error('User is not associated with any team.');
    // }

    // await db
    //   .update(teams)
    //   .set({
    //     stripeCustomerId: customerId,
    //     stripeSubscriptionId: subscriptionId,
    //     stripeProductId: productId,
    //     planName: (plan.product as Stripe.Product).name,
    //     subscriptionStatus: subscription.status,
    //     updatedAt: new Date(),
    //   })
    //   .where(eq(teams.id, userTeam[0].teamId));

    // await setSession(user[0]);
    return NextResponse.redirect(new URL(`/organizations/${organization.id}`, request.url));
  } catch (error) {
    console.error('Error handling successful checkout:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
