import { pgTable, serial, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { authUsers } from '@/db/index'
import { relations } from 'drizzle-orm'

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedById: uuid('invited_by')
    .notNull()
    .references(() => authUsers.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
})

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(authUsers, {
    fields: [invitations.invitedById],
    references: [authUsers.id],
  }),
}))