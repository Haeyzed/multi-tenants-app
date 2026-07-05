export interface TaxClass {
  id: number
  name: string
  code: string
  description: string | null
  is_default: boolean
  is_active: boolean
  sort_order: number
  rates_count?: number
  products_count?: number
  created_at: string
  updated_at?: string | null
}

export interface TaxClassOption {
  label: string
  value: number
}
