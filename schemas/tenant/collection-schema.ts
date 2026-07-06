import { z } from "zod"

const collectionTypeSchema = z.enum(["manual", "automated"])

const baseCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
  image_media_id: z.number().nullable().optional(),
  banner_media_id: z.number().nullable().optional(),
  is_visible: z.boolean(),
  is_featured: z.boolean().optional(),
  sort_order: z.number().min(0).nullable().optional(),
  type: collectionTypeSchema,
  conditions: z.record(z.string(), z.unknown()).nullable().optional(),
  sort_by: z.string().max(50).nullable().optional(),
})

export const storeCollectionSchema = baseCollectionSchema

export const updateCollectionSchema = baseCollectionSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreCollectionFormValues = z.infer<typeof storeCollectionSchema>
export type UpdateCollectionFormValues = z.infer<typeof updateCollectionSchema>
