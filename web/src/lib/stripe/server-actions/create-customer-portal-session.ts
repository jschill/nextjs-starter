"use server"
import { redirect } from "next/navigation";
import { stripe, Stripe } from "..";
import { OrganizationWithSubscription } from "@/db/schemas/organizations";
import { getOrganizationByIdWithLatestSubscription } from "@/db/queries/organizations";

export async function createCustomerPortalSession(organization: OrganizationWithSubscription) {
  const currentSubscription = organization.subscriptions[0]; // Can this be undefined or an empty array?

  if (!organization.stripeCustomerId || !currentSubscription.stripeProductId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(currentSubscription.stripeProductId);
    if (!product.active) {
      throw new Error("Organization's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the organization's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end', // 'at_period_end' | 'immediately
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other'
            ]
          }
        },
        payment_method_update: {
          enabled: true
        }
      }
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: organization.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id
  });
}

export const customerPortalAction = async (organizationId: string) => {
  const organization = await getOrganizationByIdWithLatestSubscription(organizationId);
  if (!organization) {
    throw new Error("Organization not found");
  }
  console.log('organization', organization)
  const portalSession = await createCustomerPortalSession(organization);
  redirect(portalSession.url);
};