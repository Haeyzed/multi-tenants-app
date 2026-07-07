import { TaxZone, TaxZoneOption } from "@/types/tenant/tax-zone"
import { ExportParams, TaxZoneStatistics } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxZoneFormValues,
  UpdateTaxZoneFormValues,
} from "@/schemas/tenant/tax-zone-schema"

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
): Promise<TaxZone> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    "/tax-zones",
    taxZone
  )
  return response.data
}

export const updateTaxZone = async (
  id: number,
  taxZone: UpdateTaxZoneFormValues
): Promise<TaxZone> => {
  const response = await tenantApiClient.put<ApiResponse<TaxZone>>(
    `/tax-zones/${id}`,
    taxZone
  )
  return response.data
}

export const deleteTaxZone = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/tax-zones/${id}`)
}

export const deleteManyTaxZones = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/tax-zones/bulk", { ids })
}

export const reorderTaxZones = async (ids: number[]): Promise<void> => {
  await tenantApiClient.put<ApiResponse<void>>("/tax-zones/reorder", { ids })
}

export const restoreTaxZone = async (id: number): Promise<TaxZone> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/restore`
  )
  return response.data
}

export const restoreManyTaxZones = async (ids: number[]): Promise<void> => {
  await tenantApiClient.post<ApiResponse<void>>("/tax-zones/bulk-restore", {
    ids,
  })
}

export const forceDeleteTaxZone = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/tax-zones/${id}/force`)
}

export const toggleTaxZoneActive = async (id: number): Promise<TaxZone> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/toggle-active`
  )
  return response.data
}

export const setDefaultTaxZone = async (id: number): Promise<TaxZone> => {
  const response = await tenantApiClient.post<ApiResponse<TaxZone>>(
    `/tax-zones/${id}/set-default`
  )
  return response.data
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

export const exportTaxZones = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/tax-zones/export", body)
    return
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

export const importTaxZones = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/tax-zones/import", formData)
}
