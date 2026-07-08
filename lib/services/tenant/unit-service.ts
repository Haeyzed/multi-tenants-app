import { Unit, UnitOption, UnitType, UnitTypeOption } from "@/types/tenant/unit"
import { ExportParams, UnitStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreUnitFormValues,
  UpdateUnitFormValues,
} from "@/schemas/tenant/unit-schema"

export const getUnits = async (params?: {
  search?: string
  type?: UnitType[]
  is_base?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Unit>> => {
  const response = await tenantApiClient.get<ApiResponse<Unit[]>>(
    "/units",
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

export const getUnit = async (id: number): Promise<Unit> => {
  const response = await tenantApiClient.get<ApiResponse<Unit>>(`/units/${id}`)
  return response.data
}

export const getUnitByCode = async (code: string): Promise<Unit> => {
  const response = await tenantApiClient.get<ApiResponse<Unit>>(
    `/units/code/${code}`
  )
  return response.data
}

export const createUnit = async (
  unit: StoreUnitFormValues
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.post<ApiResponse<Unit>>("/units", unit)
  return { data: response.data, message: response.message }
}

export const updateUnit = async (
  id: number,
  unit: UpdateUnitFormValues
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.put<ApiResponse<Unit>>(
    `/units/${id}`,
    unit
  )
  return { data: response.data, message: response.message }
}

export const deleteUnit = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(`/units/${id}`)
  return { data: null, message: response.message }
}

export const deleteManyUnits = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/units/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const reorderUnits = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.put<ApiResponse<void>>(
    "/units/reorder",
    { ids }
  )
  return { data: null, message: response.message }
}

export const setBaseUnit = async (
  id: number
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.post<ApiResponse<Unit>>(
    `/units/${id}/set-base`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getUnitOptions = async (
  type?: UnitType
): Promise<UnitOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<UnitOption[]>>(
    "/units/options",
    type ? { type } : undefined
  )
  return response.data
}

export const getUnitTypeOptions = async (): Promise<UnitTypeOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<UnitTypeOption[]>>(
    "/units/type-options"
  )
  return response.data
}

export const getUnitStatistics = async (): Promise<UnitStatistics> => {
  const response =
    await tenantApiClient.get<ApiResponse<UnitStatistics>>("/units/statistics")
  return response.data
}

export const exportUnits = async (
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
      "/units/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/units/export", body, {
    defaultFilename: `units-export.${extension}`,
  })
}

export const downloadUnitsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/units/import/sample",
    { type },
    `units-import-sample.${type}`
  )
}

export const importUnits = async (
  file: File
): Promise<ApiMutationResult<null>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<void>>(
    "/units/import",
    formData
  )
  return { data: null, message: response.message }
}
