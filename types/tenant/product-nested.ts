export interface ProductFaq {
  id: number
  product_id: number
  question: string
  answer: string
  is_visible: boolean
  sort_order: number
  helpful_count?: number
  created_at?: string
  updated_at?: string | null
}

export interface ProductDocument {
  id: number
  product_id: number
  media_id: number | null
  title: string
  description?: string | null
  document_type: "manual" | "datasheet" | "certificate" | "warranty" | string
  language: string
  sort_order: number
  is_public: boolean
  media_url?: string | null
  media?: {
    id: number
    url: string
    file_name?: string | null
    name?: string | null
    mime_type?: string | null
  } | null
  created_at?: string
  updated_at?: string | null
}

export interface ProductReview {
  id: number
  product_id: number
  product_variant_id?: number | null
  customer_id?: number | null
  author_name?: string | null
  author_email?: string | null
  rating: number
  title?: string | null
  content?: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count?: number
  unhelpful_count?: number
  admin_reply?: string | null
  replied_at?: string | null
  has_reply?: boolean
  created_at?: string
  updated_at?: string | null
}

export interface ProductQuestion {
  id: number
  product_id: number
  customer_id?: number | null
  author_name?: string | null
  author_email?: string | null
  question: string
  answer?: string | null
  is_visible: boolean
  is_answered: boolean
  helpful_count?: number
  answered_by?: number | null
  answered_at?: string | null
  answered_by_user?: { id: number; name: string } | null
  created_at?: string
  updated_at?: string | null
}

export interface ProductVideo {
  id?: number
  video_url: string
  video_id?: string | null
  title?: string | null
  description?: string | null
  sort_order?: number
  is_primary?: boolean
  provider?: string
  thumbnail_url?: string | null
  embed_url?: string | null
}
