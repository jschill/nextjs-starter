"use client"

import { signIn } from '@/services/client/auth'
export async function login(data: { email: string, password: string }) {
  try {
    await signIn(data.email, data.password)
  } catch (error) {
    throw error
  }
}
