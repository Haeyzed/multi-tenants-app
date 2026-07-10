import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProductLabel,
  deleteManyProductLabels,
  deleteProductLabel,
  exportProductLabels,
  getProductLabelOptions,
  getProductLabels,
  getProductLabelStatistics,
  importProductLabels,
  toggleProductLabelActive,
  updateProductLabel,
} from "@/lib/services/tenant/product-label-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreProductLabelFormValues,
  UpdateProductLabelFormValues,
} from "@/schemas/tenant/product-label-schema"

export const useGetProductLabels = (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["product-labels", params],
    queryFn: () => getProductLabels(params),
  })
}

export const useGetProductLabelStatistics = () => {
  return useQuery({
    queryKey: ["product-label-statistics"],
    queryFn: () => getProductLabelStatistics(),
  })
}

export const useCreateProductLabel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (label: StoreProductLabelFormValues) =>
      createProductLabel(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}

export const useUpdateProductLabel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      label,
    }: {
      id: number
      label: UpdateProductLabelFormValues
    }) => updateProductLabel(id, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}

export const useDeleteProductLabel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProductLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}

export const useGetProductLabelOptions = () => {
  return useQuery({
    queryKey: ["product-label-option"],
    queryFn: () => getProductLabelOptions(),
  })
}

export const useDeleteManyProductLabels = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyProductLabels(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}

export const useExportProductLabels = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportProductLabels(params),
  })
}

export const useImportProductLabels = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importProductLabels(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}

export const useToggleProductLabelActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleProductLabelActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-labels"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["product-label-options"] })
    },
  })
}
