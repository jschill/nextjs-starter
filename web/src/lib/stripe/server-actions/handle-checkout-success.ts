'use server'
import { stripe, Stripe } from "@/lib/stripe"
import { NewSubscription } from "@/db/schemas"
import { redirect } from "next/navigation"
import { getOrganizationById, setStripeCustomerIdForOrganization } from "@/db/queries"
import { insertSubscription } from "@/db/queries/subscriptions"

export async function handleCheckoutSuccess(sessionId: string, userId: string) {
  let redirectUrl = ''
  try {
    // Verify the session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    })
    
    const sessionOrganizationId = session.metadata?.organizationId
    const sessionUserId = session.metadata?.userId

    if (!sessionOrganizationId) {
      throw new Error('No organization ID found in session')
    }

    if (!userId) {
      throw new Error('No user ID found in session')
    }

    if (sessionUserId !== userId) {
      throw new Error('Not the same user initiated the checkout')
    }

    const organization = await getOrganizationById(sessionOrganizationId);

    if (!organization) {
      throw new Error('Organization not found')
    }
    
    if (userId !== organization.ownerId) {
      throw new Error('Current user is not the owner of the organization.');
    }

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

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

    await setStripeCustomerIdForOrganization(organization.id, session.customer.id);

    const newSubscription: NewSubscription = {
      organizationId: organization.id,
      stripeSubscriptionId: subscriptionId,
      stripeProductId: productId,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: subscription.status
    }
  
    await insertSubscription(newSubscription);

    redirectUrl = `/organizations/${organization.id}?checkout=success`
    
  } catch (error) {
    console.error('Error handling checkout success:', error)
    redirectUrl = '/error?reason=checkout'
  } finally {
    redirect(redirectUrl)
  }
}