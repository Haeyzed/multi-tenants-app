export interface Plan {
  id: number
  slug: string
  name: string
  description: string | null
  price: string
  currency: string
  interval: string
  stripe_price_id: string | null
  paddle_price_id: string | null
  paystack_plan_code: string | null
  paypal_plan_id: string | null
  flutterwave_plan_id: string | null
  features: string[]
  limits: Record<string, number | null> | string[]
  is_active: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PlanOption {
  label: string
  value: number
}
