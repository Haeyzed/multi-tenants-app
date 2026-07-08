import { Plan, PlanOption } from "@/types/central/plan"
import { ExportParams, PlanStatistics } from "@/types/central/export"
import { apiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StorePlanFormValues,
  UpdatePlanFormValues,
} from "@/schemas/central/plan-schema"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"

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

export const createPlan = async (
  plan: StorePlanFormValues
): Promise<ApiMutationResult<Plan>> => {
  const payload = {
    ...plan,
    limits: Array.isArray(plan.limits) ? plan.limits : [],
  }
  const response = await apiClient.post<ApiResponse<Plan>>("/plans", payload)
  return { data: response.data, message: response.message }
}

export const updatePlan = async (
  id: number,
  plan: UpdatePlanFormValues
): Promise<ApiMutationResult<Plan>> => {
  const payload = {
    ...plan,
    limits: Array.isArray(plan.limits) ? plan.limits : [],
  }
  const response = await apiClient.put<ApiResponse<Plan>>(
    `/plans/${id}`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const deletePlan = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/plans/${id}`)
  return { data: null, message: response.message }
}

export const getPlanOptions = async (): Promise<PlanOption[]> => {
  const response =
    await apiClient.get<ApiResponse<PlanOption[]>>("/plans/options")
  return response.data
}

export const getPlanStatistics = async (): Promise<PlanStatistics> => {
  const response =
    await apiClient.get<ApiResponse<PlanStatistics>>("/plans/statistics")
  return response.data
}

export const deleteManyPlans = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>("/plans/bulk", {
    ids,
  })
  return { data: null, message: response.message }
}

export const exportPlans = async (
  params: ExportParams
): Promise<void | ApiMutationResult<null>> => {
  const body = {
    ids: params.ids,
    delivery: params.delivery,
    type: params.type ?? "xlsx",
    start_date: params.start_date,
    end_date: params.end_date,
    recipient_id: params.recipient_id,
    columns: params.columns,
  }

  if (params.delivery === "email") {
    const response = await apiClient.post<ApiResponse<void>>(
      "/plans/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await apiClient.postFileDownload("/plans/export", body, {
    defaultFilename: `plans-export.${extension}`,
  })
}

export const downloadPlansImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await apiClient.getFileDownload(
    "/plans/import/sample",
    { type },
    `plans-import-sample.${type}`
  )
}

export const importPlans = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await apiClient.upload<ApiResponse<null>>(
    "/plans/import",
    formData
  )
  return { data: null, message: response.message }
}
