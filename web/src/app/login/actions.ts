'use server'
import { signIn } from '@/services/server/auth'

export async function login(data: { email: string, password: string }) {
  try {
    await signIn(data.email, data.password)
  } catch (error) {
    throw error
  }
}
