import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { hasUserOrganization } from '@/services/server/organization'

export async function checkUserHasOrganization() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  
  if (!user) {
    redirect('/login')
  }

  const hasOrg = await hasUserOrganization(user.id)
  
  if (!hasOrg) {
    redirect('/create-organization')
  }

  return user
} 