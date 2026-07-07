import { Customer, CustomerOption } from "@/types/tenant/customer"
import { CustomerStatistics, ExportParams, ImportSummary } from "@/types/tenant/export"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreCustomerFormValues,
  UpdateCustomerFormValues,
} from "@/schemas/tenant/customer-schema"

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const getCustomers = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  customer_group_id?: number
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Customer>> => {
  const response = await tenantApiClient.get<ApiResponse<Customer[]>>(
    "/customers",
    params
  )
  return {
    data: response.data,
    meta: response.meta || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: response.data.length,
    },
  }
}

export const getCustomer = async (id: number): Promise<Customer> => {
  const response = await tenantApiClient.get<ApiResponse<Customer>>(
    `/customers/${id}`
  )
  return response.data
}

export const createCustomer = async (
  customer: StoreCustomerFormValues
): Promise<Customer> => {
  const response = await tenantApiClient.post<ApiResponse<Customer>>(
    "/customers",
    {
      ...customer,
      email: customer.email || null,
      phone: customer.phone || null,
    }
  )
  return response.data
}

export const updateCustomer = async (
  id: number,
  customer: UpdateCustomerFormValues
): Promise<Customer> => {
  const response = await tenantApiClient.put<ApiResponse<Customer>>(
    `/customers/${id}`,
    {
      ...customer,
      email: customer.email || null,
      phone: customer.phone || null,
    }
  )
  return response.data
}

export const deleteCustomer = async (id: number): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>(`/customers/${id}`)
}

export const getCustomerOptions = async (): Promise<CustomerOption[]> => {
  const response = await tenantApiClient.get<ApiResponse<CustomerOption[]>>(
    "/customers/options"
  )
  return response.data
}

export const getCustomerStatistics = async (): Promise<CustomerStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<CustomerStatistics>>(
    "/customers/statistics"
  )
  return response.data
}

export const deleteManyCustomers = async (ids: number[]): Promise<void> => {
  await tenantApiClient.delete<ApiResponse<void>>("/customers/bulk", { ids })
}

export const exportCustomers = async (params: ExportParams): Promise<void> => {
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
    await tenantApiClient.post<ApiResponse<void>>("/customers/export", body)
    return
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/customers/export", body, {
    defaultFilename: `customers-export.${extension}`,
  })
}

export const downloadCustomersImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/customers/import/sample",
    { type },
    `customers-import-sample.${type}`
  )
}

export const importCustomers = async (
  file: File
): Promise<{ summary: ImportSummary; message: string }> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/customers/import",
    formData
  )

  return {
    summary: response.data,
    message: response.message,
  }
}
