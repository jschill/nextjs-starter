"use server"
// services/auth.ts
import { createClient } from '@/utils/supabase/server'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
export async function signUp(email: string, password: string) {
  const supabase = await createClient()
  // Create user in Supabase Auth
  // If user already exists, it will return a dummy user to prevent user enumeration attacks
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const supabase = await createClient()
  return await supabase.auth.signOut()
}


export async function fetchUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }
  
  // Get user from your database with Drizzle
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
  
  return user
}