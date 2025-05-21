import { Stripe } from "./index";
import { getOrganizationByStripeCustomerId } from "@/db/queries/organizations";
import { insertSubscription } from "@/db/queries/subscriptions";
import { NewSubscription } from "@/db/schemas";
export async function handleSubscriptionChange(
  eventType: string,
  subscription: Stripe.Subscription
) {
  console.log('1')
  const customerId = subscription.customer as string;
  console.log('2')
  const subscriptionId = subscription.id;
  console.log('3')
  const status = subscription.status;
  console.log('4')

  const organization = await getOrganizationByStripeCustomerId(customerId);
  console.log('---- organization', organization)
  if (!organization) {
    console.error('Organization not found for Stripe customer:', customerId);
    return;
  }
  console.log('5')

  const plan = subscription.items.data[0]?.plan;
  
  const newSubscription: NewSubscription = {
    organizationId: organization.id,
    stripeEvent: eventType,
    stripeSubscriptionId: subscriptionId,
    stripeProductId: plan?.product as string,
    planName: (plan?.product as Stripe.Product).name,
    subscriptionStatus: status
  }
  console.log('6')

  console.log('---- newSubscription', newSubscription)

  await insertSubscription(newSubscription);
  console.log('7')

  // if (status === 'active' || status === 'trialing') {
  //   const plan = subscription.items.data[0]?.plan;
  //   await updateTeamSubscription(team.id, {
  //     stripeSubscriptionId: subscriptionId,
  //     stripeProductId: plan?.product as string,
  //     planName: (plan?.product as Stripe.Product).name,
  //     subscriptionStatus: status
  //   });
  // } else if (status === 'canceled' || status === 'unpaid') {
  //   await updateTeamSubscription(team.id, {
  //     stripeSubscriptionId: null,
  //     stripeProductId: null,
  //     planName: null,
  //     subscriptionStatus: status
  //   });
  // }
}
