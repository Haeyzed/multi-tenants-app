import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTaxRate,
  deleteManyTaxRates,
  deleteTaxRate,
  exportTaxRates,
  getTaxRateOptions,
  getTaxRates,
  getTaxRateStatistics,
  importTaxRates,
  restoreManyTaxRates,
  restoreTaxRate,
  toggleTaxRateActive,
  updateTaxRate,
} from "@/lib/services/tenant/tax-rate-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreTaxRateFormValues,
  UpdateTaxRateFormValues,
} from "@/schemas/tenant/tax-rate-schema"

export const useGetTaxRates = (params?: {
  search?: string
  tax_class_id?: number
  tax_zone_id?: number
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["tax-rates", params],
    queryFn: () => getTaxRates(params),
  })
}

export const useGetTaxRateStatistics = () => {
  return useQuery({
    queryKey: ["tax-rate-statistics"],
    queryFn: () => getTaxRateStatistics(),
  })
}

export const useCreateTaxRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taxRate: StoreTaxRateFormValues) => createTaxRate(taxRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-zones"] })
    },
  })
}

export const useUpdateTaxRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      taxRate,
    }: {
      id: number
      taxRate: UpdateTaxRateFormValues
    }) => updateTaxRate(id, taxRate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useDeleteTaxRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTaxRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useDeleteManyTaxRates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyTaxRates(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useToggleTaxRateActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleTaxRateActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useGetTaxRateOptions = () => {
  return useQuery({
    queryKey: ["taxRateOptions"],
    queryFn: () => getTaxRateOptions(),
  })
}

export const useExportTaxRates = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTaxRates(params),
  })
}

export const useImportTaxRates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importTaxRates(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useRestoreTaxRate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => restoreTaxRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}

export const useRestoreManyTaxRates = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => restoreManyTaxRates(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rates"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rate-statistics"] })
    },
  })
}
