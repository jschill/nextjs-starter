import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { organizations, organizationMembers, NewOrganization } from '@/db/schemas'

// Mark as Node.js runtime to allow database access
export const runtime = 'nodejs'

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
    
    const { name, vatnr, country } = await request.json()
    
    if (!name || !vatnr || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create organization
    const createdOrganization = await db.insert(organizations).values({
      name,
      vatnr,
      country,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as NewOrganization).returning({ id: organizations.id })

    const createdOrganizationId = createdOrganization[0].id

    // Add the user as an owner
    await db.insert(organizationMembers).values({
      userId: user.id,
      organizationId: createdOrganizationId,
      role: 'owner',
      joinedAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })
    
    return NextResponse.json({ id: createdOrganizationId, success: true })
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    )
  }
} 