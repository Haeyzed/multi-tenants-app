import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createUnit,
  deleteManyUnits,
  deleteUnit,
  exportUnits,
  getUnitOptions,
  getUnits,
  getUnitStatistics,
  getUnitTypeOptions,
  importUnits,
  reorderUnits,
  setBaseUnit,
  updateUnit,
} from "@/lib/services/tenant/unit-service"
import { type ExportParams } from "@/types/tenant/export"
import { type UnitType } from "@/types/tenant/unit"
import {
  StoreUnitFormValues,
  UpdateUnitFormValues,
} from "@/schemas/tenant/unit-schema"

export const useGetUnits = (params?: {
  search?: string
  type?: UnitType[]
  is_base?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["units", params],
    queryFn: () => getUnits(params),
  })
}

export const useGetUnitStatistics = () => {
  return useQuery({
    queryKey: ["unit-statistics"],
    queryFn: () => getUnitStatistics(),
  })
}

export const useCreateUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (unit: StoreUnitFormValues) => createUnit(unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useUpdateUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, unit }: { id: number; unit: UpdateUnitFormValues }) =>
      updateUnit(id, unit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useDeleteUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useDeleteManyUnits = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyUnits(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useGetUnitOptions = (type?: UnitType) => {
  return useQuery({
    queryKey: ["unitOptions", type],
    queryFn: () => getUnitOptions(type),
  })
}

export const useGetUnitTypeOptions = () => {
  return useQuery({
    queryKey: ["unitTypeOptions"],
    queryFn: () => getUnitTypeOptions(),
  })
}

export const useSetBaseUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => setBaseUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useExportUnits = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportUnits(params),
  })
}

export const useImportUnits = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importUnits(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
      queryClient.invalidateQueries({ queryKey: ["unit-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["unitOptions"] })
    },
  })
}

export const useReorderUnits = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => reorderUnits(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] })
    },
  })
}
