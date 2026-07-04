import type { TenantMedia } from "@/types/tenant/shared-media"

export type { TenantMedia }

export interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  summary: string | null
  is_visible: boolean
  is_featured: boolean
  logo?: TenantMedia | null
  banner?: TenantMedia | null
  meta_title: string | null
  meta_description: string | null
  website_url: string | null
  country_of_origin: string | null
  sort_order: number
  products_count: number
  created_at: string
  updated_at?: string | null
}

export interface BrandOption {
  label: string
  value: number
}
