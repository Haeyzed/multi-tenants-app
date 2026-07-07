export type UnitType = "weight" | "length" | "volume" | "area" | "count"

export interface Unit {
  id: number
  name: string
  code: string
  symbol: string
  type: UnitType
  conversion_factor: string | number
  is_base: boolean
  sort_order: number
  created_at: string
  updated_at?: string | null
}

export interface UnitOption {
  label: string
  value: number
  type: string
  symbol: string
}

export interface UnitTypeOption {
  label: string
  value: UnitType
}
