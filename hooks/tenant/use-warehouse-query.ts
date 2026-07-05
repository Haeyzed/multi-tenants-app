import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createWarehouse,
  createWarehouseLocation,
  createWarehouseZone,
  deleteManyWarehouses,
  deleteWarehouse,
  deleteWarehouseLocation,
  deleteWarehouseZone,
  exportWarehouses,
  getPrimaryWarehouse,
  getWarehouseLocations,
  getWarehouseOptions,
  getWarehouses,
  getWarehouseStatistics,
  getWarehouseZones,
  importWarehouses,
  setWarehousePrimary,
  toggleWarehouseActive,
  updateWarehouse,
  updateWarehouseLocation,
  updateWarehouseZone,
} from "@/lib/services/tenant/warehouse-service"
import {
  StoreWarehouseFormValues,
  StoreWarehouseLocationFormValues,
  StoreWarehouseZoneFormValues,
  UpdateWarehouseFormValues,
  UpdateWarehouseLocationFormValues,
  UpdateWarehouseZoneFormValues,
} from "@/schemas/tenant/warehouse-schema"
import { type ExportParams } from "@/types/tenant/export"

export const useGetWarehouses = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  country?: string
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
  })
}

export const useGetWarehouseStatistics = () => {
  return useQuery({
    queryKey: ["warehouse-statistics"],
    queryFn: () => getWarehouseStatistics(),
  })
}

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (warehouse: StoreWarehouseFormValues) => createWarehouse(warehouse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["warehouseOptions"] })
    },
  })
}

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      warehouse,
    }: {
      id: number
      warehouse: UpdateWarehouseFormValues
    }) => updateWarehouse(id, warehouse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["warehouseOptions"] })
    },
  })
}

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
    },
  })
}

export const useDeleteManyWarehouses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyWarehouses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
    },
  })
}

export const useExportWarehouses = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportWarehouses(params),
  })
}

export const useImportWarehouses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importWarehouses(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["warehouseOptions"] })
    },
  })
}

export const useToggleWarehouseActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleWarehouseActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
    },
  })
}

export const useSetWarehousePrimary = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => setWarehousePrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      queryClient.invalidateQueries({ queryKey: ["warehouse-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["warehouseOptions"] })
    },
  })
}

export const useGetWarehouseOptions = () => {
  return useQuery({
    queryKey: ["warehouseOptions"],
    queryFn: () => getWarehouseOptions(),
  })
}

export const useGetPrimaryWarehouse = () => {
  return useQuery({
    queryKey: ["primary-warehouse"],
    queryFn: () => getPrimaryWarehouse(),
  })
}

export const useGetWarehouseZones = (warehouseId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["warehouse-zones", warehouseId],
    queryFn: () => getWarehouseZones(warehouseId!),
    enabled: enabled && !!warehouseId,
  })
}

export const useCreateWarehouseZone = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (zone: StoreWarehouseZoneFormValues) =>
      createWarehouseZone(warehouseId, zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-zones", warehouseId] })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}

export const useUpdateWarehouseZone = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      zoneId,
      zone,
    }: {
      zoneId: number
      zone: UpdateWarehouseZoneFormValues
    }) => updateWarehouseZone(warehouseId, zoneId, zone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-zones", warehouseId] })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}

export const useDeleteWarehouseZone = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (zoneId: number) => deleteWarehouseZone(warehouseId, zoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-zones", warehouseId] })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}

export const useGetWarehouseLocations = (warehouseId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["warehouse-locations", warehouseId],
    queryFn: () => getWarehouseLocations(warehouseId!),
    enabled: enabled && !!warehouseId,
  })
}

export const useCreateWarehouseLocation = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (location: StoreWarehouseLocationFormValues) =>
      createWarehouseLocation(warehouseId, location),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-locations", warehouseId],
      })
      queryClient.invalidateQueries({ queryKey: ["warehouse-zones", warehouseId] })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}

export const useUpdateWarehouseLocation = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      locationId,
      location,
    }: {
      locationId: number
      location: UpdateWarehouseLocationFormValues
    }) => updateWarehouseLocation(warehouseId, locationId, location),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-locations", warehouseId],
      })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}

export const useDeleteWarehouseLocation = (warehouseId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (locationId: number) =>
      deleteWarehouseLocation(warehouseId, locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouse-locations", warehouseId],
      })
      queryClient.invalidateQueries({ queryKey: ["warehouse-zones", warehouseId] })
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    },
  })
}
