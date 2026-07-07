import { z } from "zod"

const baseProductLabelSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  color: z.string().max(7).nullable().optional(),
  background_color: z.string().max(7).nullable().optional(),
  icon: z.string().max(255).nullable().optional(),
  is_active: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeProductLabelSchema = baseProductLabelSchema

export const updateProductLabelSchema = baseProductLabelSchema
  .partial()
  .extend({
    name: z.string().min(1, "Name is required").max(255).optional(),
  })

export type StoreProductLabelFormValues = z.infer<
  typeof storeProductLabelSchema
>
export type UpdateProductLabelFormValues = z.infer<
  typeof updateProductLabelSchema
>
