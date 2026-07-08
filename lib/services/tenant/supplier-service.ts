import {
  Supplier,
  SupplierAddress,
  SupplierBankAccount,
  SupplierContact,
  SupplierOption,
} from "@/types/tenant/supplier"
import {
  ExportParams,
  ImportSummary,
  SupplierStatistics,
} from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreSupplierAddressFormValues,
  StoreSupplierBankAccountFormValues,
  StoreSupplierContactFormValues,
  StoreSupplierFormValues,
  UpdateSupplierAddressFormValues,
  UpdateSupplierBankAccountFormValues,
  UpdateSupplierContactFormValues,
  UpdateSupplierFormValues,
} from "@/schemas/tenant/supplier-schema"

export const getSuppliers = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Supplier>> => {
  const response = await tenantApiClient.get<ApiResponse<Supplier[]>>(
    "/suppliers",
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

export const getSupplier = async (id: number): Promise<Supplier> => {
  const response = await tenantApiClient.get<ApiResponse<Supplier>>(
    `/suppliers/${id}`
  )
  return response.data
}

export const createSupplier = async (
  supplier: StoreSupplierFormValues
): Promise<ApiMutationResult<Supplier>> => {
  const response = await tenantApiClient.post<ApiResponse<Supplier>>(
    "/suppliers",
    supplier
  )
  return { data: response.data, message: response.message }
}

export const updateSupplier = async (
  id: number,
  supplier: UpdateSupplierFormValues
): Promise<ApiMutationResult<Supplier>> => {
  const response = await tenantApiClient.put<ApiResponse<Supplier>>(
    `/suppliers/${id}`,
    supplier
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplier = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/suppliers/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManySuppliers = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/suppliers/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const exportSuppliers = async (
  params: ExportParams
): Promise<void | ApiMutationResult<null>> => {
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
    const response = await tenantApiClient.post<ApiResponse<void>>(
      "/suppliers/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/suppliers/export", body, {
    defaultFilename: `suppliers-export.${extension}`,
  })
}

export const downloadSuppliersImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "/suppliers/import/sample",
    { type },
    `suppliers-import-sample.${type}`
  )
}

export const importSuppliers = async (
  file: File
): Promise<ApiMutationResult<ImportSummary>> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await tenantApiClient.upload<ApiResponse<ImportSummary>>(
    "/suppliers/import",
    formData
  )

  return {
    data: response.data,
    message: response.message,
  }
}

export const toggleSupplierActive = async (
  id: number
): Promise<ApiMutationResult<Supplier>> => {
  const response = await tenantApiClient.post<ApiResponse<Supplier>>(
    `/suppliers/${id}/toggle-active`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getSupplierOptions = async (): Promise<SupplierOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<SupplierOption[]>>(
      "/suppliers/options"
    )
  return response.data
}

export const getSupplierStatistics = async (): Promise<SupplierStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierStatistics>>(
    "/suppliers/statistics"
  )
  return response.data
}

// Contacts

export const getSupplierContacts = async (
  supplierId: number
): Promise<SupplierContact[]> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierContact[]>>(
    `/suppliers/${supplierId}/contacts`
  )
  return response.data
}

export const createSupplierContact = async (
  supplierId: number,
  contact: StoreSupplierContactFormValues
): Promise<ApiMutationResult<SupplierContact>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierContact>>(
    `/suppliers/${supplierId}/contacts`,
    contact
  )
  return { data: response.data, message: response.message }
}

export const updateSupplierContact = async (
  supplierId: number,
  contactId: number,
  contact: UpdateSupplierContactFormValues
): Promise<ApiMutationResult<SupplierContact>> => {
  const response = await tenantApiClient.put<ApiResponse<SupplierContact>>(
    `/suppliers/${supplierId}/contacts/${contactId}`,
    contact
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierContact = async (
  supplierId: number,
  contactId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/suppliers/${supplierId}/contacts/${contactId}`
  )
  return { data: null, message: response.message }
}

// Addresses

export const getSupplierAddresses = async (
  supplierId: number
): Promise<SupplierAddress[]> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierAddress[]>>(
    `/suppliers/${supplierId}/addresses`
  )
  return response.data
}

export const createSupplierAddress = async (
  supplierId: number,
  address: StoreSupplierAddressFormValues
): Promise<ApiMutationResult<SupplierAddress>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierAddress>>(
    `/suppliers/${supplierId}/addresses`,
    address
  )
  return { data: response.data, message: response.message }
}

export const updateSupplierAddress = async (
  supplierId: number,
  addressId: number,
  address: UpdateSupplierAddressFormValues
): Promise<ApiMutationResult<SupplierAddress>> => {
  const response = await tenantApiClient.put<ApiResponse<SupplierAddress>>(
    `/suppliers/${supplierId}/addresses/${addressId}`,
    address
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierAddress = async (
  supplierId: number,
  addressId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/suppliers/${supplierId}/addresses/${addressId}`
  )
  return { data: null, message: response.message }
}

// Bank accounts

export const getSupplierBankAccounts = async (
  supplierId: number
): Promise<SupplierBankAccount[]> => {
  const response = await tenantApiClient.get<
    ApiResponse<SupplierBankAccount[]>
  >(`/suppliers/${supplierId}/bank-accounts`)
  return response.data
}

export const createSupplierBankAccount = async (
  supplierId: number,
  account: StoreSupplierBankAccountFormValues
): Promise<ApiMutationResult<SupplierBankAccount>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierBankAccount>>(
    `/suppliers/${supplierId}/bank-accounts`,
    account
  )
  return { data: response.data, message: response.message }
}

export const updateSupplierBankAccount = async (
  supplierId: number,
  accountId: number,
  account: UpdateSupplierBankAccountFormValues
): Promise<ApiMutationResult<SupplierBankAccount>> => {
  const response = await tenantApiClient.put<ApiResponse<SupplierBankAccount>>(
    `/suppliers/${supplierId}/bank-accounts/${accountId}`,
    account
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierBankAccount = async (
  supplierId: number,
  accountId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/suppliers/${supplierId}/bank-accounts/${accountId}`
  )
  return { data: null, message: response.message }
}
