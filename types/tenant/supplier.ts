export interface SupplierContact {
  id: number
  supplier_id: number
  name: string
  email: string | null
  phone: string | null
  position: string | null
  is_primary: boolean
  created_at: string
  updated_at?: string | null
}

export interface SupplierAddress {
  id: number
  supplier_id: number
  type: "office" | "billing" | "shipping"
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string | null
  postal_code: string | null
  country: string
  is_default: boolean
  created_at: string
  updated_at?: string | null
}

export interface SupplierBankAccount {
  id: number
  supplier_id: number
  account_name: string
  account_number: string
  bank_name: string
  bank_branch: string | null
  swift_code: string | null
  iban: string | null
  currency: string
  is_default: boolean
  created_at: string
  updated_at?: string | null
}

export interface Supplier {
  id: number
  name: string
  slug: string
  code: string
  description: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  tax_id: string | null
  registration_number: string | null
  is_active: boolean
  products_count: number
  addresses?: SupplierAddress[]
  bank_accounts?: SupplierBankAccount[]
  contacts?: SupplierContact[]
  created_at: string
  updated_at?: string | null
}

export interface SupplierOption {
  label: string
  value: number
  code: string
}
