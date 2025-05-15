import { User } from "@supabase/supabase-js"
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from "react"

export function useAuth() {

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setisLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // Initial fetch of user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setisLoading(false)
    }
    
    fetchUser()
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { user, isLoading }

}