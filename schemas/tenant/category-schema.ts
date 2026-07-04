import { z } from "zod"

const baseCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable().optional(),
  summary: z.string().max(255).nullable().optional(),
  parent_id: z.number().nullable().optional(),
  is_visible: z.boolean(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().min(0).nullable().optional(),
  image_media_id: z.number().nullable().optional(),
  banner_media_id: z.number().nullable().optional(),
  icon_media_id: z.number().nullable().optional(),
  color: z.string().max(50).nullable().optional(),
  icon_class: z.string().max(100).nullable().optional(),
  layout_template: z.string().max(255).nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
})

export const storeCategorySchema = baseCategorySchema

export const updateCategorySchema = baseCategorySchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreCategoryFormValues = z.infer<typeof storeCategorySchema>
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>
