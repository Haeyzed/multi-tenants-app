import {
  Product,
  ProductBundleItem,
  ProductDownload,
  ProductGenerationOption,
  ProductProviderAssignment,
  ProductRelationRef,
  ProductServiceConfig,
  ProductStatistics,
  ProductStatus,
  ProductSubscriptionConfig,
  ProductSupplierAssignment,
  ProductTypeValue,
  ProductVariant,
  ProductVisibilityValue,
  resolveProductEnumValue,
} from "@/types/tenant/product"
import { type ApiMutationResult } from "@/lib/toast-api"
import { ExportParams, ImportSummary } from "@/types/tenant/export"
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
import {
  type AnswerProductQuestionFormValues,
  type StoreProductDocumentFormValues,
  type StoreProductFaqFormValues,
  type UpdateProductDocumentFormValues,
  type UpdateProductFaqFormValues,
  type UpdateProductReviewFormValues,
  type ProductVideoFormValues,
} from "@/schemas/tenant/product-nested-schema"
import {
  type ProductDocument,
  type ProductFaq,
  type ProductQuestion,
  type ProductReview,
} from "@/types/tenant/product-nested"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginatedResponse<unknown>["meta"]
}

function normalizeVariantMedia(
  variant: ProductVariant | null | undefined
): ProductVariant | null | undefined {
  if (!variant) {
    return variant
  }

  const legacyImage = (variant as ProductVariant & { image?: Product["primary_image_media"] })
    .image
  const imageMedia = variant.image_media ?? legacyImage ?? null
  const imageMediaId = variant.image_media_id ?? imageMedia?.id ?? null

  if (!imageMedia) {
    return {
      ...variant,
      image_media_id: imageMediaId,
      image_media: null,
    }
  }

  return {
    ...variant,
    image_media_id: imageMediaId,
    image_media: {
      ...imageMedia,
      url: resolveTenantMediaUrl(imageMedia),
    },
  }
}

function normalizeProduct(product: Product): Product {
  const type = resolveProductEnumValue(product.type, "simple")
  const visibility = resolveProductEnumValue(product.visibility, "visible")
  const condition = resolveProductEnumValue(product.condition, "new")
  const status = resolveProductEnumValue(product.status, "draft")

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
    status,
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
    related_products: product.related_products?.map((related) =>
      normalizeRelatedProduct(related)
    ),
    cross_sell_products: product.cross_sell_products?.map((related) =>
      normalizeRelatedProduct(related)
    ),
    up_sell_products: product.up_sell_products?.map((related) =>
      normalizeRelatedProduct(related)
    ),
  }
}

function normalizeRelatedProduct(
  related: ProductRelationRef | Product
): ProductRelationRef {
  const item = related as Product
  const gallery = item.gallery
  const primaryImage =
    item.primary_image_media ??
    gallery?.find((entry) => entry.is_primary)?.media ??
    gallery?.[0]?.media ??
    null

  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sku: item.default_variant?.sku ?? null,
    primary_image_media: primaryImage
      ? { ...primaryImage, url: resolveTenantMediaUrl(primaryImage) }
      : null,
  }
}

export const getProducts = async (params?: {
  search?: string
  status?: ProductStatus[]
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
): Promise<ApiMutationResult<Product>> => {
  const payload = mapProductFormToApiPayload(product)
  const response = await tenantApiClient.post<ApiResponse<Product>>(
    "/products",
    payload
  )
  return {
    data: normalizeProduct(response.data),
    message: response.message,
  }
}

export const updateProduct = async (
  id: number,
  product: UpdateProductFormValues
): Promise<ApiMutationResult<Product>> => {
  const payload = mapProductFormToApiPayload(product)
  const response = await tenantApiClient.put<ApiResponse<Product>>(
    `/products/${id}`,
    payload
  )
  return {
    data: normalizeProduct(response.data),
    message: response.message,
  }
}

export const deleteProduct = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/products/${id}`)
}

export const deleteManyProducts = async (ids: number[]): Promise<{ message: string }> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>("/products/bulk", { ids })
  return { message: response.message }
}

export const bulkUpdateProducts = async (payload: {
  ids: number[]
  status?: ProductStatus
  visibility?: ProductVisibilityValue
}): Promise<{ message: string }> => {
  const response = await tenantApiClient.patch<ApiResponse<void>>("/products/bulk", payload)
  return { message: response.message }
}

export const getProductStatistics = async (): Promise<ProductStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<ProductStatistics>>(
    "/products/statistics"
  )
  return response.data
}

export const getProductOptions = async (): Promise<
  { label: string; value: number; image_url?: string | null }[]
> => {
  const response = await tenantApiClient.get<
    ApiResponse<{ label: string; value: number; image_url?: string | null }[]>
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

export const downloadProductsImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/products/import/sample",
    { type },
    `products-import-sample.${type}`
  )
}

export const importProducts = async (
  file: File
): Promise<{ summary: ImportSummary; message: string }> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/products/import",
    formData
  )

  return {
    summary: response.data,
    message: response.message,
  }
}

export const syncProductOptions = async (
  productId: number,
  payload: SyncProductOptionsFormValues
): Promise<ApiMutationResult<ProductGenerationOption[]>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductGenerationOption[]>>(
    `/products/${productId}/options`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const syncProductSuppliers = async (
  productId: number,
  payload: SyncProductSuppliersFormValues
): Promise<ApiMutationResult<ProductSupplierAssignment[]>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductSupplierAssignment[]>>(
    `/products/${productId}/suppliers`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const syncProductRelations = async (
  productId: number,
  payload: SyncProductRelationsFormValues
): Promise<ApiMutationResult<SyncProductRelationsFormValues>> => {
  const response = await tenantApiClient.put<ApiResponse<SyncProductRelationsFormValues>>(
    `/products/${productId}/relations`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const syncProductDownloads = async (
  productId: number,
  payload: SyncProductDownloadsFormValues
): Promise<ApiMutationResult<ProductDownload[]>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductDownload[]>>(
    `/products/${productId}/downloads`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const syncProductBundleItems = async (
  productId: number,
  payload: SyncProductBundleItemsFormValues
): Promise<ApiMutationResult<ProductBundleItem[]>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductBundleItem[]>>(
    `/products/${productId}/bundle-items`,
    payload
  )
  return { data: response.data, message: response.message }
}

export const syncProductService = async (
  productId: number,
  payload: SyncProductServiceFormValues
): Promise<
  ApiMutationResult<{
    service: ProductServiceConfig
    providers: ProductProviderAssignment[]
  }>
> => {
  const response = await tenantApiClient.put<
    ApiResponse<{
      service: ProductServiceConfig
      providers: ProductProviderAssignment[]
    }>
  >(`/products/${productId}/service`, payload)
  return { data: response.data, message: response.message }
}

export const syncProductSubscription = async (
  productId: number,
  payload: SyncProductSubscriptionFormValues
): Promise<ApiMutationResult<ProductSubscriptionConfig>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductSubscriptionConfig>>(
    `/products/${productId}/subscription`,
    payload
  )
  return { data: response.data, message: response.message }
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

export const duplicateProduct = async (
  productId: number
): Promise<ApiMutationResult<Product>> => {
  const response = await tenantApiClient.post<ApiResponse<Product>>(
    `/products/${productId}/duplicate`,
    {}
  )
  return {
    message: response.message,
    data: normalizeProduct(response.data),
  }
}

export const getProductFaqs = async (productId: number): Promise<ProductFaq[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductFaq[]>>(
    `/products/${productId}/faqs`
  )
  return response.data
}

export const createProductFaq = async (
  productId: number,
  payload: StoreProductFaqFormValues
): Promise<ApiMutationResult<ProductFaq>> => {
  const response = await tenantApiClient.post<ApiResponse<ProductFaq>>(
    `/products/${productId}/faqs`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const updateProductFaq = async (
  productId: number,
  faqId: number,
  payload: UpdateProductFaqFormValues
): Promise<ApiMutationResult<ProductFaq>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductFaq>>(
    `/products/${productId}/faqs/${faqId}`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const deleteProductFaq = async (
  productId: number,
  faqId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<null>>(
    `/products/${productId}/faqs/${faqId}`
  )
  return { message: response.message, data: null }
}

export const getProductDocuments = async (
  productId: number
): Promise<ProductDocument[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductDocument[]>>(
    `/products/${productId}/documents`
  )
  return response.data
}

export const createProductDocument = async (
  productId: number,
  payload: StoreProductDocumentFormValues
): Promise<ApiMutationResult<ProductDocument>> => {
  const response = await tenantApiClient.post<ApiResponse<ProductDocument>>(
    `/products/${productId}/documents`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const updateProductDocument = async (
  productId: number,
  documentId: number,
  payload: UpdateProductDocumentFormValues
): Promise<ApiMutationResult<ProductDocument>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductDocument>>(
    `/products/${productId}/documents/${documentId}`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const deleteProductDocument = async (
  productId: number,
  documentId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<null>>(
    `/products/${productId}/documents/${documentId}`
  )
  return { message: response.message, data: null }
}

export const getProductReviews = async (
  productId: number
): Promise<ProductReview[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductReview[]>>(
    `/products/${productId}/reviews`
  )
  return response.data
}

export const updateProductReview = async (
  productId: number,
  reviewId: number,
  payload: UpdateProductReviewFormValues
): Promise<ApiMutationResult<ProductReview>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductReview>>(
    `/products/${productId}/reviews/${reviewId}`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const deleteProductReview = async (
  productId: number,
  reviewId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<null>>(
    `/products/${productId}/reviews/${reviewId}`
  )
  return { message: response.message, data: null }
}

export const getProductQuestions = async (
  productId: number
): Promise<ProductQuestion[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductQuestion[]>>(
    `/products/${productId}/questions`
  )
  return response.data
}

export const answerProductQuestion = async (
  productId: number,
  questionId: number,
  payload: AnswerProductQuestionFormValues
): Promise<ApiMutationResult<ProductQuestion>> => {
  const response = await tenantApiClient.put<ApiResponse<ProductQuestion>>(
    `/products/${productId}/questions/${questionId}`,
    payload
  )
  return { message: response.message, data: response.data }
}

export const deleteProductQuestion = async (
  productId: number,
  questionId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<null>>(
    `/products/${productId}/questions/${questionId}`
  )
  return { message: response.message, data: null }
}

export const syncProductVideos = async (
  productId: number,
  videos: ProductVideoFormValues[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.put<ApiResponse<null>>(
    `/products/${productId}/videos`,
    { videos }
  )
  return { message: response.message, data: null }
}

export type { ProductApiPayload }
