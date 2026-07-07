import {
  InventoryMovement,
  InventoryRecord,
  InventoryStatistics,
  ProductStockAlert,
} from "@/types/tenant/inventory"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginatedResponse<unknown>["meta"]
}

export const getInventories = async (params?: {
  search?: string
  product_id?: number
  product_variant_id?: number
  warehouse_id?: number
  low_stock?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<InventoryRecord>> => {
  const response = await tenantApiClient.get<ApiResponse<InventoryRecord[]>>(
    "/inventories",
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

export const getInventory = async (id: number): Promise<InventoryRecord> => {
  const response = await tenantApiClient.get<ApiResponse<InventoryRecord>>(
    `/inventories/${id}`
  )
  return response.data
}

export const getVariantInventories = async (
  productId: number,
  variantId: number
): Promise<InventoryRecord[]> => {
  const response = await tenantApiClient.get<ApiResponse<InventoryRecord[]>>(
    `/products/${productId}/variants/${variantId}/inventories`
  )
  return response.data
}

export const updateInventory = async (
  id: number,
  payload: {
    reorder_level?: number | null
    reorder_quantity?: number | null
    incoming_quantity?: number
    damaged_quantity?: number
    location_code?: string | null
    batch_number?: string | null
    expiry_date?: string | null
  }
): Promise<InventoryRecord> => {
  const response = await tenantApiClient.put<ApiResponse<InventoryRecord>>(
    `/inventories/${id}`,
    payload
  )
  return response.data
}

export const adjustInventory = async (
  id: number,
  payload: {
    quantity_change: number
    type?: string
    reason?: string | null
  }
): Promise<InventoryRecord> => {
  const response = await tenantApiClient.post<ApiResponse<InventoryRecord>>(
    `/inventories/${id}/adjust`,
    payload
  )
  return response.data
}

export const transferInventory = async (
  id: number,
  payload: {
    destination_warehouse_id: number
    quantity: number
    reason?: string | null
  }
): Promise<{ source: InventoryRecord; destination: InventoryRecord }> => {
  const response = await tenantApiClient.post<
    ApiResponse<{ source: InventoryRecord; destination: InventoryRecord }>
  >(`/inventories/${id}/transfer`, payload)
  return response.data
}

export const getInventoryMovements = async (params?: {
  inventory_id?: number
  product_variant_id?: number
  type?: string
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<InventoryMovement>> => {
  const response = await tenantApiClient.get<ApiResponse<InventoryMovement[]>>(
    "/inventories/movements",
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

export const getInventoryStatistics =
  async (): Promise<InventoryStatistics> => {
    const response = await tenantApiClient.get<
      ApiResponse<InventoryStatistics>
    >("/inventories/statistics")
    return response.data
  }

export const getStockAlerts = async (params?: {
  search?: string
  product_variant_id?: number
  is_notified?: boolean
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<ProductStockAlert>> => {
  const response = await tenantApiClient.get<ApiResponse<ProductStockAlert[]>>(
    "/inventories/stock-alerts",
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
