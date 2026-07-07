import { z } from "zod"

const optionalUrl = z
  .string()
  .max(255)
  .nullable()
  .optional()
  .refine(
    (value) =>
      !value || value === "" || z.string().url().safeParse(value).success,
    { message: "Must be a valid URL" }
  )

const baseBrandSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().nullable().optional(),
  summary: z.string().max(255).nullable().optional(),
  is_visible: z.boolean(),
  is_featured: z.boolean().optional(),
  logo_media_id: z.number().nullable().optional(),
  banner_media_id: z.number().nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
  website_url: optionalUrl,
  country_of_origin: z.string().max(255).nullable().optional(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeBrandSchema = baseBrandSchema

export const updateBrandSchema = baseBrandSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export type StoreBrandFormValues = z.infer<typeof storeBrandSchema>
export type UpdateBrandFormValues = z.infer<typeof updateBrandSchema>
