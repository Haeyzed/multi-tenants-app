import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCollection,
  deleteCollection,
  deleteManyCollections,
  exportCollections,
  getCollectionOptions,
  getCollections,
  getCollectionStatistics,
  importCollections,
  toggleCollectionFeatured,
  toggleCollectionVisibility,
  updateCollection,
} from "@/lib/services/tenant/collection-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreCollectionFormValues,
  UpdateCollectionFormValues,
} from "@/schemas/tenant/collection-schema"

export const useGetCollections = (params?: {
  search?: string
  is_visible?: ("visible" | "hidden")[]
  is_featured?: boolean
  type?: string
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["collections", params],
    queryFn: () => getCollections(params),
  })
}

export const useGetCollectionStatistics = () => {
  return useQuery({
    queryKey: ["collection-statistics"],
    queryFn: () => getCollectionStatistics(),
  })
}

export const useCreateCollection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (collection: StoreCollectionFormValues) =>
      createCollection(collection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useUpdateCollection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      collection,
    }: {
      id: number
      collection: UpdateCollectionFormValues
    }) => updateCollection(id, collection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useDeleteCollection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useGetCollectionOptions = () => {
  return useQuery({
    queryKey: ["collectionOptions"],
    queryFn: () => getCollectionOptions(),
  })
}

export const useDeleteManyCollections = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyCollections(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useExportCollections = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportCollections(params),
  })
}

export const useImportCollections = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCollections(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useToggleCollectionVisibility = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleCollectionVisibility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}

export const useToggleCollectionFeatured = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleCollectionFeatured(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] })
      queryClient.invalidateQueries({ queryKey: ["collection-statistics"] })
    },
  })
}
