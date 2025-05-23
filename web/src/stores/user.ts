import { type User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { type LoginSchema } from "@/schemas/login"
import { signIn, fetchUser } from '@/services/server/auth'
type UserStore = {
  isLoading: boolean
  user: User | null
  setUser: (user: User) => void
  fetchUser: () => Promise<void>
  login: (loginData: LoginSchema) => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  isLoading: false,
  user: null,
  setUser: (user: User) => set({ user }),
  fetchUser: async () => {
    set({ isLoading: true })
    try {
      const data = await fetchUser()
      set({ user: data.user })
    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  },
  login: async (loginData: LoginSchema) => {
    set({ isLoading: true })
    try {
      const response = await signIn(loginData.email, loginData.password)
      set({ user: response.user })
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  }

}))