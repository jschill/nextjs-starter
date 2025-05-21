import { db } from "@/db"
import { organizationMembers } from "@/db/schemas/organization_members"
import { organizations } from "@/db/schemas/organizations"
import { invitations } from "@/db/schemas/invitations"
import { eq, and, desc } from "drizzle-orm"
import { getOrganizationByIdWithMembersAndLatestSubscription } from "@/db/queries/organizations"

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
      organization: {
        with: {
          subscriptions: {
            orderBy: (sub) => desc(sub.createdAt),
            limit: 1
          }
        }
      }
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

// Get organization with all its members
export const getOrganizationWithMembers = async (organizationId: string) => {
  const org = await getOrganizationByIdWithMembersAndLatestSubscription(organizationId)
  if (!org) return null;
  return org
}

// Get all invitations for an organization
export const getOrganizationInvitations = async (organizationId: string) => {
  return db.query.invitations.findMany({
    where: eq(invitations.organizationId, organizationId),
    orderBy: (invitations, { desc }) => [desc(invitations.invitedAt)]
  });
}

// Send an invitation to join an organization
export const createInvitation = async (data: {
  email: string,
  organizationId: string,
  role: string,
  invitedById: string
}) => {
  const { email, organizationId, role, invitedById } = data;
  
  // Check if invitation already exists
  const existingInvitation = await db.query.invitations.findFirst({
    where: and(
      eq(invitations.email, email),
      eq(invitations.organizationId, organizationId),
      eq(invitations.status, 'pending')
    ),
  });
  
  if (existingInvitation) {
    throw new Error('An active invitation already exists for this email');
  }
  
  // // Set expiration to 7 days from now
  // const expiresAt = new Date();
  // expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Insert invitation - don't provide ID, let the database generate it
  const result = await db.insert(invitations).values({
    email,
    organizationId,
    role,
    invitedById,
    invitedAt: new Date(),
    status: 'pending',
  }).returning({ id: invitations.id });
  
  // Return the ID of the created invitation
  return result[0]?.id;
}

// Cancel/delete an invitation
export const cancelInvitation = async (invitationId: string) => {
  // First get the invitation to ensure it's a number
  const invitation = await db.query.invitations.findFirst({
    where: eq(invitations.id, Number(invitationId))
  });
  
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  await db.update(invitations)
    .set({ status: 'cancelled' })
    .where(eq(invitations.id, invitation.id));
}

// Update a member's role in an organization
export const updateMemberRole = async (memberId: number | string, role: string) => {
  await db.update(organizationMembers)
    .set({ role })
    .where(eq(organizationMembers.id, Number(memberId)));
}

// Remove a member from an organization
export const removeMember = async (memberId: number | string) => {
  await db.delete(organizationMembers)
    .where(eq(organizationMembers.id, Number(memberId)));
}
