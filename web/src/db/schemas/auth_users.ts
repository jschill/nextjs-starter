import { authUsers } from '@/db/index'
import { relations } from 'drizzle-orm'
import { organizationMembers } from './organization_members'
import { activityLogs } from './activity_logs'
import { invitations } from './invitations'
import { organizations } from './organizations'

const authUsersRelations = relations(authUsers, ({ many }) => ({
  activityLogs: many(activityLogs),
  organizationsMembers: many(organizationMembers),
  invitations: many(invitations),
  ownedOrganizations: many(organizations),
}))


export {
  authUsers,
  authUsersRelations
}
