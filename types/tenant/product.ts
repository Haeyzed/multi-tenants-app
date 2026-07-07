export type ProductStatus = "draft" | "active" | "archived"

export type ProductTypeValue =
  | "simple"
  | "variable"
  | "bundle"
  | "digital"
  | "service"
  | "subscription"
  | "gift_card"
  | "configurable"

export type ProductVisibilityValue = "visible" | "hidden" | "catalog" | "search"

export type ProductConditionValue =
  | "new"
  | "refurbished"
  | "used"
  | "open_box"
  | "damaged"

export type VariantStatus = "draft" | "active" | "inactive" | "archived"

export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "backorder"
  | "not_tracked"

export interface ProductEnumField<T extends string = string> {
  value: T
  label?: string
  description?: string
}

export interface ProductMediaRef {
  id: number
  url: string
  file_name?: string | null
  mime_type?: string | null
  name?: string | null
}

export interface ProductGalleryItem {
  id?: number
  media_id: number
  sort_order?: number
  alt_text?: string | null
  caption?: string | null
  is_primary?: boolean
  media?: ProductMediaRef
}

export interface ProductInventory {
  id?: number
  warehouse_id?: number | null
  quantity: number
  reserved_quantity?: number
  incoming_quantity?: number
  damaged_quantity?: number
  available_quantity?: number
  reorder_level?: number | null
  reorder_quantity?: number | null
  location_code?: string | null
  batch_number?: string | null
  expiry_date?: string | null
  is_low_stock?: boolean
}

export interface ProductVariant {
  id: number
  product_id?: number
  title: string
  sku: string
  price: string
  compare_at_price?: string | null
  cost_price?: string | null
  barcode?: string | null
  gtin?: string | null
  mpn?: string | null
  weight?: string | null
  length?: string | null
  width?: string | null
  height?: string | null
  weight_unit_id?: number | null
  dimension_unit_id?: number | null
  image_media_id?: number | null
  status?: VariantStatus
  visibility?: ProductVisibilityValue | ProductEnumField<ProductVisibilityValue>
  is_default?: boolean
  position?: number
  inventory?: ProductInventory | null
  inventories?: ProductInventory[]
  price_tiers?: ProductPriceTier[]
  image_media?: ProductMediaRef | null
  option_values?: ProductVariantOptionValue[]
  created_at?: string
}

export interface ProductPriceTier {
  id?: number
  product_variant_id?: number
  customer_group_id?: number | null
  min_quantity: number
  max_quantity?: number | null
  price: string | number
  starts_at?: string | null
  ends_at?: string | null
}

export interface ProductRelationRef {
  id: number
  name: string
  slug?: string
  sku?: string | null
  primary_image_media?: ProductMediaRef | null
}

export interface ProductVariantOptionValue {
  id: number
  value: string
  code?: string
  position?: number
  option?: {
    id: number
    name: string
    code?: string
  }
}

export interface ProductGenerationOptionValue {
  id?: number
  product_option_id?: number
  value: string
  code?: string
  position?: number
}

export interface ProductGenerationOption {
  id?: number
  product_id?: number
  name: string
  code?: string
  position?: number
  values: ProductGenerationOptionValue[]
}

export interface ProductSupplierAssignment {
  id?: number
  supplier_id: number
  supplier_sku?: string | null
  supplier_cost?: string | number | null
  lead_time_days?: number | null
  minimum_quantity?: number
  is_primary?: boolean
  supplier?: {
    id: number
    name: string
    code?: string | null
  } | null
}

export interface ProductDownload {
  id?: number
  media_id: number
  file_name?: string
  display_name?: string | null
  description?: string | null
  download_limit?: number | null
  download_expiry_days?: number | null
  sort_order?: number
  is_preview?: boolean
  media?: ProductMediaRef | null
}

export interface ProductBundleItem {
  id?: number
  included_product_id: number
  included_variant_id?: number | null
  quantity: number
  is_optional?: boolean
  discount_percentage?: string | number | null
  fixed_price?: string | number | null
  sort_order?: number
  included_product?: ProductRelationRef | null
}

export type ProductServiceLocationType =
  | "any"
  | "in_person"
  | "online"
  | "hybrid"

export interface ProductServiceConfig {
  duration_minutes: number
  buffer_minutes_before?: number
  buffer_minutes_after?: number
  max_participants?: number | null
  location_type?: ProductServiceLocationType
  location_address?: string | null
  meeting_url?: string | null
  requires_confirmation?: boolean
  cancellation_hours?: number
  instructions?: string | null
  schedules?: ProductServiceSchedule[]
}

export interface ProductServiceSchedule {
  id?: number
  product_id?: number
  provider_id?: number | null
  day_of_week: number
  day_name?: string
  start_time: string
  end_time: string
  is_available?: boolean
}

export type ProductSubscriptionInterval = "day" | "week" | "month" | "year"

export interface ProductSubscriptionConfig {
  interval: ProductSubscriptionInterval
  interval_count?: number
  trial_days?: number
  trial_price?: string | number | null
  billing_cycles?: number | null
  prorate?: boolean
  allow_pause?: boolean
  allow_cancel_anytime?: boolean
}

export interface ProductProviderAssignment {
  id?: number
  provider_id: number
  is_primary?: boolean
  commission_rate?: string | number | null
  provider?: {
    id: number
    name: string
    email?: string
  } | null
}

export interface ProductCollectionRef {
  id: number
  name: string
  slug?: string
}

export interface ProductAttributeAssignment {
  attribute_id: number
  attribute_value_id?: number | null
  custom_value?: string | null
}

export interface ProductAttributeRef {
  attribute: {
    id: number
    name: string
    slug?: string
  }
  value: {
    id?: number | null
    value?: string | null
    slug?: string | null
  }
}

export interface ProductSeoData {
  canonical_url?: string | null
  og_title?: string | null
  og_description?: string | null
  og_image_media_id?: number | null
  og_image?: ProductMediaRef | null
  twitter_card?: string | null
  twitter_title?: string | null
  twitter_description?: string | null
  twitter_image_media_id?: number | null
  twitter_image?: ProductMediaRef | null
  robots_meta?: string | null
}

export interface ProductCategoryRef {
  id: number
  name: string
  is_primary?: boolean
  pivot?: {
    is_primary?: boolean
    sort_order?: number
  }
}

export interface Product {
  id: number
  name: string
  slug: string
  subtitle?: string | null
  summary?: string | null
  description: string | null
  type: ProductTypeValue | ProductEnumField<ProductTypeValue>
  condition: ProductConditionValue | ProductEnumField<ProductConditionValue>
  status: ProductStatus | ProductEnumField<ProductStatus>
  status_label?: string
  visibility: ProductVisibilityValue | ProductEnumField<ProductVisibilityValue>
  is_featured: boolean
  is_returnable?: boolean
  is_taxable: boolean
  track_inventory: boolean
  allow_backorders: boolean
  requires_shipping?: boolean
  stock_status?: StockStatus
  brand_id: number | null
  attribute_set_id?: number | null
  tax_class_id?: number | null
  category_ids?: number[]
  primary_category_id?: number | null
  brand?: { id: number; name: string } | null
  categories?: ProductCategoryRef[]
  primary_category?: ProductCategoryRef | null
  tags?: { id: number; name: string }[]
  labels?: {
    id: number
    name: string
    slug?: string
    color?: string | null
    background_color?: string | null
  }[]
  label_ids?: number[]
  collections?: ProductCollectionRef[]
  collection_ids?: number[]
  suppliers?: ProductSupplierAssignment[]
  primary_supplier_id?: number | null
  attributes?: ProductAttributeRef[]
  seo?: ProductSeoData | null
  related_products?: ProductRelationRef[]
  cross_sell_products?: ProductRelationRef[]
  up_sell_products?: ProductRelationRef[]
  downloads?: ProductDownload[]
  bundle_items?: ProductBundleItem[]
  service?: ProductServiceConfig | null
  subscription?: ProductSubscriptionConfig | null
  providers?: ProductProviderAssignment[]
  options?: ProductGenerationOption[]
  primary_image_media?: ProductMediaRef | null
  gallery?: ProductGalleryItem[]
  videos?: {
    id?: number
    video_url: string
    video_id?: string | null
    title?: string | null
    description?: string | null
    sort_order?: number
    is_primary?: boolean
    thumbnail_url?: string | null
    embed_url?: string | null
  }[]
  default_variant?: ProductVariant | null
  variants?: ProductVariant[]
  variants_count?: number
  reviews_count?: number
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  published_at?: string | null
  created_at: string
  updated_at?: string | null
}

export interface ProductOption {
  label: string
  value: number
}

export interface ProductStatistics {
  total: number
  draft: number
  active: number
  archived: number
  featured: number
  low_stock: number
}

export function resolveProductEnumValue<T extends string>(
  value: T | ProductEnumField<T> | null | undefined,
  fallback: T
): T {
  if (!value) {
    return fallback
  }

  if (typeof value === "string") {
    return value as T
  }

  return value.value ?? fallback
}

export function resolveProductEnumLabel<T extends string>(
  value: T | ProductEnumField<T> | null | undefined,
  fallback = "—"
): string {
  if (!value) {
    return fallback
  }

  if (typeof value === "string") {
    return value.replace(/_/g, " ")
  }

  return value.label ?? value.value.replace(/_/g, " ")
}
