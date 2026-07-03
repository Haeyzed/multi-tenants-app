export interface Customer {
  id: number
  user_id: number | null
  customer_group_id: number | null
  first_name: string
  last_name: string
  full_name: string
  email: string | null
  phone: string | null
  date_of_birth?: string | null
  gender?: string | null
  loyalty_points?: number
  total_spent?: string
  orders_count?: number
  is_active: boolean
  group?: import("@/types/tenant/customer-group").CustomerGroup | null
  created_at: string
}

export interface CustomerOption {
  label: string
  value: number
}

export interface CustomerStatistics {
  total: number
  active: number
  inactive: number
}

export interface CustomerProfile {
  user: {
    id: number
    name: string
    email: string
    phone: string | null
    is_active: boolean
    roles: string[]
    permissions: string[]
    created_at: string
  }
  customer: Customer
}

export interface CustomerAuthResult {
  user: CustomerProfile["user"]
  customer: Customer
  token: string
}
