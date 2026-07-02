export interface Customer {
  id: number
  user_id: number
  customer_group_id: number | null
  first_name: string
  last_name: string
  full_name: string
  email: string
  phone: string | null
  is_active: boolean
  created_at: string
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
