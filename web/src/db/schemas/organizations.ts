import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { organizationMembers } from './organization_members'
import { activityLogs } from './activity_logs'
import { invitations } from './invitations'
import { authUsers } from '@/db/index'
import { subscriptions } from './subscriptions'
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  vatnr: varchar('vatnr', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  description: text('description'),
  logoUrl: varchar('logo_url', { length: 255 }),
  ownerId: uuid('owner_id').references(() => authUsers.id),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  organizationMembers: many(organizationMembers),
  activityLogs: many(activityLogs),
  subscriptions: many(subscriptions),
  owner: one(authUsers, {
    fields: [organizations.ownerId],
    references: [authUsers.id],
    relationName: 'ownedOrganizations'
  }),
  invitations: many(invitations),
}))

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert 