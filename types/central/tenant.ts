import { Domain } from "./domain"

export type TenantStatus = "pending" | "active" | "suspended"

export interface Tenant {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  status: TenantStatus
  plan: string | null
  trial_ends_at: string | null
  suspended_at: string | null
  domains: Domain[]
  primary_domain: Domain | null
  created_at: string
  updated_at: string
}
