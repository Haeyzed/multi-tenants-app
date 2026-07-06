import type { TenantMedia } from "@/types/tenant/shared-media"

export type AttributeType =
  | "select"
  | "text"
  | "textarea"
  | "boolean"
  | "number"
  | "date"
  | "color"

export type AttributeDisplayType =
  | "dropdown"
  | "swatch"
  | "radio"
  | "checkbox"
  | "text_input"

export interface AttributeValue {
  id: number
  attribute_id: number
  value: string
  slug: string
  color_hex: string | null
  image_media_id: number | null
  description: string | null
  is_default: boolean
  sort_order: number
  image?: TenantMedia | null
  created_at: string
  updated_at?: string | null
}

export interface Attribute {
  id: number
  name: string
  slug: string
  code: string
  type: AttributeType
  display_type: AttributeDisplayType
  description: string | null
  is_filterable: boolean
  is_visible_on_product: boolean
  is_visible_on_listing: boolean
  is_required: boolean
  is_variant: boolean
  is_user_defined: boolean
  sort_order: number
  validation_rules: Record<string, unknown> | null
  default_value: Record<string, unknown> | null
  values_count?: number
  values?: AttributeValue[]
  created_at: string
  updated_at?: string | null
}

export interface AttributeOption {
  label: string
  value: number
}
