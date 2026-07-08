import { TaxRule } from "@/types/tenant/tax-rule"
import { ExportParams, TaxRuleStatistics } from "@/types/tenant/export"
import { type ApiResponse } from "@/lib/api-response"
import { type ApiMutationResult } from "@/lib/toast-api"
import { tenantApiClient } from "./api-client"
import { PaginatedResponse } from "@/types/central/pagination"
import {
  StoreTaxRuleFormValues,
  UpdateTaxRuleFormValues,
} from "@/schemas/tenant/tax-rule-schema"

export const getTaxRules = async (params?: {
  search?: string
  tax_rate_id?: number
  applicable_type?: "product" | "customer_group"
  rule_type?: "override" | "exempt" | "reduce" | "increase"
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}): Promise<PaginatedResponse<TaxRule>> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRule[]>>(
    "/tax-rules",
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

export const getTaxRule = async (id: number): Promise<TaxRule> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRule>>(
    `/tax-rules/${id}`
  )
  return response.data
}

export const createTaxRule = async (
  taxRule: StoreTaxRuleFormValues
): Promise<ApiMutationResult<TaxRule>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRule>>(
    "/tax-rules",
    taxRule
  )
  return { data: response.data, message: response.message }
}

export const updateTaxRule = async (
  id: number,
  taxRule: UpdateTaxRuleFormValues
): Promise<ApiMutationResult<TaxRule>> => {
  const response = await tenantApiClient.put<ApiResponse<TaxRule>>(
    `/tax-rules/${id}`,
    taxRule
  )
  return { data: response.data, message: response.message }
}

export const deleteTaxRule = async (
  id: number
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    `/tax-rules/${id}`
  )
  return { data: null, message: response.message }
}

export const deleteManyTaxRules = async (
  ids: number[]
): Promise<ApiMutationResult<null>> => {
  const response = await tenantApiClient.delete<ApiResponse<void>>(
    "/tax-rules/bulk",
    { ids }
  )
  return { data: null, message: response.message }
}

export const toggleTaxRuleActive = async (
  id: number
): Promise<ApiMutationResult<TaxRule>> => {
  const response = await tenantApiClient.post<ApiResponse<TaxRule>>(
    `/tax-rules/${id}/toggle-active`,
    {}
  )
  return { data: response.data, message: response.message }
}

export const getTaxRuleStatistics = async (): Promise<TaxRuleStatistics> => {
  const response = await tenantApiClient.get<ApiResponse<TaxRuleStatistics>>(
    "/tax-rules/statistics"
  )
  return response.data
}

export const exportTaxRules = async (
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
      "/tax-rules/export",
      body
    )
    return { data: null, message: response.message }
  }

  const extension = body.type === "csv" ? "csv" : "xlsx"
  await tenantApiClient.postFileDownload("/tax-rules/export", body, {
    defaultFilename: `tax-rules-export.${extension}`,
  })
}
