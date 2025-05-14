import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { users } from './users'
import { organizations } from './organizations'

export const organizationMembers = pgTable('organization_members', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
})

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
}))

export type OrganizationMember = typeof organizationMembers.$inferSelect
export type NewOrganizationMember = typeof organizationMembers.$inferInsert