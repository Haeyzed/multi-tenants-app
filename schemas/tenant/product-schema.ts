import { z } from "zod"
import {
  type Product,
  resolveProductEnumValue,
} from "@/types/tenant/product"

const productTypeSchema = z.enum([
  "simple",
  "variable",
  "bundle",
  "digital",
  "service",
  "subscription",
  "gift_card",
  "configurable",
])

const productVisibilitySchema = z.enum([
  "visible",
  "hidden",
  "catalog",
  "search",
])

const productConditionSchema = z.enum([
  "new",
  "refurbished",
  "used",
  "open_box",
  "damaged",
])

const galleryItemSchema = z.object({
  media_id: z.number(),
  sort_order: z.number().min(0).optional(),
  alt_text: z.string().max(255).nullable().optional(),
  caption: z.string().max(500).nullable().optional(),
  is_primary: z.boolean().optional(),
})

const productSeoSchema = z.object({
  canonical_url: z.string().max(500).nullable().optional(),
  og_title: z.string().max(255).nullable().optional(),
  og_description: z.string().nullable().optional(),
  og_image_media_id: z.number().nullable().optional(),
  twitter_card: z.string().max(50).nullable().optional(),
  twitter_title: z.string().max(255).nullable().optional(),
  twitter_description: z.string().nullable().optional(),
  twitter_image_media_id: z.number().nullable().optional(),
  robots_meta: z.string().max(100).nullable().optional(),
})

const productAttributeValueSchema = z.object({
  attribute_id: z.number(),
  attribute_value_id: z.number().nullable().optional(),
  custom_value: z.string().nullable().optional(),
})

const defaultVariantInventorySchema = z.object({
  warehouse_id: z.number().nullable().optional(),
  quantity: z.coerce.number().min(0).optional(),
  reorder_level: z.coerce.number().min(0).nullable().optional(),
})

export const productPriceTierSchema = z.object({
  id: z.number().optional(),
  min_quantity: z.coerce.number().int().min(1),
  max_quantity: z.coerce.number().int().min(1).nullable().optional(),
  price: z.coerce.number().min(0, "Tier price must be at least 0"),
  customer_group_id: z.number().nullable().optional(),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
})

export const defaultVariantSchema = z.object({
  id: z.number().optional(),
  title: z.string().max(255).optional(),
  sku: z.string().min(1, "SKU is required").max(100),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  barcode: z.string().max(100).nullable().optional(),
  gtin: z.string().max(14).nullable().optional(),
  mpn: z.string().max(100).nullable().optional(),
  inventory: defaultVariantInventorySchema.optional(),
  price_tiers: z.array(productPriceTierSchema).optional(),
})

const baseProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  slug: z.string().max(255).nullable().optional(),
  subtitle: z.string().max(255).nullable().optional(),
  summary: z.string().max(500).nullable().optional(),
  description: z.string().nullable().optional(),
  type: productTypeSchema,
  condition: productConditionSchema,
  status: z.enum(["draft", "active", "archived"]),
  visibility: productVisibilitySchema,
  is_featured: z.boolean(),
  is_taxable: z.boolean(),
  track_inventory: z.boolean(),
  allow_backorders: z.boolean(),
  brand_id: z.number().nullable().optional(),
  attribute_set_id: z.number().nullable().optional(),
  tax_class_id: z.number().nullable().optional(),
  category_ids: z.array(z.number()).optional(),
  primary_category_id: z.number().nullable().optional(),
  tag_ids: z.array(z.number()).optional(),
  collection_ids: z.array(z.number()).optional(),
  primary_image_media_id: z.number().nullable().optional(),
  gallery: z.array(galleryItemSchema).optional(),
  default_variant: defaultVariantSchema.optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
  meta_keywords: z.string().nullable().optional(),
  seo: productSeoSchema.optional(),
  attribute_values: z.array(productAttributeValueSchema).optional(),
  published_at: z.string().nullable().optional(),
})

export const storeProductSchema = baseProductSchema.superRefine((data, ctx) => {
  const needsDefaultVariant = PRICING_PRODUCT_TYPES.includes(data.type)

  if (!needsDefaultVariant) {
    return
  }

  if (!data.default_variant?.sku?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "SKU is required",
      path: ["default_variant", "sku"],
    })
  }

  if (data.default_variant?.price === undefined || data.default_variant.price < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price must be at least 0",
      path: ["default_variant", "price"],
    })
  }
})

export const updateProductSchema = baseProductSchema.partial().extend({
  name: z.string().min(1, "Name is required").max(255).optional(),
  default_variant: defaultVariantSchema.partial().extend({
    sku: z.string().min(1).max(100).optional(),
    price: z.coerce.number().min(0).optional(),
  }).optional(),
})

export type StoreProductFormValues = z.infer<typeof storeProductSchema>
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>
export type ProductFormValues = StoreProductFormValues

export type ProductApiPayload = {
  name?: string
  slug?: string | null
  subtitle?: string | null
  summary?: string | null
  description?: string | null
  type?: StoreProductFormValues["type"]
  condition?: StoreProductFormValues["condition"]
  status?: StoreProductFormValues["status"]
  visibility?: StoreProductFormValues["visibility"]
  is_featured?: boolean
  is_taxable?: boolean
  track_inventory?: boolean
  allow_backorders?: boolean
  brand_id?: number | null
  attribute_set_id?: number | null
  tax_class_id?: number | null
  category_ids?: number[]
  primary_category_id?: number | null
  tag_ids?: number[]
  collection_ids?: number[]
  primary_image_media_id?: number | null
  gallery?: StoreProductFormValues["gallery"]
  default_variant?: {
    id?: number
    title?: string
    sku?: string
    price?: number
    compare_at_price?: number | null
    cost_price?: number | null
    barcode?: string | null
    gtin?: string | null
    mpn?: string | null
    inventory?: {
      warehouse_id?: number | null
      quantity?: number
      reorder_level?: number | null
    }
    price_tiers?: ProductPriceTierFormValues[]
  }
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  seo?: StoreProductFormValues["seo"]
  attribute_values?: StoreProductFormValues["attribute_values"]
  published_at?: string | null
}

export function mapProductFormToApiPayload(
  data: StoreProductFormValues | UpdateProductFormValues
): ProductApiPayload {
  const defaultVariant = data.default_variant

  const payload: ProductApiPayload = {
    name: data.name,
    slug: data.slug || null,
    subtitle: data.subtitle || null,
    summary: data.summary || null,
    description: data.description || null,
    type: data.type,
    condition: data.condition,
    status: data.status,
    visibility: data.visibility,
    is_featured: data.is_featured,
    is_taxable: data.is_taxable,
    track_inventory: data.track_inventory,
    allow_backorders: data.allow_backorders,
    brand_id: data.brand_id ?? null,
    attribute_set_id: data.attribute_set_id ?? null,
    tax_class_id: data.tax_class_id ?? null,
    category_ids: data.category_ids ?? [],
    primary_category_id: data.primary_category_id ?? null,
    tag_ids: data.tag_ids ?? [],
    collection_ids: data.collection_ids,
    primary_image_media_id: data.primary_image_media_id ?? null,
    gallery: data.gallery,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    meta_keywords: data.meta_keywords || null,
    published_at: data.published_at || null,
  }

  const seo = data.seo
  if (seo) {
    payload.seo = {
      canonical_url: seo.canonical_url || null,
      og_title: seo.og_title || null,
      og_description: seo.og_description || null,
      og_image_media_id: seo.og_image_media_id ?? null,
      twitter_card: seo.twitter_card || null,
      twitter_title: seo.twitter_title || null,
      twitter_description: seo.twitter_description || null,
      twitter_image_media_id: seo.twitter_image_media_id ?? null,
      robots_meta: seo.robots_meta || null,
    }
  }

  const attributeValues = data.attribute_values?.filter(
    (item) => item.attribute_value_id || item.custom_value?.trim()
  )
  if (attributeValues && attributeValues.length > 0) {
    payload.attribute_values = attributeValues
  }

  const productType = data.type ?? "simple"

  if (defaultVariant && !VARIANT_PRODUCT_TYPES.includes(productType)) {
    payload.default_variant = {
      id: defaultVariant.id,
      title: defaultVariant.title || data.name || undefined,
      sku: defaultVariant.sku,
      price: defaultVariant.price,
      compare_at_price: defaultVariant.compare_at_price ?? null,
      cost_price: defaultVariant.cost_price ?? null,
      barcode: defaultVariant.barcode || null,
      gtin: defaultVariant.gtin || null,
      mpn: defaultVariant.mpn || null,
    }

    if (defaultVariant.price_tiers?.length) {
      payload.default_variant.price_tiers = defaultVariant.price_tiers.map(
        (tier) => ({
          id: tier.id,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity ?? null,
          price: tier.price,
          customer_group_id: tier.customer_group_id ?? null,
          starts_at: tier.starts_at || null,
          ends_at: tier.ends_at || null,
        })
      )
    }

    if (defaultVariant.inventory) {
      payload.default_variant.inventory = {
        warehouse_id: defaultVariant.inventory.warehouse_id ?? null,
        quantity: defaultVariant.inventory.quantity ?? 0,
        reorder_level: defaultVariant.inventory.reorder_level ?? null,
      }
    }
  }

  return payload
}

export function getDefaultProductFormValues(): StoreProductFormValues {
  return {
    name: "",
    slug: "",
    subtitle: "",
    summary: "",
    description: "",
    type: "simple",
    condition: "new",
    status: "draft",
    visibility: "hidden",
    is_featured: false,
    is_taxable: true,
    track_inventory: true,
    allow_backorders: false,
    brand_id: null,
    attribute_set_id: null,
    tax_class_id: null,
    category_ids: [],
    primary_category_id: null,
    tag_ids: [],
    collection_ids: [],
    primary_image_media_id: null,
    gallery: [],
    default_variant: {
      title: "",
      sku: "",
      price: 0,
      compare_at_price: null,
      cost_price: null,
      barcode: null,
      gtin: null,
      mpn: null,
      inventory: {
        warehouse_id: null,
        quantity: 0,
        reorder_level: 5,
      },
      price_tiers: [],
    },
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    seo: {
      canonical_url: "",
      og_title: "",
      og_description: "",
      og_image_media_id: null,
      twitter_card: "summary_large_image",
      twitter_title: "",
      twitter_description: "",
      twitter_image_media_id: null,
      robots_meta: "index, follow",
    },
    attribute_values: [],
    published_at: null,
  }
}

export function mapProductToFormValues(product: Product): StoreProductFormValues {
  const type = resolveProductEnumValue(product.type, "simple")
  const condition = resolveProductEnumValue(product.condition, "new")
  const visibility = resolveProductEnumValue(product.visibility, "visible")
  const defaultVariant = product.default_variant
  const variantInventory =
    defaultVariant?.inventories?.[0] ?? defaultVariant?.inventory ?? null

  const categoryIds =
    product.category_ids ?? product.categories?.map((category) => category.id) ?? []

  const primaryCategory =
    product.primary_category ??
    product.categories?.find(
      (category) =>
        category.is_primary || category.pivot?.is_primary === true
    ) ??
    null

  return {
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle ?? "",
    summary: product.summary ?? "",
    description: product.description ?? "",
    type,
    condition,
    status: product.status,
    visibility,
    is_featured: product.is_featured,
    is_taxable: product.is_taxable ?? true,
    track_inventory: product.track_inventory ?? true,
    allow_backorders: product.allow_backorders ?? false,
    brand_id: product.brand_id,
    attribute_set_id: product.attribute_set_id ?? null,
    tax_class_id: product.tax_class_id ?? null,
    category_ids: categoryIds,
    primary_category_id:
      product.primary_category_id ?? primaryCategory?.id ?? null,
    tag_ids: product.tags?.map((tag) => tag.id) ?? [],
    collection_ids:
      product.collection_ids ?? product.collections?.map((collection) => collection.id) ?? [],
    primary_image_media_id: product.primary_image_media?.id ?? null,
    gallery:
      product.gallery
        ?.filter((item) => !item.is_primary)
        .map((item, index) => ({
        media_id: item.media_id ?? item.media?.id ?? 0,
        sort_order: item.sort_order ?? index,
        alt_text: item.alt_text ?? null,
        caption: item.caption ?? null,
        is_primary: item.is_primary,
      })) ?? [],
    default_variant: {
      id: defaultVariant?.id,
      title: defaultVariant?.title ?? product.name,
      sku: defaultVariant?.sku ?? "",
      price: defaultVariant?.price ? Number(defaultVariant.price) : 0,
      compare_at_price: defaultVariant?.compare_at_price
        ? Number(defaultVariant.compare_at_price)
        : null,
      cost_price: defaultVariant?.cost_price
        ? Number(defaultVariant.cost_price)
        : null,
      barcode: defaultVariant?.barcode ?? null,
      gtin: defaultVariant?.gtin ?? null,
      mpn: defaultVariant?.mpn ?? null,
      inventory: {
        warehouse_id: variantInventory?.warehouse_id ?? null,
        quantity: variantInventory?.quantity ?? 0,
        reorder_level: variantInventory?.reorder_level ?? 5,
      },
      price_tiers:
        defaultVariant?.price_tiers?.map((tier) => ({
          id: tier.id,
          min_quantity: tier.min_quantity,
          max_quantity: tier.max_quantity ?? null,
          price: Number(tier.price),
          customer_group_id: tier.customer_group_id ?? null,
          starts_at: tier.starts_at ?? null,
          ends_at: tier.ends_at ?? null,
        })) ?? [],
    },
    meta_title: product.meta_title ?? "",
    meta_description: product.meta_description ?? "",
    meta_keywords: product.meta_keywords ?? "",
    seo: {
      canonical_url: product.seo?.canonical_url ?? "",
      og_title: product.seo?.og_title ?? "",
      og_description: product.seo?.og_description ?? "",
      og_image_media_id:
        product.seo?.og_image_media_id ?? product.seo?.og_image?.id ?? null,
      twitter_card: product.seo?.twitter_card ?? "summary_large_image",
      twitter_title: product.seo?.twitter_title ?? "",
      twitter_description: product.seo?.twitter_description ?? "",
      twitter_image_media_id:
        product.seo?.twitter_image_media_id ??
        product.seo?.twitter_image?.id ??
        null,
      robots_meta: product.seo?.robots_meta ?? "index, follow",
    },
    attribute_values:
      product.attributes?.map((item) => ({
        attribute_id: item.attribute.id,
        attribute_value_id: item.value.id ?? null,
        custom_value:
          item.value.id == null ? (item.value.value ?? null) : null,
      })) ?? [],
    published_at: product.published_at ?? null,
  }
}

export const PRICING_PRODUCT_TYPES: StoreProductFormValues["type"][] = [
  "simple",
  "digital",
  "service",
  "bundle",
  "subscription",
]

export const VARIANT_PRODUCT_TYPES: StoreProductFormValues["type"][] = [
  "variable",
  "configurable",
]

export const productOptionValueSchema = z.object({
  id: z.number().optional(),
  value: z.string().min(1, "Value is required").max(255),
  code: z.string().max(50).optional(),
  position: z.number().min(0).optional(),
})

export const productOptionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Option name is required").max(255),
  code: z.string().max(50).optional(),
  position: z.number().min(0).optional(),
  values: z.array(productOptionValueSchema).min(1, "Add at least one value"),
})

export const syncProductOptionsSchema = z.object({
  options: z.array(productOptionSchema).min(1, "Add at least one option"),
})

export const productSupplierSchema = z.object({
  supplier_id: z.number(),
  supplier_sku: z.string().max(100).nullable().optional(),
  supplier_cost: z.coerce.number().min(0).nullable().optional(),
  lead_time_days: z.coerce.number().int().min(0).nullable().optional(),
  minimum_quantity: z.coerce.number().int().min(1).optional(),
  is_primary: z.boolean().optional(),
})

export const syncProductSuppliersSchema = z.object({
  suppliers: z.array(productSupplierSchema),
})

export const syncProductRelationsSchema = z.object({
  related_product_ids: z.array(z.number()),
  cross_sell_product_ids: z.array(z.number()),
  up_sell_product_ids: z.array(z.number()),
})

export const productDownloadSchema = z.object({
  media_id: z.number().min(1, "Select a file"),
  file_name: z.string().max(255).optional(),
  display_name: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  download_limit: z.coerce.number().int().min(1).nullable().optional(),
  download_expiry_days: z.coerce.number().int().min(1).nullable().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
  is_preview: z.boolean().optional(),
})

export const syncProductDownloadsSchema = z.object({
  downloads: z.array(productDownloadSchema),
})

export const productBundleItemSchema = z.object({
  included_product_id: z.number().min(1, "Select a product"),
  included_variant_id: z.number().nullable().optional(),
  quantity: z.coerce.number().int().min(1).default(1),
  is_optional: z.boolean().optional(),
  discount_percentage: z.coerce.number().min(0).max(100).nullable().optional(),
  fixed_price: z.coerce.number().min(0).nullable().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
})

export const syncProductBundleItemsSchema = z.object({
  bundle_items: z.array(productBundleItemSchema),
})

export const productServiceConfigSchema = z.object({
  duration_minutes: z.coerce.number().int().min(1, "Duration is required"),
  buffer_minutes_before: z.coerce.number().int().min(0).optional(),
  buffer_minutes_after: z.coerce.number().int().min(0).optional(),
  max_participants: z.coerce.number().int().min(1).nullable().optional(),
  location_type: z
    .enum(["any", "in_person", "online", "hybrid"])
    .default("any"),
  location_address: z.string().nullable().optional(),
  meeting_url: z.string().max(500).nullable().optional(),
  requires_confirmation: z.boolean().optional(),
  cancellation_hours: z.coerce.number().int().min(0).optional(),
  instructions: z.string().nullable().optional(),
})

export const productProviderSchema = z.object({
  provider_id: z.number().min(1, "Select a provider"),
  is_primary: z.boolean().optional(),
  commission_rate: z.coerce.number().min(0).max(100).nullable().optional(),
})

export const syncProductServiceSchema = z.object({
  service: productServiceConfigSchema,
  providers: z.array(productProviderSchema),
})

export const productSubscriptionConfigSchema = z.object({
  interval: z.enum(["day", "week", "month", "year"]),
  interval_count: z.coerce.number().int().min(1).optional(),
  trial_days: z.coerce.number().int().min(0).optional(),
  trial_price: z.coerce.number().min(0).nullable().optional(),
  billing_cycles: z.coerce.number().int().min(1).nullable().optional(),
  prorate: z.boolean().optional(),
  allow_pause: z.boolean().optional(),
  allow_cancel_anytime: z.boolean().optional(),
})

export const syncProductSubscriptionSchema = z.object({
  subscription: productSubscriptionConfigSchema,
})

export const storeProductVariantSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  sku: z.string().min(1, "SKU is required").max(100),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  barcode: z.string().max(100).nullable().optional(),
  is_default: z.boolean().optional(),
  option_value_ids: z.array(z.number()).optional(),
  inventory: defaultVariantInventorySchema.optional(),
  price_tiers: z.array(productPriceTierSchema).optional(),
})

export const updateProductVariantSchema = storeProductVariantSchema.partial().extend({
  title: z.string().min(1).max(255).optional(),
  sku: z.string().min(1).max(100).optional(),
  price: z.coerce.number().min(0).optional(),
})

export const generateProductVariantsSchema = z.object({
  price: z.coerce.number().min(0).optional(),
  compare_at_price: z.coerce.number().min(0).nullable().optional(),
  cost_price: z.coerce.number().min(0).nullable().optional(),
  skip_existing: z.boolean().optional(),
  inventory: defaultVariantInventorySchema.optional(),
})

export type SyncProductOptionsFormValues = z.infer<typeof syncProductOptionsSchema>
export type SyncProductSuppliersFormValues = z.infer<typeof syncProductSuppliersSchema>
export type SyncProductRelationsFormValues = z.infer<typeof syncProductRelationsSchema>
export type SyncProductDownloadsFormValues = z.infer<typeof syncProductDownloadsSchema>
export type SyncProductBundleItemsFormValues = z.infer<typeof syncProductBundleItemsSchema>
export type SyncProductServiceFormValues = z.infer<typeof syncProductServiceSchema>
export type SyncProductSubscriptionFormValues = z.infer<typeof syncProductSubscriptionSchema>
export type ProductPriceTierFormValues = z.infer<typeof productPriceTierSchema>
export type ProductSupplierFormValues = z.infer<typeof productSupplierSchema>
export type StoreProductVariantFormValues = z.infer<typeof storeProductVariantSchema>
export type UpdateProductVariantFormValues = z.infer<typeof updateProductVariantSchema>
export type GenerateProductVariantsFormValues = z.infer<
  typeof generateProductVariantsSchema
>
