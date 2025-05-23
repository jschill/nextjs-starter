'use server'
import { signUp } from '@/services/server/auth'
export async function signup(data: { email: string, password: string }) {
  try {
    await signUp(data.email, data.password)
  } catch (error) {
    return error
  }
}