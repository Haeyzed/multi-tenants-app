export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar?: string | null
  is_active: boolean
  roles: string[]
  permissions: string[]
  created_at: string
}