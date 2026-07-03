export interface CustomerGroup {
  id: number
  name: string
  slug: string
  description: string | null
  discount_percent: string | null
  discount_percentage: string | null
  is_active: boolean
  customers_count?: number
  created_at: string
}

export interface CustomerGroupOption {
  label: string
  value: number
}

export interface CustomerGroupStatistics {
  total: number
  active: number
  inactive: number
}
