import { pgTable, serial, varchar, timestamp, uuid } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { users } from './users'

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: uuid('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
})