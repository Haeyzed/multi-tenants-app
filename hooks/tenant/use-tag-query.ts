import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTag,
  deleteManyTags,
  deleteTag,
  exportTags,
  getTagOptions,
  getTags,
  getTagStatistics,
  importTags,
  toggleTagVisibility,
  updateTag,
} from "@/lib/services/tenant/tag-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreTagFormValues,
  UpdateTagFormValues,
} from "@/schemas/tenant/tag-schema"

export const useGetTags = (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => getTags(params),
  })
}

export const useGetTagStatistics = () => {
  return useQuery({
    queryKey: ["tag-statistics"],
    queryFn: () => getTagStatistics(),
  })
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tag: StoreTagFormValues) => createTag(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, tag }: { id: number; tag: UpdateTagFormValues }) =>
      updateTag(id, tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}

export const useGetTagOptions = () => {
  return useQuery({
    queryKey: ["tag-option"],
    queryFn: () => getTagOptions(),
  })
}

export const useDeleteManyTags = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyTags(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}

export const useExportTags = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTags(params),
  })
}

export const useImportTags = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importTags(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}

export const useToggleTagVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleTagVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] })
      queryClient.invalidateQueries({ queryKey: ["tag-statistics"] })
    },
  })
}
