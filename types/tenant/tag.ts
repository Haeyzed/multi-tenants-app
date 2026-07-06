export interface Tag {
  id: number
  name: string
  slug: string
  color: string | null
  icon: string | null
  is_visible: boolean
  sort_order: number
  products_count: number
  created_at: string
  updated_at?: string | null
}

export interface TagOption {
  label: string
  value: number
}
