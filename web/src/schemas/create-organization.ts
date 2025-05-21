import * as z from "zod"

export const createOrganizationSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1).max(2),
  vat: z.string().min(6),
  plan: z.enum(['basic', 'pro', 'enterprise']),
})

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>