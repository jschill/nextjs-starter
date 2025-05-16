import { GalleryVerticalEnd } from "lucide-react"
import { CreateOrganizationForm } from '@/components/create-organization-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreateOrganizationPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  
  // Redirect unauthenticated users
  if (!user) {
    redirect('/login')
  }
  
  return (

    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <CreateOrganizationForm />
      </div>
    </div>
    
    // <div className="max-w-md mx-auto my-10 p-6 bg-white rounded shadow">
    //   <h1 className="text-xl font-bold mb-6">Create Your Organization</h1>
    //   <p className="mb-4">You need to create an organization to continue.</p>
    //   <CreateOrganizationForm />
    // </div>
  )
} 