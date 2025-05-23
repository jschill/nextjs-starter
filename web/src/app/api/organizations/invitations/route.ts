import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createInvitation } from '@/services/server/organization'
import { invitationSchema } from '@/schemas/invitation'
import { z } from 'zod'

export async function POST(request: NextRequest) {
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
    
    const body = await request.json()
    const { email, role, organizationId } = invitationSchema.parse(body)

    // Create the invitation
    try {
      const invitationId = await createInvitation({
        email,
        organizationId,
        role,
        invitedById: user.id
      })
      
      // TODO: Send email notification to the invited user
      
      return NextResponse.json({ 
        success: true,
        invitationId
      })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
      throw error
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating invitation:', error)
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    )
  }
} 