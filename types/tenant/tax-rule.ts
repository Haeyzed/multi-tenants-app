export type TaxRuleApplicableType = "product" | "customer_group"

export type TaxRuleType = "override" | "exempt" | "reduce" | "increase"

export interface TaxRule {
  id: number
  tax_rate_id: number
  applicable_type: TaxRuleApplicableType
  applicable_id: number
  rule_type: TaxRuleType
  adjustment_rate: string | null
  effective_from: string | null
  effective_to: string | null
  is_active: boolean
  tax_rate?: {
    id: number
    name: string
    rate: string
    tax_class?: { id: number; name: string; code?: string }
    tax_zone?: { id: number; name: string; country_code?: string | null }
  }
  created_at: string
  updated_at?: string | null
}
