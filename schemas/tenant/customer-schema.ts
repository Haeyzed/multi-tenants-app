import { z } from "zod"

const baseCustomerSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  email: z
    .string()
    .email("Invalid email")
    .max(255)
    .nullable()
    .optional()
    .or(z.literal("")),
  phone: z.string().max(30).nullable().optional(),
  customer_group_id: z.number().nullable().optional(),
  date_of_birth: z.string().nullable().optional(),
  gender: z.string().max(20).nullable().optional(),
  is_active: z.boolean(),
})

export const storeCustomerSchema = baseCustomerSchema
export const updateCustomerSchema = baseCustomerSchema.partial().extend({
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
})

export type StoreCustomerFormValues = z.infer<typeof storeCustomerSchema>
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerSchema>
