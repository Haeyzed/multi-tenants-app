import {
  CustomerGroup,
  CustomerGroupOption,
} from "@/types/tenant/customer-group"
import {
  CustomerGroupStatistics,
  ExportParams,
  ImportSummary,
} from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreCustomerGroupFormValues,
  UpdateCustomerGroupFormValues,
} from "@/schemas/tenant/customer-group-schema"

export const getCustomerGroups = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<CustomerGroup>> => {
  const response = await tenantApiClient.get<ApiResponse<CustomerGroup[]>>(
    "/customer-groups",
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

export const getCustomerGroup = async (id: number): Promise<CustomerGroup> => {
  const response = await tenantApiClient.get<ApiResponse<CustomerGroup>>(
    `/customer-groups/${id}`
  )
  return response.data
}

export const createCustomerGroup = async (
  group: StoreCustomerGroupFormValues
): Promise<ApiMutationResult<CustomerGroup>> => {
  const response = await tenantApiClient.post<ApiResponse<CustomerGroup>>(
    "/customer-groups",
    group
  )
  return { data: response.data, message: response.message }
}

export const updateCustomerGroup = async (
  id: number,
  group: UpdateCustomerGroupFormValues
): Promise<ApiMutationResult<CustomerGroup>> => {
  const response = await tenantApiClient.put<ApiResponse<CustomerGroup>>(
    `/customer-groups/${id}`,
    group
  )
  return { data: response.data, message: response.message }
}

export const deleteCustomerGroup = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/customer-groups/${id}`
  )
  return { data: null, message: response.message }
}

export const getCustomerGroupOptions = async (): Promise<
  CustomerGroupOption[]
> => {
  const response = await tenantApiClient.get<
    ApiResponse<CustomerGroupOption[]>
  >("/customer-groups/options")
  return response.data
}

export const getCustomerGroupStatistics =
  async (): Promise<CustomerGroupStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<CustomerGroupStatistics>
    >("/customer-groups/statistics")
    return response.data
  }

export const deleteManyCustomerGroups = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/customer-groups/bulk",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const exportCustomerGroups = async (
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
    const response = await tenantApiClient.post<ApiResponse<void>>(
      "/customer-groups/export",
      body
    )
    return { data: null, message: response.message }
  }
  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/customer-groups/export", body, {
    defaultFilename: `customer-groups-export.${extension}`,
  })
}

export const downloadCustomerGroupsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/customer-groups/import/sample",
    { type },
    `customer-groups-import-sample.${type}`
  )
}

export const importCustomerGroups = async (
  file: File
): Promise<ApiMutationResult<ImportSummary>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/customer-groups/import",
    formData
  )

  return {
    data: response.data,
    message: response.message,
  }
}
