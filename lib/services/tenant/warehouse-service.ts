import {
  Warehouse,
  WarehouseLocation,
  WarehouseOption,
  WarehouseZone,
} from "@/types/tenant/warehouse"
import { WarehouseStatistics, ExportParams, ImportSummary } from "@/types/tenant/export"
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
): Promise<Warehouse> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    "/warehouses",
    warehouse
  )
  return response.data
}

export const updateWarehouse = async (
  id: number,
  warehouse: UpdateWarehouseFormValues
): Promise<Warehouse> => {
  const response = await tenantApiClient.put<ApiResponse<Warehouse>>(
    `/warehouses/${id}`,
    warehouse
  )
  return response.data
}

export const deleteWarehouse = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/warehouses/${id}`)
}

export const deleteManyWarehouses = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/warehouses/bulk", { ids })
}

export const exportWarehouses = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/warehouses/export", body)
    return
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
): Promise<{ summary: ImportSummary; message: string }> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/warehouses/import",
    formData
  )

  return {
    summary: response.data,
    message: response.message,
  }
}

export const toggleWarehouseActive = async (id: number): Promise<Warehouse> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    `/warehouses/${id}/toggle-active`,
    {}
  )
  return response.data
}

export const setWarehousePrimary = async (id: number): Promise<Warehouse> => {
  const response = await tenantApiClient.post<ApiResponse<Warehouse>>(
    `/warehouses/${id}/set-primary`,
    {}
  )
  return response.data
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

export const getWarehouseStatistics = async (): Promise<WarehouseStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<WarehouseStatistics>>(
    "/warehouses/statistics"
  )
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
): Promise<WarehouseZone> => {
  const response = await tenantApiClient.post<ApiResponse<WarehouseZone>>(
    `/warehouses/${warehouseId}/zones`,
    zone
  )
  return response.data
}

export const updateWarehouseZone = async (
  warehouseId: number,
  zoneId: number,
  zone: UpdateWarehouseZoneFormValues
): Promise<WarehouseZone> => {
  const response = await tenantApiClient.put<ApiResponse<WarehouseZone>>(
    `/warehouses/${warehouseId}/zones/${zoneId}`,
    zone
  )
  return response.data
}

export const deleteWarehouseZone = async (
  warehouseId: number,
  zoneId: number
): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(
    `/warehouses/${warehouseId}/zones/${zoneId}`
  )
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
): Promise<WarehouseLocation> => {
  const response = await tenantApiClient.post<ApiResponse<WarehouseLocation>>(
    `/warehouses/${warehouseId}/locations`,
    location
  )
  return response.data
}

export const updateWarehouseLocation = async (
  warehouseId: number,
  locationId: number,
  location: UpdateWarehouseLocationFormValues
): Promise<WarehouseLocation> => {
  const response = await tenantApiClient.put<ApiResponse<WarehouseLocation>>(
    `/warehouses/${warehouseId}/locations/${locationId}`,
    location
  )
  return response.data
}

export const deleteWarehouseLocation = async (
  warehouseId: number,
  locationId: number
): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(
    `/warehouses/${warehouseId}/locations/${locationId}`
  )
}
