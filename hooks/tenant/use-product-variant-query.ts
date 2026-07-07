import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createProductVariant,
  deleteProductVariant,
  generateProductVariants,
  syncProductBundleItems,
  syncProductDownloads,
  syncProductOptions,
  syncProductRelations,
  syncProductService,
  syncProductSubscription,
  syncProductSuppliers,
  updateProductVariant,
} from "@/lib/services/tenant/product-service"
import {
  type GenerateProductVariantsFormValues,
  type StoreProductVariantFormValues,
  type SyncProductBundleItemsFormValues,
  type SyncProductDownloadsFormValues,
  type SyncProductOptionsFormValues,
  type SyncProductRelationsFormValues,
  type SyncProductServiceFormValues,
  type SyncProductSubscriptionFormValues,
  type SyncProductSuppliersFormValues,
  type UpdateProductVariantFormValues,
} from "@/schemas/tenant/product-schema"

function invalidateProductQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: number
) {
  queryClient.invalidateQueries({ queryKey: ["products"] })
  queryClient.invalidateQueries({ queryKey: ["products", productId] })
  queryClient.invalidateQueries({ queryKey: ["product-statistics"] })
}

export const useSyncProductOptions = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductOptionsFormValues) =>
      syncProductOptions(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductSuppliers = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductSuppliersFormValues) =>
      syncProductSuppliers(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductRelations = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductRelationsFormValues) =>
      syncProductRelations(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductDownloads = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductDownloadsFormValues) =>
      syncProductDownloads(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductBundleItems = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductBundleItemsFormValues) =>
      syncProductBundleItems(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductService = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductServiceFormValues) =>
      syncProductService(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useSyncProductSubscription = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SyncProductSubscriptionFormValues) =>
      syncProductSubscription(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useGenerateProductVariants = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GenerateProductVariantsFormValues) =>
      generateProductVariants(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useCreateProductVariant = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StoreProductVariantFormValues) =>
      createProductVariant(productId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useUpdateProductVariant = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      variantId,
      payload,
    }: {
      variantId: number
      payload: UpdateProductVariantFormValues
    }) => updateProductVariant(productId, variantId, payload),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}

export const useDeleteProductVariant = (productId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variantId: number) =>
      deleteProductVariant(productId, variantId),
    onSuccess: () => invalidateProductQueries(queryClient, productId),
  })
}
