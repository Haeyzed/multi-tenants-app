import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTaxZone,
  deleteManyTaxZones,
  deleteTaxZone,
  exportTaxZones,
  getTaxZoneOptions,
  getTaxZones,
  getTaxZoneStatistics,
  importTaxZones,
  reorderTaxZones,
  restoreManyTaxZones,
  restoreTaxZone,
  setDefaultTaxZone,
  toggleTaxZoneActive,
  updateTaxZone,
} from "@/lib/services/tenant/tax-zone-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreTaxZoneFormValues,
  UpdateTaxZoneFormValues,
} from "@/schemas/tenant/tax-zone-schema"

export const useGetTaxZones = (params?: {
  search?: string
  country_code?: string
  is_active?: ("active" | "inactive")[]
  is_default?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["tax-zones", params],
    queryFn: () => getTaxZones(params),
  })
}

export const useGetTaxZoneStatistics = () => {
  return useQuery({
    queryKey: ["tax-zone-statistics"],
    queryFn: () => getTaxZoneStatistics(),
  })
}

export const useCreateTaxZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taxZone: StoreTaxZoneFormValues) => createTaxZone(taxZone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useUpdateTaxZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      taxZone,
    }: {
      id: number
      taxZone: UpdateTaxZoneFormValues
    }) => updateTaxZone(id, taxZone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useDeleteTaxZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTaxZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useDeleteManyTaxZones = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyTaxZones(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useGetTaxZoneOptions = () => {
  return useQuery({
    queryKey: ["taxZoneOptions"],
    queryFn: () => getTaxZoneOptions(),
  })
}

export const useToggleTaxZoneActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleTaxZoneActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
    },
  })
}

export const useSetDefaultTaxZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => setDefaultTaxZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
    },
  })
}

export const useExportTaxZones = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTaxZones(params),
  })
}

export const useImportTaxZones = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importTaxZones(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useReorderTaxZones = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => reorderTaxZones(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
    },
  })
}

export const useRestoreTaxZone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => restoreTaxZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}

export const useRestoreManyTaxZones = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => restoreManyTaxZones(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zone-options"] })
    },
  })
}
