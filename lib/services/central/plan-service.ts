import { Plan } from "@/types/central/plan"
import { apiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import { PlanForm } from "@/schemas/central/plan-schema"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const getPlans = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Plan>> => {
  const response = await apiClient.get<ApiResponse<Plan[]>>("/plans", params)
  return {
    data: response.data,
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getPlan = async (id: number): Promise<Plan> => {
  const response = await apiClient.get<ApiResponse<Plan>>(`/plans/${id}`)
  return response.data
}

export const createPlan = async (plan: PlanForm): Promise<Plan> => {
  // Ensure limits is always string[] for API
  const payload = {
    ...plan,
    limits: Array.isArray(plan.limits) ? plan.limits : [],
  }
  const response = await apiClient.post<ApiResponse<Plan>>("/plans", payload)
  return response.data
}

export const updatePlan = async (
  id: number,
  plan: PlanForm
): Promise<Plan> => {
  const payload = {
    ...plan,
    limits: Array.isArray(plan.limits) ? plan.limits : [],
  }
  const response = await apiClient.put<ApiResponse<Plan>>(
    `/plans/${id}`,
    payload
  )
  return response.data
}

export const deletePlan = async (id: number): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(`/plans/${id}`)
}
