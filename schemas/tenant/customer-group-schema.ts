import { z } from "zod"

const baseCustomerGroupSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable().optional(),
  discount_percentage: z.coerce.number().min(0).max(100).nullable().optional(),
  is_active: z.boolean(),
})

export const storeCustomerGroupSchema = baseCustomerGroupSchema

export const updateCustomerGroupSchema = baseCustomerGroupSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreCustomerGroupFormValues = z.infer<typeof storeCustomerGroupSchema>
export type UpdateCustomerGroupFormValues = z.infer<typeof updateCustomerGroupSchema>
