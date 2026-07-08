import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCategory,
  deleteCategory,
  deleteManyCategories,
  exportCategories,
  getCategories,
  getCategoryOptions,
  getCategoryStatistics,
  getCategoryTreeSelect,
  importCategories,
  toggleCategoryFeatured,
  toggleCategoryVisibility,
  updateCategory,
} from "@/lib/services/tenant/category-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreCategoryFormValues,
  UpdateCategoryFormValues,
} from "@/schemas/tenant/category-schema"

export const useGetCategories = (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
  })
}

export const useGetCategoryStatistics = () => {
  return useQuery({
    queryKey: ["category-statistics"],
    queryFn: () => getCategoryStatistics(),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (category: StoreCategoryFormValues) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["category-options"] })
      queryClient.invalidateQueries({ queryKey: ["categoryTreeSelect"] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      category,
    }: {
      id: number
      category: UpdateCategoryFormValues
    }) => updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["category-options"] })
      queryClient.invalidateQueries({ queryKey: ["categoryTreeSelect"] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["category-options"] })
      queryClient.invalidateQueries({ queryKey: ["categoryTreeSelect"] })
    },
  })
}

export const useGetCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: () => getCategoryOptions(),
  })
}

export const useGetCategoryTreeSelect = () => {
  return useQuery({
    queryKey: ["categoryTreeSelect"],
    queryFn: () => getCategoryTreeSelect(),
  })
}

export const useDeleteManyCategories = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["category-options"] })
      queryClient.invalidateQueries({ queryKey: ["categoryTreeSelect"] })
    },
  })
}

export const useExportCategories = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportCategories(params),
  })
}

export const useImportCategories = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCategories(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["category-options"] })
      queryClient.invalidateQueries({ queryKey: ["categoryTreeSelect"] })
    },
  })
}

export const useToggleCategoryVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleCategoryVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
    },
  })
}

export const useToggleCategoryFeatured = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleCategoryFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["category-statistics"] })
    },
  })
}
