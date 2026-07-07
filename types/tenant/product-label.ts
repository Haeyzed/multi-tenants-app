export interface ProductLabel {
  id: number
  name: string
  slug: string
  color: string | null
  background_color: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at?: string | null
}

export interface ProductLabelOption {
  label: string
  value: number
}
