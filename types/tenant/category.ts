import type { TenantMedia } from "@/types/tenant/shared-media"

export type { TenantMedia }

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  summary: string | null
  meta_title: string | null
  meta_description: string | null
  parent_id: number | null
  depth?: number
  path?: string | null
  is_visible: boolean
  is_featured: boolean
  sort_order: number
  color?: string | null
  icon_class?: string | null
  layout_template?: string | null
  products_count?: number
  parent?: Category | null
  image?: TenantMedia | null
  banner?: TenantMedia | null
  icon?: TenantMedia | null
  created_at: string
  updated_at?: string | null
}

export interface CategoryOption {
  label: string
  value: number
}

export interface CategoryTreeNode {
  id: number
  name: string
  slug: string
  children: CategoryTreeNode[]
}
