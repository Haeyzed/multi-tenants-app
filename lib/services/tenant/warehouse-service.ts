import {
  Warehouse,
  WarehouseLocation,
  WarehouseOption,
  WarehouseZone,
} from "@/types/tenant/warehouse"
import {
  ExportParams,
  ImportSummary,
  WarehouseStatistics,
} from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreWarehouseFormValues,
  StoreWarehouseLocationFormValues,
  StoreWarehouseZoneFormValues,
  UpdateWarehouseFormValues,
  UpdateWarehouseLocationFormValues,
  UpdateWarehouseZoneFormValues,
} from "@/schemas/tenant/warehouse-schema"

export const getWarehouses = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  country?: string
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Warehouse>> => {
  const response = await tenantApiClient.get<ApiResponse<Warehouse[]>>(
    "/warehouses",
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

export const getWarehouse = async (id: number): Promise<Warehouse> => {
  const response = await tenantApiClient.get<ApiResponse<Warehouse>>(
    `/warehouses/${id}`
  )
  return response.data
}

export const createWarehouse = async (
  warehouse: StoreWarehouseFormValues
): Promise<ApiMutationResult<Warehouse>> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    "/warehouses",
    warehouse
  )
  return { data: response.data, message: response.message }
}

export const updateWarehouse = async (
  id: number,
  warehouse: UpdateWarehouseFormValues
): Promise<ApiMutationResult<Warehouse>> => {
  const response = await tenantApiClient.put<ApiResponse<Warehouse>>(
    `/warehouses/${id}`,
    warehouse
  )
  return { data: response.data, message: response.message }
}

export const deleteWarehouse = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/warehouses/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyWarehouses = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/warehouses/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const exportWarehouses = async (
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
      "/warehouses/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/warehouses/export", body, {
    defaultFilename: `warehouses-export.${extension}`,
  })
}

export const downloadWarehousesImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/warehouses/import/sample",
    { type },
    `warehouses-import-sample.${type}`
  )
}

export const importWarehouses = async (
  file: File
): Promise<ApiMutationResult<ImportSummary>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/warehouses/import",
    formData
  )

  return {
    data: response.data,
    message: response.message,
  }
}

export const toggleWarehouseActive = async (
  id: number
): Promise<ApiMutationResult<Warehouse>> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    `/warehouses/${id}/toggle-active`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const setWarehousePrimary = async (
  id: number
): Promise<ApiMutationResult<Warehouse>> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    `/warehouses/${id}/set-primary`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getWarehouseOptions = async (): Promise<WarehouseOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<WarehouseOption[]>>(
    "/warehouses/options"
  )
  return response.data
}

export const getPrimaryWarehouse = async (): Promise<Warehouse | null> => {
  const response = await tenantApiClient.get<ApiResponse<Warehouse | null>>(
    "/warehouses/primary"
  )
  return response.data
}

export const getWarehouseStatistics =
  async (): Promise<WarehouseStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<WarehouseStatistics>
    >("/warehouses/statistics")
    return response.data
  }

// Zones

export const getWarehouseZones = async (
  warehouseId: number
): Promise<WarehouseZone[]> => {
  const response = await tenantApiClient.get<ApiResponse<WarehouseZone[]>>(
    `/warehouses/${warehouseId}/zones`
  )
  return response.data
}

export const createWarehouseZone = async (
  warehouseId: number,
  zone: StoreWarehouseZoneFormValues
): Promise<ApiMutationResult<WarehouseZone>> => {
  const response = await tenantApiClient.post<ApiResponse<WarehouseZone>>(
    `/warehouses/${warehouseId}/zones`,
    zone
  )
  return { data: response.data, message: response.message }
}

export const updateWarehouseZone = async (
  warehouseId: number,
  zoneId: number,
  zone: UpdateWarehouseZoneFormValues
): Promise<ApiMutationResult<WarehouseZone>> => {
  const response = await tenantApiClient.put<ApiResponse<WarehouseZone>>(
    `/warehouses/${warehouseId}/zones/${zoneId}`,
    zone
  )
  return { data: response.data, message: response.message }
}

export const deleteWarehouseZone = async (
  warehouseId: number,
  zoneId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/warehouses/${warehouseId}/zones/${zoneId}`
  )
  return { data: null, message: response.message }
}

// Locations

export const getWarehouseLocations = async (
  warehouseId: number
): Promise<WarehouseLocation[]> => {
  const response = await tenantApiClient.get<ApiResponse<WarehouseLocation[]>>(
    `/warehouses/${warehouseId}/locations`
  )
  return response.data
}

export const createWarehouseLocation = async (
  warehouseId: number,
  location: StoreWarehouseLocationFormValues
): Promise<ApiMutationResult<WarehouseLocation>> => {
  const response = await tenantApiClient.post<ApiResponse<WarehouseLocation>>(
    `/warehouses/${warehouseId}/locations`,
    location
  )
  return { data: response.data, message: response.message }
}

export const updateWarehouseLocation = async (
  warehouseId: number,
  locationId: number,
  location: UpdateWarehouseLocationFormValues
): Promise<ApiMutationResult<WarehouseLocation>> => {
  const response = await tenantApiClient.put<ApiResponse<WarehouseLocation>>(
    `/warehouses/${warehouseId}/locations/${locationId}`,
    location
  )
  return { data: response.data, message: response.message }
}

export const deleteWarehouseLocation = async (
  warehouseId: number,
  locationId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/warehouses/${warehouseId}/locations/${locationId}`
  )
  return { data: null, message: response.message }
}
