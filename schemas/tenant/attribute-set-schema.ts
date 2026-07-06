import { z } from "zod"

const baseAttributeSetSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeAttributeSetSchema = baseAttributeSetSchema

export const updateAttributeSetSchema = baseAttributeSetSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreAttributeSetFormValues = z.infer<typeof storeAttributeSetSchema>
export type UpdateAttributeSetFormValues = z.infer<typeof updateAttributeSetSchema>
