export type ProductStatus = "draft" | "active" | "archived"
export type ProductTypeValue = "standard" | "digital" | "service" | "combo"
export type StockStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "backorder"
  | "not_tracked"

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
  quantity: number
  reserved_quantity: number
  available_quantity?: number
  low_stock_threshold: number
  is_low_stock?: boolean
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price: string
  compare_at_price?: string | null
  cost_price?: string | null
  options?: Record<string, string> | null
  is_default: boolean
  barcode?: string | null
  weight?: string | null
  inventory?: ProductInventory | null
  image_media?: ProductMediaRef | null
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  short_description: string | null
  sku: string
  barcode: string | null
  mpn?: string | null
  gtin?: string | null
  price: string
  selling_price?: string | number
  compare_at_price: string | null
  sale_price: string | null
  cost_price: string | null
  status: ProductStatus
  status_label?: string
  is_visible: boolean
  is_featured: boolean
  taxable: boolean
  track_inventory: boolean
  allow_backorders: boolean
  stock_status?: StockStatus
  product_type: {
    value: ProductTypeValue
    label?: string
    description?: string
    requires_shipping?: boolean
    tracks_inventory?: boolean
  }
  category_id: number | null
  category_ids?: number[]
  brand_id: number | null
  category?: { id: number; name: string } | null
  categories?: { id: number; name: string }[]
  brand?: { id: number; name: string } | null
  tags?: { id: number; name: string }[]
  primary_image_media?: ProductMediaRef | null
  gallery?: ProductGalleryItem[]
  inventory?: ProductInventory | null
  variants?: ProductVariant[]
  variants_count?: number
  reviews_count?: number
  weight?: string | number | null
  length?: string | number | null
  width?: string | number | null
  height?: string | number | null
  weight_unit?: string | null
  dimension_unit?: string | null
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  canonical_url?: string | null
  published_at?: string | null
  created_at: string
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
