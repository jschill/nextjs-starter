"use client"

import { createClient } from "@/utils/supabase/client"

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  const { data, error } = response

  if (error) {
    throw error
  }

  return data
}