'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(data: { email: string, password: string }) {
  const supabase = await createClient()
  // TODO: Validate data here

  const { error } = await supabase.auth.signInWithPassword(data)

  return { error }

  // if (error) {
  //   redirect('/error')
  // }

  // revalidatePath('/', 'layout')
  // redirect('/')
}

export async function signup(data: { email: string, password: string }) {
  const supabase = await createClient()
  // TODO: Validate data here

  const { error } = await supabase.auth.signUp(data)
  
  return { error }


  // if (error) {
  //   redirect('/error')
  // }

  // revalidatePath('/', 'layout')
  // redirect('/')
}