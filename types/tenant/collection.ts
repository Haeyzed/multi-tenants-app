import type { TenantMedia } from "@/types/tenant/shared-media"

export type CollectionType = "manual" | "automated"

export interface Collection {
  id: number
  name: string
  slug: string
  description: string | null
  meta_title: string | null
  meta_description: string | null
  is_visible: boolean
  is_featured: boolean
  sort_order: number
  type: CollectionType
  conditions: Record<string, unknown> | null
  sort_by: string | null
  products_count?: number
  image?: TenantMedia | null
  banner?: TenantMedia | null
  created_at: string
  updated_at?: string | null
}

export interface CollectionOption {
  label: string
  value: number
}
