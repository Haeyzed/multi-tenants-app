import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTaxClass,
  deleteManyTaxClasses,
  deleteTaxClass,
  exportTaxClasses,
  getTaxClasses,
  getTaxClassOptions,
  getTaxClassStatistics,
  importTaxClasses,
  reorderTaxClasses,
  restoreManyTaxClasses,
  restoreTaxClass,
  setDefaultTaxClass,
  toggleTaxClassActive,
  updateTaxClass,
} from "@/lib/services/tenant/tax-class-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreTaxClassFormValues,
  UpdateTaxClassFormValues,
} from "@/schemas/tenant/tax-class-schema"

export const useGetTaxClasses = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  is_default?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["tax-classes", params],
    queryFn: () => getTaxClasses(params),
  })
}

export const useGetTaxClassStatistics = () => {
  return useQuery({
    queryKey: ["tax-class-statistics"],
    queryFn: () => getTaxClassStatistics(),
  })
}

export const useCreateTaxClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taxClass: StoreTaxClassFormValues) => createTaxClass(taxClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useUpdateTaxClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      taxClass,
    }: {
      id: number
      taxClass: UpdateTaxClassFormValues
    }) => updateTaxClass(id, taxClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useDeleteTaxClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTaxClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useDeleteManyTaxClasses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyTaxClasses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useGetTaxClassOptions = () => {
  return useQuery({
    queryKey: ["taxClassOptions"],
    queryFn: () => getTaxClassOptions(),
  })
}

export const useToggleTaxClassActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleTaxClassActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
    },
  })
}

export const useSetDefaultTaxClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => setDefaultTaxClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
    },
  })
}

export const useExportTaxClasses = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTaxClasses(params),
  })
}

export const useImportTaxClasses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importTaxClasses(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useReorderTaxClasses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => reorderTaxClasses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
    },
  })
}

export const useRestoreTaxClass = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => restoreTaxClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}

export const useRestoreManyTaxClasses = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => restoreManyTaxClasses(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-classes"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["tax-class-options"] })
    },
  })
}
