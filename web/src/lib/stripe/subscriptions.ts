import { Stripe } from "./index";
import { getOrganizationByStripeCustomerId } from "@/db/queries/organizations";
import { insertSubscription } from "@/db/queries/subscriptions";
import { NewSubscription } from "@/db/schemas";
export async function handleSubscriptionChange(
  eventType: string,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const organization = await getOrganizationByStripeCustomerId(customerId);

  if (!organization) {
    console.error('Organization not found for Stripe customer:', customerId);
    return;
  }

  const plan = subscription.items.data[0]?.plan;
  const newSubscription: NewSubscription = {
    organizationId: organization.id,
    stripeEvent: eventType,
    stripeSubscriptionId: subscriptionId,
    stripeProductId: plan?.product as string,
    planName: (plan?.product as Stripe.Product).name,
    subscriptionStatus: status
  }

  await insertSubscription(newSubscription);
}
