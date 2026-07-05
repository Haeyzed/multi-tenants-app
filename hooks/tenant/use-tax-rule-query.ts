import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createTaxRule,
  deleteManyTaxRules,
  deleteTaxRule,
  exportTaxRules,
  getTaxRules,
  getTaxRuleStatistics,
  toggleTaxRuleActive,
  updateTaxRule,
} from "@/lib/services/tenant/tax-rule-service"
import { type ExportParams } from "@/types/tenant/export"
import {
  StoreTaxRuleFormValues,
  UpdateTaxRuleFormValues,
} from "@/schemas/tenant/tax-rule-schema"

export const useGetTaxRules = (params?: {
  search?: string
  tax_rate_id?: number
  applicable_type?: "product" | "customer_group"
  rule_type?: "override" | "exempt" | "reduce" | "increase"
  is_active?: ("active" | "inactive")[]
  per_page?: number
  page?: number
}) => {
  return useQuery({
    queryKey: ["tax-rules", params],
    queryFn: () => getTaxRules(params),
  })
}

export const useGetTaxRuleStatistics = () => {
  return useQuery({
    queryKey: ["tax-rule-statistics"],
    queryFn: () => getTaxRuleStatistics(),
  })
}

export const useCreateTaxRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (taxRule: StoreTaxRuleFormValues) => createTaxRule(taxRule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rule-statistics"] })
    },
  })
}

export const useUpdateTaxRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      taxRule,
    }: {
      id: number
      taxRule: UpdateTaxRuleFormValues
    }) => updateTaxRule(id, taxRule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rule-statistics"] })
    },
  })
}

export const useDeleteTaxRule = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTaxRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rule-statistics"] })
    },
  })
}

export const useDeleteManyTaxRules = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyTaxRules(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rule-statistics"] })
    },
  })
}

export const useToggleTaxRuleActive = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => toggleTaxRuleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tax-rules"] })
      queryClient.invalidateQueries({ queryKey: ["tax-rule-statistics"] })
    },
  })
}

export const useExportTaxRules = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => exportTaxRules(params),
  })
}
