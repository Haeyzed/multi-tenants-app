import { Tenant } from "@/types/central/tenant"
import { Domain } from "@/types/central/domain"
import { apiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  TenantFormValues,
  UpdateTenantFormValues,
} from "@/schemas/central/tenant-schema"

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
  tenant: TenantFormValues
): Promise<Tenant> => {
  const response = await apiClient.post<ApiResponse<Tenant>>("/tenants", tenant)
  return response.data
}

export const updateTenant = async (
  id: string,
  tenant: UpdateTenantFormValues
): Promise<Tenant> => {
  const response = await apiClient.put<ApiResponse<Tenant>>(
    `/tenants/${id}`,
    tenant
  )
  return response.data
}

export const deleteTenant = async (id: string): Promise<void> => {
  await apiClient.delete<ApiResponse<void>>(`/tenants/${id}`)
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

export const activateTenant = async (id: string): Promise<Tenant> => {
  const response = await apiClient.post<ApiResponse<Tenant>>(
    `/tenants/${id}/activate`,
    {}
  )
  return response.data
}

export const suspendTenant = async (id: string): Promise<Tenant> => {
  const response = await apiClient.post<ApiResponse<Tenant>>(
    `/tenants/${id}/suspend`,
    {}
  )
  return response.data
}

export const addTenantDomain = async (
  id: string,
  domain: { domain: string; is_primary?: boolean }
): Promise<Domain> => {
  const response = await apiClient.post<ApiResponse<Domain>>(
    `/tenants/${id}/domains`,
    domain
  )
  return response.data
}

export const verifyTenantDomain = async (
  tenantId: string,
  domainId: number
): Promise<Domain> => {
  const response = await apiClient.post<ApiResponse<Domain>>(
    `/tenants/${tenantId}/domains/${domainId}/verify`,
    {}
  )
  return response.data
}
