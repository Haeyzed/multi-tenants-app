import type { Attribute } from "@/types/tenant/attribute"

export interface AttributeSet {
  id: number
  name: string
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
  attributes_count?: number
  categories_count?: number
  attributes?: Attribute[]
  created_at: string
  updated_at?: string | null
}

export interface AttributeSetOption {
  label: string
  value: number
}
