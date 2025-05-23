import { z } from "zod";

export const invitationSchema = z.object({
  email: z.string().email('Invalid email format'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  role: z.enum(['admin', 'member'], { 
    errorMap: () => ({ message: 'Invalid role' })
  })
})