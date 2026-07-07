import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProduct,
  deleteManyProducts,
  deleteProduct,
  exportProducts,
  bulkUpdateProducts,
  getProduct,
  getProductOptions,
  getProducts,
  getProductStatistics,
  importProducts,
  updateProduct,
} from "@/lib/services/tenant/product-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  type ProductStatus,
  type ProductTypeValue,
  type ProductVisibilityValue,
} from "@/types/tenant/product"
import {
  type StoreProductFormValues,
  type UpdateProductFormValues,
} from "@/schemas/tenant/product-schema"

export const useGetProducts = (params?: {
  search?: string
  status?: ProductStatus[]
  visibility?: ProductVisibilityValue[]
  type?: ProductTypeValue[]
  is_featured?: ("featured" | "not_featured")[]
  brand_id?: number
  category_id?: number
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  })
}

export const useGetProduct = (id?: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProduct(id!),
    enabled: !!id,
  })
}

export const useGetProductStatistics = () => {
  return useQuery({
    queryKey: ["product-statistics"],
    queryFn: () => getProductStatistics(),
  })
}

export const useGetProductOptions = () => {
  return useQuery({
    queryKey: ["productOptions"],
    queryFn: () => getProductOptions(),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (product: StoreProductFormValues) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["productOptions"] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      product,
    }: {
      id: number
      product: UpdateProductFormValues
    }) => updateProduct(id, product),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["productOptions"] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["productOptions"] })
    },
  })
}

export const useDeleteManyProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyProducts(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["productOptions"] })
    },
  })
}

export const useExportProducts = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportProducts(params),
  })
}

export const useImportProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importProducts(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["productOptions"] })
    },
  })
}

export const useBulkUpdateProducts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      ids: number[]
      status?: ProductStatus
      visibility?: ProductVisibilityValue
    }) => bulkUpdateProducts(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
    },
  })
}
