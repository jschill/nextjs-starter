import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
// We'll use the cancelInvitation and createInvitation functions together to implement resend
import { createInvitation, cancelInvitation } from '@/services/server/organization'
import { db } from '@/db'
import { invitations } from '@/db/schemas/invitations'
import { eq } from 'drizzle-orm'

// Mark as Node.js runtime to allow database access
export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const invitationId = params.id
    
    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      )
    }

    const parsedInvitationId = parseInt(invitationId)
    if (isNaN(parsedInvitationId)) {
      return NextResponse.json(
        { error: 'Invalid Invitation ID' },
        { status: 400 }
      )
    }
    
    // Get the invitation details
    const invitation = await db.query.invitations.findFirst({
      where: eq(invitations.id, parsedInvitationId)
    })
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      )
    }
    
    // Cancel the old invitation
    await cancelInvitation(invitationId)
    
    // Create a new invitation with the same details
    const newInvitationId = await createInvitation({
      email: invitation.email,
      organizationId: invitation.organizationId,
      role: invitation.role,
      invitedById: user.id
    })
    
    // TODO: Send email notification to the invited user
    
    return NextResponse.json({ 
      success: true,
      newInvitationId
    })
  } catch (error) {
    console.error('Error resending invitation:', error)
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    )
  }
} 