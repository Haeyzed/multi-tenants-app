import { z } from "zod"

const galleryItemSchema = z.object({
  media_id: z.number(),
  sort_order: z.number().min(0).optional(),
  alt_text: z.string().max(255).nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  is_primary: z.boolean().optional(),
})

const inventorySchema = z.object({
  quantity: z.coerce.number().min(0).optional(),
  reserved_quantity: z.coerce.number().min(0).optional(),
  low_stock_threshold: z.coerce.number().min(0).optional(),
})

const variantSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(100),
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  options: z.record(z.string(), z.string()).nullable().optional(),
  is_default: z.boolean().optional(),
  barcode: z.string().max(100).nullable().optional(),
  weight: z.coerce.number().min(0).nullable().optional(),
  image_media_id: z.number().nullable().optional(),
  inventory: inventorySchema.optional(),
})

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().max(255).nullable().optional(),
  sku: z.string().min(1, "SKU is required").max(100),
  barcode: z.string().max(100).nullable().optional(),
  mpn: z.string().max(100).nullable().optional(),
  gtin: z.string().max(100).nullable().optional(),
  short_description: z.string().max(1000).nullable().optional(),
  description: z.string().nullable().optional(),
  product_type: z.enum(["standard", "digital", "service", "combo"]),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  sale_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  taxable: z.boolean(),
  status: z.enum(["draft", "active", "archived"]),
  is_visible: z.boolean(),
  is_featured: z.boolean(),
  track_inventory: z.boolean(),
  allow_backorders: z.boolean(),
  category_id: z.number().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  brand_id: z.number().nullable().optional(),
  collection_ids: z.array(z.number()).optional(),
  tag_ids: z.array(z.number()).optional(),
  primary_image_media_id: z.number().nullable().optional(),
  gallery: z.array(galleryItemSchema).optional(),
  inventory: inventorySchema.optional(),
  variants: z.array(variantSchema).optional(),
  related_product_ids: z.array(z.number()).optional(),
  cross_sell_product_ids: z.array(z.number()).optional(),
  up_sell_product_ids: z.array(z.number()).optional(),
  weight: z.coerce.number().min(0).nullable().optional(),
  length: z.coerce.number().min(0).nullable().optional(),
  width: z.coerce.number().min(0).nullable().optional(),
  height: z.coerce.number().min(0).nullable().optional(),
  weight_unit: z.enum(["kg", "g", "lb", "oz"]).optional(),
  dimension_unit: z.enum(["cm", "m", "mm", "in", "ft"]).optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional(),
  canonical_url: z.string().url().max(500).nullable().optional().or(z.literal("")),
  published_at: z.string().nullable().optional(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
