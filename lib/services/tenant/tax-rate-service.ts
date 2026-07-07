import { TaxRate, TaxRateOption } from "@/types/tenant/tax-rate"
import { ExportParams, TaxRateStatistics } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxRateFormValues,
  UpdateTaxRateFormValues,
} from "@/schemas/tenant/tax-rate-schema"

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

export const getTaxRates = async (params?: {
  search?: string
  tax_class_id?: number
  tax_zone_id?: number
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<TaxRate>> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRate[]>>(
    "/tax-rates",
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

export const getTaxRate = async (id: number): Promise<TaxRate> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRate>>(
    `/tax-rates/${id}`
  )
  return response.data
}

export const createTaxRate = async (
  taxRate: StoreTaxRateFormValues
): Promise<TaxRate> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    "/tax-rates",
    taxRate
  )
  return response.data
}

export const updateTaxRate = async (
  id: number,
  taxRate: UpdateTaxRateFormValues
): Promise<TaxRate> => {
  const response = await tenantApiClient.put<ApiResponse<TaxRate>>(
    `/tax-rates/${id}`,
    taxRate
  )
  return response.data
}

export const deleteTaxRate = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/tax-rates/${id}`)
}

export const deleteManyTaxRates = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/tax-rates/bulk", { ids })
}

export const restoreTaxRate = async (id: number): Promise<TaxRate> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    `/tax-rates/${id}/restore`
  )
  return response.data
}

export const restoreManyTaxRates = async (ids: number[]): Promise<void> => {
  await tenantApiClient.post<ApiResponse<void>>("/tax-rates/bulk-restore", {
    ids,
  })
}

export const toggleTaxRateActive = async (id: number): Promise<TaxRate> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    `/tax-rates/${id}/toggle-active`
  )
  return response.data
}

export const getTaxRateStatistics = async (): Promise<TaxRateStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRateStatistics>>(
    "/tax-rates/statistics"
  )
  return response.data
}

export const getTaxRateOptions = async (): Promise<TaxRateOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<TaxRateOption[]>>(
      "/tax-rates/options"
    )
  return response.data
}

export const exportTaxRates = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/tax-rates/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/tax-rates/export", body, {
    defaultFilename: `tax-rates-export.${extension}`,
  })
}

export const downloadTaxRatesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/tax-rates/import/sample",
    { type },
    `tax-rates-import-sample.${type}`
  )
}

export const importTaxRates = async (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append("file", file)
  await tenantApiClient.upload<ApiResponse<void>>("/tax-rates/import", formData)
}
