import { z } from "zod"

const baseTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  color: z.string().max(7).nullable().optional(),
  icon: z.string().max(255).nullable().optional(),
  is_visible: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeTagSchema = baseTagSchema

export const updateTagSchema = baseTagSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreTagFormValues = z.infer<typeof storeTagSchema>
export type UpdateTagFormValues = z.infer<typeof updateTagSchema>
