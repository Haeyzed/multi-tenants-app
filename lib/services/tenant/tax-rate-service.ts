import { TaxRate, TaxRateOption } from "@/types/tenant/tax-rate"
import { ExportParams, TaxRateStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxRateFormValues,
  UpdateTaxRateFormValues,
} from "@/schemas/tenant/tax-rate-schema"

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
): Promise<ApiMutationResult<TaxRate>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    "/tax-rates",
    taxRate
  )
  return { data: response.data, message: response.message }
}

export const updateTaxRate = async (
  id: number,
  taxRate: UpdateTaxRateFormValues
): Promise<ApiMutationResult<TaxRate>> => {
  const response = await tenantApiClient.put<ApiResponse<TaxRate>>(
    `/tax-rates/${id}`,
    taxRate
  )
  return { data: response.data, message: response.message }
}

export const deleteTaxRate = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-rates/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyTaxRates = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/tax-rates/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const restoreTaxRate = async (
  id: number
): Promise<ApiMutationResult<TaxRate>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    `/tax-rates/${id}/restore`, {}
  )
  return { data: response.data, message: response.message }
}

export const restoreManyTaxRates = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.post<ApiResponse<void>>(
    "/tax-rates/bulk-restore",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const toggleTaxRateActive = async (
  id: number
): Promise<ApiMutationResult<TaxRate>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRate>>(
    `/tax-rates/${id}/toggle-active`, {}
  )
  return { data: response.data, message: response.message }
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

export const exportTaxRates = async (
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
      "/tax-rates/export",
      body
    )
    return { data: null, message: response.message }
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

export const importTaxRates = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/tax-rates/import",
    formData
  )
  return { data: null, message: response.message }
}
