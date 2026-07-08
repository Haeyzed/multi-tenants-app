import { Tenant } from "@/types/central/tenant"
import { Domain } from "@/types/central/domain"
import { apiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import { ExportParams } from "@/types/central/export"
import {
  StoreTenantFormValues,
  UpdateTenantFormValues,
} from "@/schemas/central/tenant-schema"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"

export const getTenants = async (params?: {
  search?: string
  status?: ("pending" | "active" | "suspended")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Tenant>> => {
  const response = await apiClient.get<ApiResponse<Tenant[]>>(
    "/tenants",
    params
  )
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

export const getTenant = async (id: string): Promise<Tenant> => {
  const response = await apiClient.get<ApiResponse<Tenant>>(`/tenants/${id}`)
  return response.data
}

export const createTenant = async (
  tenant: StoreTenantFormValues
): Promise<ApiMutationResult<Tenant>> => {
  const response = await apiClient.post<ApiResponse<Tenant>>("/tenants", tenant)
  return { data: response.data, message: response.message }
}

export const updateTenant = async (
  id: string,
  tenant: UpdateTenantFormValues
): Promise<ApiMutationResult<Tenant>> => {
  const response = await apiClient.put<ApiResponse<Tenant>>(
    `/tenants/${id}`,
    tenant
  )
  return { data: response.data, message: response.message }
}

export const deleteTenant = async (
  id: string
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(`/tenants/${id}`)
  return { data: null, message: response.message }
}

export const getTenantStatistics = async (): Promise<{
  total: number
  active: number
  suspended: number
  pending: number
}> => {
  const response = await apiClient.get<
    ApiResponse<{
      total: number
      active: number
      suspended: number
      pending: number
    }>
  >("/tenants/statistics")
  return response.data
}

export const activateTenant = async (
  id: string
): Promise<ApiMutationResult<Tenant>> => {
  const response = await apiClient.post<ApiResponse<Tenant>>(
    `/tenants/${id}/activate`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const suspendTenant = async (
  id: string
): Promise<ApiMutationResult<Tenant>> => {
  const response = await apiClient.post<ApiResponse<Tenant>>(
    `/tenants/${id}/suspend`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getTenantDomains = async (tenantId: string): Promise<Domain[]> => {
  const response = await apiClient.get<ApiResponse<Domain[]>>(
    `/tenants/${tenantId}/domains`
  )
  return response.data
}

export const addTenantDomain = async (
  id: string,
  domain: { domain: string; is_primary?: boolean }
): Promise<ApiMutationResult<Domain>> => {
  const response = await apiClient.post<ApiResponse<Domain>>(
    `/tenants/${id}/domains`,
    domain
  )
  return { data: response.data, message: response.message }
}

export const verifyTenantDomain = async (
  tenantId: string,
  domainId: number
): Promise<ApiMutationResult<Domain>> => {
  const response = await apiClient.post<ApiResponse<Domain>>(
    `/tenants/${tenantId}/domains/${domainId}/verify`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const updateTenantDomain = async (
  tenantId: string,
  domainId: number,
  data: { is_primary?: boolean }
): Promise<ApiMutationResult<Domain>> => {
  const response = await apiClient.put<ApiResponse<Domain>>(
    `/tenants/${tenantId}/domains/${domainId}`,
    data
  )
  return { data: response.data, message: response.message }
}

export const deleteTenantDomain = async (
  tenantId: string,
  domainId: number
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/tenants/${tenantId}/domains/${domainId}`
  )
  return { data: null, message: response.message }
}

export const deleteManyTenants = async (
  ids: string[]
): Promise<ApiMutationResult<null>> => {
  const response = await apiClient.delete<ApiResponse<null>>("/tenants/bulk", {
    ids,
  })
  return { data: null, message: response.message }
}

export const exportTenants = async (
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
      "/tenants/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await apiClient.postFileDownload("/tenants/export", body, {
    defaultFilename: `tenants-export.${extension}`,
  })
}

export const downloadTenantsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await apiClient.getFileDownload(
    "/tenants/import/sample",
    { type },
    `tenants-import-sample.${type}`
  )
}

export const importTenants = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await apiClient.upload<ApiResponse<null>>(
    "/tenants/import",
    formData
  )
  return { data: null, message: response.message }
}
