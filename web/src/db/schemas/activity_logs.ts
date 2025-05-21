import { pgTable, serial, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { relations } from "drizzle-orm"
import { authUsers } from '@/db/index'

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id),
  userId: uuid('user_id').references(() => authUsers.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
})

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [activityLogs.organizationId],
    references: [organizations.id],
  }),
  user: one(authUsers, {
    fields: [activityLogs.userId],
    references: [authUsers.id],
  }),
}))

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_ORGANIZATION = 'CREATE_ORGANIZATION',
  REMOVE_ORGANIZATION_MEMBER = 'REMOVE_ORGANIZATION_MEMBER',
  INVITE_ORGANIZATION_MEMBER = 'INVITE_ORGANIZATION_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}