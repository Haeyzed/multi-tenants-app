import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAttributeSet,
  deleteAttributeSet,
  deleteManyAttributeSets,
  exportAttributeSets,
  getAttributeSetAttributes,
  getAttributeSetOptions,
  getAttributeSets,
  getAttributeSetStatistics,
  importAttributeSets,
  syncAttributeSetAttributes,
  updateAttributeSet,
} from "@/lib/services/tenant/attribute-set-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreAttributeSetFormValues,
  UpdateAttributeSetFormValues,
} from "@/schemas/tenant/attribute-set-schema"

export const useGetAttributeSets = (params?: {
  search?: string
  is_active?: boolean
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["attribute-sets", params],
    queryFn: () => getAttributeSets(params),
  })
}

export const useGetAttributeSetStatistics = () => {
  return useQuery({
    queryKey: ["attribute-set-statistics"],
    queryFn: () => getAttributeSetStatistics(),
  })
}

export const useCreateAttributeSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attributeSet: StoreAttributeSetFormValues) =>
      createAttributeSet(attributeSet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-set-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attributeSetOptions"] })
    },
  })
}

export const useUpdateAttributeSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      attributeSet,
    }: {
      id: number
      attributeSet: UpdateAttributeSetFormValues
    }) => updateAttributeSet(id, attributeSet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-set-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attributeSetOptions"] })
    },
  })
}

export const useDeleteAttributeSet = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAttributeSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-set-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attributeSetOptions"] })
    },
  })
}

export const useGetAttributeSetOptions = () => {
  return useQuery({
    queryKey: ["attributeSetOptions"],
    queryFn: () => getAttributeSetOptions(),
  })
}

export const useDeleteManyAttributeSets = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyAttributeSets(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-set-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attributeSetOptions"] })
    },
  })
}

export const useExportAttributeSets = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportAttributeSets(params),
  })
}

export const useImportAttributeSets = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importAttributeSets(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-set-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attributeSetOptions"] })
    },
  })
}

export const useGetAttributeSetAttributes = (
  attributeSetId?: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["attribute-set-attributes", attributeSetId],
    queryFn: () => getAttributeSetAttributes(attributeSetId!),
    enabled: !!attributeSetId && enabled,
  })
}

export const useSyncAttributeSetAttributes = (attributeSetId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attributeIds: number[]) =>
      syncAttributeSetAttributes(attributeSetId, attributeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attribute-set-attributes", attributeSetId],
      })
      queryClient.invalidateQueries({ queryKey: ["attribute-sets"] })
    },
  })
}
