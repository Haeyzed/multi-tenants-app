import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"

export interface TeamMember {
  id: number
  name: string
  email: string
  phone?: string | null
  is_active?: boolean
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginatedResponse<unknown>["meta"]
}

export const getTeamMembers = async (params?: {
  search?: string
  is_active?: "active" | "inactive"
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<TeamMember>> => {
  const response = await tenantApiClient.get<ApiResponse<TeamMember[]>>("/team", {
    params,
  })

  return {
    data: response.data,
    meta: response.meta ?? {
      current_page: 1,
      last_page: 1,
      per_page: response.data.length,
      total: response.data.length,
    },
  }
}
