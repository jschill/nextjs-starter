"use server"

import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { organizations, organizationMembers, NewOrganization } from '@/db/schemas'
import { revalidatePath } from 'next/cache'
import { CreateOrganizationSchema } from '@/schemas/create-organization'

export async function createOrganization(formData: CreateOrganizationSchema) {
  try {
    const { name, vatnr, country } = formData
    // const cookieStore = cookies()
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data.user
    
    if (!user) {
      throw new Error('Unauthorized')
    }
    
    if (!name) {
      throw new Error('Name is required')
    }

    if (!vatnr) {
      throw new Error('VAT number is required')
    }

    if (!country) {
      throw new Error('Country is required')
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
    
    // Revalidate the organizations page to show the new organization
    revalidatePath('/organizations')
    
    return { id: createdOrganizationId, success: true }
  } catch (error) {
    console.error('Error creating organization:', error)
    throw error
  }
}