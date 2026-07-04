import { Product, ProductOption, ProductStatistics } from "@/types/tenant/product"
import { ExportParams } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import { ProductFormValues } from "@/schemas/tenant/product-schema"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginatedResponse<unknown>["meta"]
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    primary_image_media: product.primary_image_media
      ? {
          ...product.primary_image_media,
          url: resolveTenantMediaUrl(product.primary_image_media),
        }
      : null,
    gallery: product.gallery?.map((item) => ({
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
  is_featured?: ("featured" | "not_featured")[]
  brand_id?: number
  category_id?: number
  product_type?: string[]
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
  product: ProductFormValues
): Promise<Product> => {
  const response = await tenantApiClient.post<ApiResponse<Product>>(
    "/products",
    product
  )
  return normalizeProduct(response.data)
}

export const updateProduct = async (
  id: number,
  product: Partial<ProductFormValues>
): Promise<Product> => {
  const response = await tenantApiClient.put<ApiResponse<Product>>(
    `/products/${id}`,
    product
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

export const getProductOptions = async (): Promise<ProductOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<ProductOption[]>>(
    "/products/options"
  )
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
