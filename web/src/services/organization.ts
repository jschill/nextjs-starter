import { db } from "@/db"
import { organizationMembers } from "@/db/schemas/organization_members"
import { eq } from "drizzle-orm"

// Service for organizations
// A user can have multiple organizations
// An organization can have multiple users

// Check if a user has any organizations
export const hasUserOrganization = async (userId: string) => {
  const member = await db.query.organizationMembers.findFirst({
    where: eq(organizationMembers.userId, userId),
  })
  return !!member
}

// Get all organizations for a user
export const getUserOrganizations = async (userId: string) => {
  return db.query.organizationMembers.findMany({
    where: eq(organizationMembers.userId, userId),
    with: {
      organization: true,
    },
  })
}

// Get a specific organization with membership details
export const getUserOrganization = async (userId: string, organizationId: string) => {
  return db.query.organizationMembers.findFirst({
    where: (members) => 
      eq(members.userId, userId) && eq(members.organizationId, organizationId),
    with: {
      organization: true,
    },
  })
}
