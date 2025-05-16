'use server'

// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
import { signUp } from '@/services/auth.server'
export async function signup(data: { email: string, password: string }) {

  try {
    return await signUp(data.email, data.password)
  } catch (error) {
    return error
  }


  // if (error) {
  //   redirect('/error')
  // }

  // revalidatePath('/', 'layout')
  // redirect('/')
}