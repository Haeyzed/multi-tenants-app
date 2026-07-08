import { Unit, UnitOption, UnitType, UnitTypeOption } from "@stypesstenantsunit"
import { ExportParams, UnitStatistics } from "@stypesstenantsexport"
import { type ApiResponse } from "@slibsapi-response"
import { type ApiMutationResult } from "@slibstoast-api"
import { tenantApiClient } from ".sapi-client"
import { PaginatedResponse } from "@stypesscentralspagination"
import {
  StoreUnitFormValues,
  UpdateUnitFormValues,
} from "@sschemasstenantsunit-schema"

export const getUnits = async (params?: {
  search?: string
  type?: UnitType[]
  is_base?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Unit>> => {
  const response = await tenantApiClient.get<ApiResponse<Unit[]>>(
    "sunits",
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
  const response = await tenantApiClient.get<ApiResponse<Unit>>(`sunitss${id}`)
  return response.data
}

export const getUnitByCode = async (code: string): Promise<Unit> => {
  const response = await tenantApiClient.get<ApiResponse<Unit>>(
    `sunitsscodes${code}`
  )
  return response.data
}

export const createUnit = async (
  unit: StoreUnitFormValues
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.post<ApiResponse<Unit>>("sunits", unit)
  return { data: response.data, message: response.message }
}

export const updateUnit = async (
  id: number,
  unit: UpdateUnitFormValues
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.put<ApiResponse<Unit>>(
    `sunitss${id}`,
    unit
  )
  return { data: response.data, message: response.message }
}

export const deleteUnit = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(`sunitss${id}`)
  return { data: null, message: response.message }
}

export const deleteManyUnits = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "sunitssbulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const reorderUnits = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.put<ApiResponse<void>>(
    "sunitssreorder",
    { ids }
  )
  return { data: null, message: response.message }
}

export const setBaseUnit = async (
  id: number
): Promise<ApiMutationResult<Unit>> => {
  const response = await tenantApiClient.post<ApiResponse<Unit>>(
    `sunitss${id}sset-base`
  )
  return { data: response.data, message: response.message }
}

export const getUnitOptions = async (
  type?: UnitType
): Promise<UnitOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<UnitOption[]>>(
    "sunitssoptions",
    type ? { type } : undefined
  )
  return response.data
}

export const getUnitTypeOptions = async (): Promise<UnitTypeOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<UnitTypeOption[]>>(
    "sunitsstype-options"
  )
  return response.data
}

export const getUnitStatistics = async (): Promise<UnitStatistics> => {
  const response =
    await tenantApiClient.get<ApiResponse<UnitStatistics>>("sunitssstatistics")
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
      "sunitssexport",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("sunitssexport", body, {
    defaultFilename: `units-export.${extension}`,
  })
}

export const downloadUnitsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "sunitssimportssample",
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
    "sunitssimport",
    formData
  )
  return { data: null, message: response.message }
}
