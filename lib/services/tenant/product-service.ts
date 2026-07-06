import {
  Product,
  ProductBundleItem,
  ProductDownload,
  ProductGenerationOption,
  ProductProviderAssignment,
  ProductServiceConfig,
  ProductStatistics,
  ProductSubscriptionConfig,
  ProductSupplierAssignment,
  ProductTypeValue,
  ProductVariant,
  ProductVisibilityValue,
  resolveProductEnumValue,
} from "@/types/tenant/product"
import { ExportParams } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  GenerateProductVariantsFormValues,
  mapProductFormToApiPayload,
  ProductApiPayload,
  StoreProductFormValues,
  StoreProductVariantFormValues,
  SyncProductOptionsFormValues,
  SyncProductBundleItemsFormValues,
  SyncProductDownloadsFormValues,
  SyncProductRelationsFormValues,
  SyncProductServiceFormValues,
  SyncProductSubscriptionFormValues,
  SyncProductSuppliersFormValues,
  UpdateProductFormValues,
  UpdateProductVariantFormValues,
} from "@/schemas/tenant/product-schema"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginatedResponse<unknown>["meta"]
}

function normalizeVariantMedia(variant: Product["default_variant"]) {
  if (!variant?.image_media) {
    return variant
  }

  return {
    ...variant,
    image_media: {
      ...variant.image_media,
      url: resolveTenantMediaUrl(variant.image_media),
    },
  }
}

function normalizeProduct(product: Product): Product {
  const type = resolveProductEnumValue(product.type, "simple")
  const visibility = resolveProductEnumValue(product.visibility, "visible")
  const condition = resolveProductEnumValue(product.condition, "new")

  const apiImages = (
    product as Product & {
      images?: Product["gallery"]
    }
  ).images

  const gallery =
    product.gallery ??
    apiImages?.map((item) => ({
      id: item.id,
      media_id: item.media_id ?? item.media?.id ?? 0,
      sort_order: item.sort_order,
      alt_text: item.alt_text,
      caption: item.caption,
      is_primary: item.is_primary,
      media: item.media,
    }))

  const primaryImage =
    product.primary_image_media ??
    gallery?.find((item) => item.is_primary)?.media ??
    gallery?.[0]?.media ??
    null

  return {
    ...product,
    type,
    visibility,
    condition,
    default_variant: product.default_variant
      ? normalizeVariantMedia(product.default_variant) ?? undefined
      : undefined,
    variants: product.variants?.map(
      (variant) => normalizeVariantMedia(variant) as NonNullable<Product["variants"]>[number]
    ),
    primary_image_media: primaryImage
      ? {
          ...primaryImage,
          url: resolveTenantMediaUrl(primaryImage),
        }
      : null,
    gallery: gallery?.map((item) => ({
      ...item,
      media: item.media
        ? { ...item.media, url: resolveTenantMediaUrl(item.media) }
        : item.media,
    })),
  }
}

export const getProducts = async (params?: {
  search?: string
  status?: Product["status"][]
  visibility?: ProductVisibilityValue[]
  type?: ProductTypeValue[]
  is_featured?: ("featured" | "not_featured")[]
  brand_id?: number
  category_id?: number
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Product>> => {
  const response = await tenantApiClient.get<ApiResponse<Product[]>>(
    "/products",
    params
  )
  return {
    data: response.data.map(normalizeProduct),
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getProduct = async (id: number): Promise<Product> => {
  const response = await tenantApiClient.get<ApiResponse<Product>>(
    `/products/${id}`
  )
  return normalizeProduct(response.data)
}

export const createProduct = async (
  product: StoreProductFormValues
): Promise<Product> => {
  const payload = mapProductFormToApiPayload(product)
  const response = await tenantApiClient.post<ApiResponse<Product>>(
    "/products",
    payload
  )
  return normalizeProduct(response.data)
}

export const updateProduct = async (
  id: number,
  product: UpdateProductFormValues
): Promise<Product> => {
  const payload = mapProductFormToApiPayload(product)
  const response = await tenantApiClient.put<ApiResponse<Product>>(
    `/products/${id}`,
    payload
  )
  return normalizeProduct(response.data)
}

export const deleteProduct = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/products/${id}`)
}

export const deleteManyProducts = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/products/bulk", { ids })
}

export const getProductStatistics = async (): Promise<ProductStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<ProductStatistics>>(
    "/products/statistics"
  )
  return response.data
}

export const getProductOptions = async (): Promise<
  { label: string; value: number }[]
> => {
  const response = await tenantApiClient.get<
    ApiResponse<{ label: string; value: number }[]>
  >("/products/options")
  return response.data
}

export const exportProducts = async (params: ExportParams): Promise<void> => {
  const body = {
    ids: params.ids,
    delivery: params.delivery,
    type: params.type ?? "xlsx",
    start_date: params.start_date,
    end_date: params.end_date,
    recipient_id: params.recipient_id,
    columns: params.columns,
  }

  if (params.delivery === "email") {
    await tenantApiClient.post<ApiResponse<void>>("/products/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/products/export", body, {
    defaultFilename: `products-export.${extension}`,
  })
}

export const syncProductOptions = async (
  productId: number,
  payload: SyncProductOptionsFormValues
): Promise<ProductGenerationOption[]> => {
  const response = await tenantApiClient.put<ApiResponse<ProductGenerationOption[]>>(
    `/products/${productId}/options`,
    payload
  )
  return response.data
}

export const syncProductSuppliers = async (
  productId: number,
  payload: SyncProductSuppliersFormValues
): Promise<ProductSupplierAssignment[]> => {
  const response = await tenantApiClient.put<ApiResponse<ProductSupplierAssignment[]>>(
    `/products/${productId}/suppliers`,
    payload
  )
  return response.data
}

export const syncProductRelations = async (
  productId: number,
  payload: SyncProductRelationsFormValues
): Promise<SyncProductRelationsFormValues> => {
  const response = await tenantApiClient.put<ApiResponse<SyncProductRelationsFormValues>>(
    `/products/${productId}/relations`,
    payload
  )
  return response.data
}

export const syncProductDownloads = async (
  productId: number,
  payload: SyncProductDownloadsFormValues
): Promise<ProductDownload[]> => {
  const response = await tenantApiClient.put<ApiResponse<ProductDownload[]>>(
    `/products/${productId}/downloads`,
    payload
  )
  return response.data
}

export const syncProductBundleItems = async (
  productId: number,
  payload: SyncProductBundleItemsFormValues
): Promise<ProductBundleItem[]> => {
  const response = await tenantApiClient.put<ApiResponse<ProductBundleItem[]>>(
    `/products/${productId}/bundle-items`,
    payload
  )
  return response.data
}

export const syncProductService = async (
  productId: number,
  payload: SyncProductServiceFormValues
): Promise<{
  service: ProductServiceConfig
  providers: ProductProviderAssignment[]
}> => {
  const response = await tenantApiClient.put<
    ApiResponse<{
      service: ProductServiceConfig
      providers: ProductProviderAssignment[]
    }>
  >(`/products/${productId}/service`, payload)
  return response.data
}

export const syncProductSubscription = async (
  productId: number,
  payload: SyncProductSubscriptionFormValues
): Promise<ProductSubscriptionConfig> => {
  const response = await tenantApiClient.put<ApiResponse<ProductSubscriptionConfig>>(
    `/products/${productId}/subscription`,
    payload
  )
  return response.data
}

export const generateProductVariants = async (
  productId: number,
  payload: GenerateProductVariantsFormValues
): Promise<ProductVariant[]> => {
  const response = await tenantApiClient.post<ApiResponse<ProductVariant[]>>(
    `/products/${productId}/variants/generate`,
    payload
  )
  return response.data.map(
    (variant) => normalizeVariantMedia(variant) as ProductVariant
  )
}

export const createProductVariant = async (
  productId: number,
  payload: StoreProductVariantFormValues
): Promise<ProductVariant> => {
  const response = await tenantApiClient.post<ApiResponse<ProductVariant>>(
    `/products/${productId}/variants`,
    payload
  )
  return normalizeVariantMedia(response.data) as ProductVariant
}

export const updateProductVariant = async (
  productId: number,
  variantId: number,
  payload: UpdateProductVariantFormValues
): Promise<ProductVariant> => {
  const response = await tenantApiClient.put<ApiResponse<ProductVariant>>(
    `/products/${productId}/variants/${variantId}`,
    payload
  )
  return normalizeVariantMedia(response.data) as ProductVariant
}

export const deleteProductVariant = async (
  productId: number,
  variantId: number
): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(
    `/products/${productId}/variants/${variantId}`
  )
}

export type { ProductApiPayload }
