import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createAttribute,
  createAttributeValue,
  deleteAttribute,
  deleteAttributeValue,
  deleteManyAttributes,
  exportAttributes,
  getAttributeOptions,
  getAttributes,
  getAttributeStatistics,
  getAttributeValues,
  importAttributes,
  toggleAttributeFilterable,
  toggleAttributeVariant,
  updateAttribute,
  updateAttributeValue,
} from "@/lib/services/tenant/attribute-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreAttributeFormValues,
  StoreAttributeValueFormValues,
  UpdateAttributeFormValues,
  UpdateAttributeValueFormValues,
} from "@/schemas/tenant/attribute-schema"

export const useGetAttributes = (params?: {
  search?: string
  is_filterable?: boolean
  is_variant?: boolean
  type?: string
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["attributes", params],
    queryFn: () => getAttributes(params),
  })
}

export const useGetAttributeStatistics = () => {
  return useQuery({
    queryKey: ["attribute-statistics"],
    queryFn: () => getAttributeStatistics(),
  })
}

export const useCreateAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attribute: StoreAttributeFormValues) =>
      createAttribute(attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] })
    },
  })
}

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      attribute,
    }: {
      id: number
      attribute: UpdateAttributeFormValues
    }) => updateAttribute(id, attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] })
    },
  })
}

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] })
    },
  })
}

export const useGetAttributeOptions = () => {
  return useQuery({
    queryKey: ["attributeOptions"],
    queryFn: () => getAttributeOptions(),
  })
}

export const useDeleteManyAttributes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyAttributes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] })
    },
  })
}

export const useExportAttributes = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportAttributes(params),
  })
}

export const useImportAttributes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importAttributes(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-options"] })
    },
  })
}

export const useToggleAttributeFilterable = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleAttributeFilterable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
    },
  })
}

export const useToggleAttributeVariant = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleAttributeVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
      queryClient.invalidateQueries({ queryKey: ["attribute-statistics"] })
    },
  })
}

export const useGetAttributeValues = (attributeId?: number, enabled = true) => {
  return useQuery({
    queryKey: ["attribute-values", attributeId],
    queryFn: () => getAttributeValues(attributeId!),
    enabled: !!attributeId && enabled,
  })
}

export const useCreateAttributeValue = (attributeId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (value: StoreAttributeValueFormValues) =>
      createAttributeValue(attributeId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attribute-values", attributeId],
      })
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
    },
  })
}

export const useUpdateAttributeValue = (attributeId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      valueId,
      value,
    }: {
      valueId: number
      value: UpdateAttributeValueFormValues
    }) => updateAttributeValue(attributeId, valueId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attribute-values", attributeId],
      })
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
    },
  })
}

export const useDeleteAttributeValue = (attributeId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (valueId: number) => deleteAttributeValue(attributeId, valueId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attribute-values", attributeId],
      })
      queryClient.invalidateQueries({ queryKey: ["attributes"] })
    },
  })
}
