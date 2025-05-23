"use server"
import { createCheckoutSession as createCheckoutSessionAction } from '@/lib/stripe/server-actions/create-checkout-session'
import { handleCheckoutSuccess as handleCheckoutSuccessAction } from '@/lib/stripe/server-actions/handle-checkout-success'

// Can not export directly from the file, i get a "Can only export async functions from server actions" error.
// Wrapping them in a function solves this.

export async function createCheckoutSession(...props: Parameters<typeof createCheckoutSessionAction>) {
  return createCheckoutSessionAction(...props)
}

export async function handleCheckoutSuccess(...props: Parameters<typeof handleCheckoutSuccessAction>) {
  return handleCheckoutSuccessAction(...props)
}
