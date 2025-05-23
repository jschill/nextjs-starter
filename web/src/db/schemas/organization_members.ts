import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { authUsers } from '@/db/index'
import { organizations } from './organizations'

export const organizationMembers = pgTable('organization_members', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => authUsers.id),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
})

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  user: one(authUsers, {
    fields: [organizationMembers.userId],
    references: [authUsers.id],
  }),
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
}))

export type OrganizationMember = typeof organizationMembers.$inferSelect
export type NewOrganizationMember = typeof organizationMembers.$inferInsert