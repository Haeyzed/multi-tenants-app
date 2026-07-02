export interface TenantMedia {
  id: number
  url: string
  path?: string | null
  name?: string | null
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  parent_id: number | null
  is_visible: boolean
  sort_order: number
  parent?: Category | null
  image?: TenantMedia | null
  banner?: TenantMedia | null
  created_at: string
}

export interface CategoryOption {
  label: string
  value: number
}
