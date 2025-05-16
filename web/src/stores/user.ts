import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

type UserStore = {
  isLoading: boolean
  user: User | null
  setUser: (user: User) => void
  fetchUser: () => Promise<void>
}
const supabase = createClient()

export const useUserStore = create<UserStore>((set) => ({
  isLoading: false,
  user: null,
  setUser: (user: User) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
      } else {
        set({ user: data.user })
      }
    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  }
}))