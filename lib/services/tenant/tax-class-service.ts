import { TaxClass, TaxClassOption } from "@/types/tenant/tax-class"
import { ExportParams, TaxClassStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxClassFormValues,
  UpdateTaxClassFormValues,
} from "@/schemas/tenant/tax-class-schema"

export const getTaxClasses = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  is_default?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<TaxClass>> => {
  const response = await tenantApiClient.get<ApiResponse<TaxClass[]>>(
    "/tax-classes",
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

export const getTaxClass = async (id: number): Promise<TaxClass> => {
  const response = await tenantApiClient.get<ApiResponse<TaxClass>>(
    `/tax-classes/${id}`
  )
  return response.data
}

export const getTaxClassByCode = async (code: string): Promise<TaxClass> => {
  const response = await tenantApiClient.get<ApiResponse<TaxClass>>(
    `/tax-classes/code/${code}`
  )
  return response.data
}

export const createTaxClass = async (
  taxClass: StoreTaxClassFormValues
): Promise<ApiMutationResult<TaxClass>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxClass>>(
    "/tax-classes",
    taxClass
  )
  return { data: response.data, message: response.message }
}

export const updateTaxClass = async (
  id: number,
  taxClass: UpdateTaxClassFormValues
): Promise<ApiMutationResult<TaxClass>> => {
  const response = await tenantApiClient.put<ApiResponse<TaxClass>>(
    `/tax-classes/${id}`,
    taxClass
  )
  return { data: response.data, message: response.message }
}

export const deleteTaxClass = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-classes/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyTaxClasses = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/tax-classes/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const reorderTaxClasses = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.put<ApiResponse<void>>(
    "/tax-classes/reorder",
    { ids }
  )
  return { data: null, message: response.message }
}

export const restoreTaxClass = async (
  id: number
): Promise<ApiMutationResult<TaxClass>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxClass>>(
    `/tax-classes/${id}/restore`, {}
  )
  return { data: response.data, message: response.message }
}

export const restoreManyTaxClasses = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.post<ApiResponse<void>>(
    "/tax-classes/bulk-restore",
    {
      ids,
    }
  )
  return { data: null, message: response.message }
}

export const forceDeleteTaxClass = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-classes/${id}/force`
  )
  return { data: null, message: response.message }
}

export const toggleTaxClassActive = async (
  id: number
): Promise<ApiMutationResult<TaxClass>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxClass>>(
    `/tax-classes/${id}/toggle-active`, {}
  )
  return { data: response.data, message: response.message }
}

export const setDefaultTaxClass = async (
  id: number
): Promise<ApiMutationResult<TaxClass>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxClass>>(
    `/tax-classes/${id}/set-default`, {}
  )
  return { data: response.data, message: response.message }
}

export const getTaxClassOptions = async (): Promise<TaxClassOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<TaxClassOption[]>>(
    "/tax-classes/options"
  )
  return response.data
}

export const getTaxClassStatistics = async (): Promise<TaxClassStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<TaxClassStatistics>>(
    "/tax-classes/statistics"
  )
  return response.data
}

export const exportTaxClasses = async (
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
      "/tax-classes/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/tax-classes/export", body, {
    defaultFilename: `tax-classes-export.${extension}`,
  })
}

export const downloadTaxClassesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/tax-classes/import/sample",
    { type },
    `tax-classes-import-sample.${type}`
  )
}

export const importTaxClasses = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/tax-classes/import",
    formData
  )
  return { data: null, message: response.message }
}
