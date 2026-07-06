import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  adjustInventory,
  getInventories,
  getInventoryMovements,
  getInventoryStatistics,
  getStockAlerts,
  getVariantInventories,
  transferInventory,
  updateInventory,
} from "@/lib/services/tenant/inventory-service"

export const useGetInventories = (params?: {
  search?: string
  product_id?: number
  product_variant_id?: number
  warehouse_id?: number
  low_stock?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["inventories", params],
    queryFn: () => getInventories(params),
  })
}

export const useGetVariantInventories = (
  productId: number,
  variantId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["variant-inventories", productId, variantId],
    queryFn: () => getVariantInventories(productId, variantId),
    enabled: enabled && !!productId && !!variantId,
  })
}

export const useGetInventoryMovements = (
  params?: {
    inventory_id?: number
    product_variant_id?: number
    type?: string
    per_page?: number
    page?: number
  },
  enabled = true
) => {
  return useQuery({
    queryKey: ["inventory-movements", params],
    queryFn: () => getInventoryMovements(params),
    enabled,
  })
}

export const useGetInventoryStatistics = () => {
  return useQuery({
    queryKey: ["inventory-statistics"],
    queryFn: () => getInventoryStatistics(),
  })
}

export const useGetStockAlerts = (params?: {
  search?: string
  product_variant_id?: number
  is_notified?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["stock-alerts", params],
    queryFn: () => getStockAlerts(params),
  })
}

export const useUpdateInventory = (productId: number, variantId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof updateInventory>[1]
    }) => updateInventory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variant-inventories", productId, variantId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-statistics"] })
    },
  })
}

export const useAdjustInventory = (productId: number, variantId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof adjustInventory>[1]
    }) => adjustInventory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variant-inventories", productId, variantId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-statistics"] })
    },
  })
}

export const useTransferInventory = (productId: number, variantId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof transferInventory>[1]
    }) => transferInventory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["variant-inventories", productId, variantId],
      })
      queryClient.invalidateQueries({ queryKey: ["products", productId] })
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] })
      queryClient.invalidateQueries({ queryKey: ["inventory-statistics"] })
    },
  })
}
