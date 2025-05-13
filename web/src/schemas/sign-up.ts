import * as z from "zod"

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type SignUpSchema = z.infer<typeof signUpSchema>