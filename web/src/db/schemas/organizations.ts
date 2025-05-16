import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { organizationMembers } from './organization_members'
import { users } from './users'
import { activityLogs } from './activity_logs'
import { invitations } from './invitations'

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  vatnr: varchar('vatnr', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  description: text('description'),
  logoUrl: varchar('logo_url', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
  ownerId: uuid('owner_id').references(() => users.id),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
})

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  organizationMembers: many(organizationMembers),
  activityLogs: many(activityLogs),
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
    relationName: 'ownedOrganizations'
  }),
  invitations: many(invitations),
}))


export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert 