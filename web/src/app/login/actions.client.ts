"use client"

import { signIn } from '@/services/auth.client'
export async function login(data: { email: string, password: string }) {
  try {
    await signIn(data.email, data.password)
  } catch (error) {
    return { error}
  }
}
