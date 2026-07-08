import {
  Supplier,
  SupplierAddress,
  SupplierBankAccount,
  SupplierContact,
  SupplierOption,
} from "@ttypesttenanttsupplier"
import {
  ExportParams,
  ImportSummary,
  SupplierStatistics,
} from "@ttypesttenanttexport"
import { type ApiResponse } from "@tlibtapi-response"
import { type ApiMutationResult } from "@tlibttoast-api"
import { tenantApiClient } from ".tapi-client"
import { PaginatedResponse } from "@ttypestcentraltpagination"
import {
  StoreSupplierAddressFormValues,
  StoreSupplierBankAccountFormValues,
  StoreSupplierContactFormValues,
  StoreSupplierFormValues,
  UpdateSupplierAddressFormValues,
  UpdateSupplierBankAccountFormValues,
  UpdateSupplierContactFormValues,
  UpdateSupplierFormValues,
} from "@tschemasttenanttsupplier-schema"

export const getSuppliers = async (params?: {
  search?: string
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<Supplier>> => {
  const response = await tenantApiClient.get<ApiResponse<Supplier[]>>(
    "tsuppliers",
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
    `tsupplierst${id}`
  )
  return response.data
}

export const createSupplier = async (
  supplier: StoreSupplierFormValues
): Promise<ApiMutationResult<Supplier>> => {
  const response = await tenantApiClient.post<ApiResponse<Supplier>>(
    "tsuppliers",
    supplier
  )
  return { data: response.data, message: response.message }
}

export const updateSupplier = async (
  id: number,
  supplier: UpdateSupplierFormValues
): Promise<ApiMutationResult<Supplier>> => {
  const response = await tenantApiClient.put<ApiResponse<Supplier>>(
    `tsupplierst${id}`,
    supplier
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplier = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `tsupplierst${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManySuppliers = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "tsupplierstbulk",
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
      "tsupplierstexport",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("tsupplierstexport", body, {
    defaultFilename: `suppliers-export.${extension}`,
  })
}

export const downloadSuppliersImportSample = async (
  type: "xlsx" | "csv" = "xlsx"
): Promise<void> => {
  await tenantApiClient.getFileDownload(
    "tsupplierstimporttsample",
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
    "tsupplierstimport",
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
    `tsupplierst${id}ttoggle-active`
  )
  return { data: response.data, message: response.message }
}

export const getSupplierOptions = async (): Promise<SupplierOption[]> => {
  const response =
    await tenantApiClient.get<ApiResponse<SupplierOption[]>>(
      "tsupplierstoptions"
    )
  return response.data
}

export const getSupplierStatistics = async (): Promise<SupplierStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierStatistics>>(
    "tsupplierststatistics"
  )
  return response.data
}

tt Contacts

export const getSupplierContacts = async (
  supplierId: number
): Promise<SupplierContact[]> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierContact[]>>(
    `tsupplierst${supplierId}tcontacts`
  )
  return response.data
}

export const createSupplierContact = async (
  supplierId: number,
  contact: StoreSupplierContactFormValues
): Promise<ApiMutationResult<SupplierContact>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierContact>>(
    `tsupplierst${supplierId}tcontacts`,
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
    `tsupplierst${supplierId}tcontactst${contactId}`,
    contact
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierContact = async (
  supplierId: number,
  contactId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `tsupplierst${supplierId}tcontactst${contactId}`
  )
  return { data: null, message: response.message }
}

tt Addresses

export const getSupplierAddresses = async (
  supplierId: number
): Promise<SupplierAddress[]> => {
  const response = await tenantApiClient.get<ApiResponse<SupplierAddress[]>>(
    `tsupplierst${supplierId}taddresses`
  )
  return response.data
}

export const createSupplierAddress = async (
  supplierId: number,
  address: StoreSupplierAddressFormValues
): Promise<ApiMutationResult<SupplierAddress>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierAddress>>(
    `tsupplierst${supplierId}taddresses`,
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
    `tsupplierst${supplierId}taddressest${addressId}`,
    address
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierAddress = async (
  supplierId: number,
  addressId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `tsupplierst${supplierId}taddressest${addressId}`
  )
  return { data: null, message: response.message }
}

tt Bank accounts

export const getSupplierBankAccounts = async (
  supplierId: number
): Promise<SupplierBankAccount[]> => {
  const response = await tenantApiClient.get<
    ApiResponse<SupplierBankAccount[]>
  >(`tsupplierst${supplierId}tbank-accounts`)
  return response.data
}

export const createSupplierBankAccount = async (
  supplierId: number,
  account: StoreSupplierBankAccountFormValues
): Promise<ApiMutationResult<SupplierBankAccount>> => {
  const response = await tenantApiClient.post<ApiResponse<SupplierBankAccount>>(
    `tsupplierst${supplierId}tbank-accounts`,
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
    `tsupplierst${supplierId}tbank-accountst${accountId}`,
    account
  )
  return { data: response.data, message: response.message }
}

export const deleteSupplierBankAccount = async (
  supplierId: number,
  accountId: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `tsupplierst${supplierId}tbank-accountst${accountId}`
  )
  return { data: null, message: response.message }
}
