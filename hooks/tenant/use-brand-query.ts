import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createBrand,
  deleteManyBrands,
  deleteBrand,
  exportBrands,
  getBrandOptions,
  getBrands,
  getBrandStatistics,
  importBrands,
  toggleBrandFeatured,
  toggleBrandVisibility,
  updateBrand,
} from "@/lib/services/tenant/brand-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreBrandFormValues,
  UpdateBrandFormValues,
} from "@/schemas/tenant/brand-schema"

export const useGetBrands = (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["brands", params],
    queryFn: () => getBrands(params),
  })
}

export const useGetBrandStatistics = () => {
  return useQuery({
    queryKey: ["brand-statistics"],
    queryFn: () => getBrandStatistics(),
  })
}

export const useCreateBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (brand: StoreBrandFormValues) => createBrand(brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useUpdateBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, brand }: { id: number; brand: UpdateBrandFormValues }) =>
      updateBrand(id, brand),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useDeleteBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useGetBrandOptions = () => {
  return useQuery({
    queryKey: ["brandOptions"],
    queryFn: () => getBrandOptions(),
  })
}

export const useDeleteManyBrands = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyBrands(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useExportBrands = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportBrands(params),
  })
}

export const useImportBrands = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importBrands(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useToggleBrandVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleBrandVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}

export const useToggleBrandFeatured = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleBrandFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] })
      queryClient.invalidateQueries({ queryKey: ["brand-statistics"] })
    },
  })
}
