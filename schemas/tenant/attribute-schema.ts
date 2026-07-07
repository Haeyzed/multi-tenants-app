import { z } from "zod"

const attributeTypeSchema = z.enum([
  "select",
  "text",
  "textarea",
  "boolean",
  "number",
  "date",
  "color",
])

const attributeDisplayTypeSchema = z.enum([
  "dropdown",
  "swatch",
  "radio",
  "checkbox",
  "text_input",
])

const baseAttributeSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  code: z.string().max(255).nullable().optional(),
  type: attributeTypeSchema,
  display_type: attributeDisplayTypeSchema,
  description: z.string().nullable().optional(),
  is_filterable: z.boolean(),
  is_visible_on_product: z.boolean(),
  is_visible_on_listing: z.boolean(),
  is_required: z.boolean(),
  is_variant: z.boolean(),
  is_user_defined: z.boolean(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const storeAttributeSchema = baseAttributeSchema

export const updateAttributeSchema = baseAttributeSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
})

export const storeAttributeValueSchema = z.object({
  value: z.string().min(1, "Value is required").max(255),
  color_hex: z.string().max(7).nullable().optional(),
  image_media_id: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  is_default: z.boolean().optional(),
  sort_order: z.number().min(0).nullable().optional(),
})

export const updateAttributeValueSchema = storeAttributeValueSchema
  .partial()
  .extend({
    value: z.string().min(1, "Value is required").max(255).optional(),
  })

export type StoreAttributeFormValues = z.infer<typeof storeAttributeSchema>
export type UpdateAttributeFormValues = z.infer<typeof updateAttributeSchema>
export type StoreAttributeValueFormValues = z.infer<
  typeof storeAttributeValueSchema
>
export type UpdateAttributeValueFormValues = z.infer<
  typeof updateAttributeValueSchema
>
