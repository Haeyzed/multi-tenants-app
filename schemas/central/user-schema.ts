import { z } from "zod"

export const storeUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().nullable().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  is_active: z.boolean(),
})

export const updateUserSchema = storeUserSchema
  .omit({ password: true })
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
  })

export type StoreUserFormValues = z.infer<typeof storeUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
