export interface TaxRateOption {
  label: string
  value: number
}

export interface TaxRate {
  id: number
  tax_class_id: number
  tax_zone_id: number
  name: string
  rate: string
  priority: number
  is_compound: boolean
  applies_to_shipping: boolean
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
  tax_class?: { id: number; name: string; code?: string }
  tax_zone?: { id: number; name: string; country_code?: string | null }
  created_at: string
  updated_at?: string | null
}
