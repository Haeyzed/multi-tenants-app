export interface TaxZone {
  id: number
  name: string
  country_code: string | null
  state: string | null
  city: string | null
  postal_code: string | null
  postal_code_pattern: string | null
  latitude: string | null
  longitude: string | null
  radius_km: string | null
  is_default: boolean
  is_active: boolean
  sort_order: number
  rates_count?: number
  created_at: string
  updated_at?: string | null
}

export interface TaxZoneOption {
  label: string
  value: number
}
