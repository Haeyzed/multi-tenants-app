import { TaxZone, TaxZoneOption } from "@/types/tenant/tax-zone"
import { ExportParams, TaxZoneStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxZoneFormValues,
  UpdateTaxZoneFormValues,
} from "@/schemas/tenant/tax-zone-schema"

export const getTaxZones = async (params?: {
  search?: string
  country_code?: string
  is_active?: ("active" | "inactive")[]
  is_default?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<TaxZone>> => {
  const response = await tenantApiClient.get<ApiResponse<TaxZone[]>>(
    "/tax-zones",
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

export const getTaxZone = async (id: number): Promise<TaxZone> => {
  const response = await tenantApiClient.get<ApiResponse<TaxZone>>(
    `/tax-zones/${id}`
  )
  return response.data
}

export const createTaxZone = async (
  taxZone: StoreTaxZoneFormValues
): Promise<ApiMutationResult<TaxZone>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    "/tax-zones",
    taxZone
  )
  return { data: response.data, message: response.message }
}

export const updateTaxZone = async (
  id: number,
  taxZone: UpdateTaxZoneFormValues
): Promise<ApiMutationResult<TaxZone>> => {
  const response = await tenantApiClient.put<ApiResponse<TaxZone>>(
    `/tax-zones/${id}`,
    taxZone
  )
  return { data: response.data, message: response.message }
}

export const deleteTaxZone = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-zones/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyTaxZones = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/tax-zones/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const reorderTaxZones = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.put<ApiResponse<void>>(
    "/tax-zones/reorder",
    { ids }
  )
  return { data: null, message: response.message }
}

export const restoreTaxZone = async (
  id: number
): Promise<ApiMutationResult<TaxZone>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/restore`, {}
  )
  return { data: response.data, message: response.message }
}

export const restoreManyTaxZones = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.post<ApiResponse<void>>(
    "/tax-zones/bulk-restore",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const forceDeleteTaxZone = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-zones/${id}/force`
  )
  return { data: null, message: response.message }
}

export const toggleTaxZoneActive = async (
  id: number
): Promise<ApiMutationResult<TaxZone>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/toggle-active`, {}
  )
  return { data: response.data, message: response.message }
}

export const setDefaultTaxZone = async (
  id: number
): Promise<ApiMutationResult<TaxZone>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/set-default`, {}
  )
  return { data: response.data, message: response.message }
}

export const getTaxZoneOptions = async (): Promise<TaxZoneOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<TaxZoneOption[]>>(
      "/tax-zones/options"
    )
  return response.data
}

export const getTaxZoneStatistics = async (): Promise<TaxZoneStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<TaxZoneStatistics>>(
    "/tax-zones/statistics"
  )
  return response.data
}

export const exportTaxZones = async (
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
      "/tax-zones/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/tax-zones/export", body, {
    defaultFilename: `tax-zones-export.${extension}`,
  })
}

export const downloadTaxZonesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/tax-zones/import/sample",
    { type },
    `tax-zones-import-sample.${type}`
  )
}

export const importTaxZones = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/tax-zones/import",
    formData
  )
  return { data: null, message: response.message }
}
