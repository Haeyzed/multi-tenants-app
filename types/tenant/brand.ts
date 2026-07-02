export interface TenantMedia {
  id: number
  url: string
  path?: string | null
  name?: string | null
}

export interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  is_visible: boolean
  logo?: TenantMedia | null
  banner?: TenantMedia | null
  meta_title: string | null
  meta_description: string | null
  website_url: string | null
  sort_order: number
  created_at: string
}

export interface BrandOption {
  label: string
  value: number
}
