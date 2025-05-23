'use server'
// app/stripe/success/page.tsx
import { handleCheckoutSuccess } from '@/app/(protected)/subscription/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) {
    redirect('/error?reason=unauthorized')
  }


  if (!sessionId) {
    redirect('/error?reason=missing-session')
  }
  
  // Process the successful checkout
  await handleCheckoutSuccess(sessionId, user.id)
  
  // This won't actually be rendered since handleCheckoutSuccess redirects
  return <div>Processing your subscription...</div>
}