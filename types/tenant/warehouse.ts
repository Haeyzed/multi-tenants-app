export interface WarehouseZone {
  id: number
  warehouse_id: number
  name: string
  code: string
  description: string | null
  zone_type: string | null
  is_active: boolean
  sort_order: number
  locations_count?: number
  created_at: string
  updated_at?: string | null
}

export interface WarehouseLocation {
  id: number
  warehouse_id: number
  zone_id: number | null
  code: string
  name: string | null
  description: string | null
  max_weight: number | null
  max_volume: number | null
  is_active: boolean
  is_picking_location: boolean
  zone?: {
    id: number
    name: string
    code: string
  } | null
  created_at: string
  updated_at?: string | null
}

export interface Warehouse {
  id: number
  name: string
  code: string
  description: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state: string | null
  postal_code: string | null
  country: string | null
  phone: string | null
  email: string | null
  manager_name: string | null
  latitude: number | null
  longitude: number | null
  is_active: boolean
  is_primary: boolean
  sort_order: number
  zones_count?: number
  locations_count?: number
  inventories_count?: number
  zones?: WarehouseZone[]
  created_at: string
  updated_at?: string | null
}

export interface WarehouseOption {
  label: string
  value: number
  code: string
}
