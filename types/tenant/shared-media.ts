/** Embedded media reference returned on catalog resources (brand, category, etc.). */
export interface TenantMedia {
  id: number
  url: string
  path?: string | null
  name?: string | null
  title?: string | null
  file_name?: string | null
  mime_type?: string | null
}
