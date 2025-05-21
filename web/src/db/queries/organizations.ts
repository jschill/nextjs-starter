import { eq, desc } from "drizzle-orm"
import { db } from "@/db"
import { organizations } from "../schemas";

export async function getOrganizationById(organizationId: string) {
  const result = await db.query.organizations.findFirst({
    where: (orgs) => eq(orgs.id, organizationId),
  });

  return result;
}

export async function getOrganizationByStripeCustomerId(stripeCustomerId: string) {
  const result = await db.query.organizations.findFirst({
    where: (orgs) => eq(orgs.stripeCustomerId, stripeCustomerId),
  });

  return result;
}

export async function getOrganizationByIdWithLatestSubscription(organizationId: string) {
  const result = await db.query.organizations.findFirst({
    where: (orgs) => eq(orgs.id, organizationId),
    with: {
      subscriptions: {
        orderBy: (sub) => desc(sub.createdAt),
        limit: 1
      }
    }
  });

  return result;
}

export async function setStripeCustomerIdForOrganization(organizationId: string, stripeCustomerId: string) {
  await db
    .update(organizations)
    .set({ stripeCustomerId })
    .where(eq(organizations.id, organizationId));
}

export async function getOrganizationByIdWithMembersAndLatestSubscription(organizationId: string) {
  const result = await db.query.organizations.findFirst({
    where: eq(organizations.id, organizationId),
    with: {
      owner: true,
      organizationMembers: {
        with: {
          user: true
        }
      },
      subscriptions: {
        orderBy: (sub) => desc(sub.createdAt),
        limit: 1
      }
    }
  })

  return result;
}
