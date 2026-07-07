"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import {
  type TaxRule,
  type TaxRuleApplicableType,
  type TaxRuleType,
} from "@/types/tenant/tax-rule"

type TaxRulesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taxRule: TaxRule
}

const APPLICABLE_TYPE_LABELS: Record<TaxRuleApplicableType, string> = {
  product: "Product",
  customer_group: "Customer Group",
}

const RULE_TYPE_LABELS: Record<TaxRuleType, string> = {
  override: "Override",
  exempt: "Exempt",
  reduce: "Reduce",
  increase: "Increase",
}

function getTaxRuleViewFields(taxRule: TaxRule): ModuleViewField[] {
  return [
    { label: "Tax Rate", value: taxRule.tax_rate?.name ?? "—" },
    {
      label: "Applicable Type",
      value: APPLICABLE_TYPE_LABELS[taxRule.applicable_type],
    },
    { label: "Applicable ID", value: String(taxRule.applicable_id) },
    {
      label: "Rule Type",
      value: (
        <Badge variant="secondary">{RULE_TYPE_LABELS[taxRule.rule_type]}</Badge>
      ),
    },
    {
      label: "Adjustment Rate",
      value:
        taxRule.adjustment_rate !== null ? `${taxRule.adjustment_rate}%` : "—",
    },
    {
      label: "Effective From",
      value: taxRule.effective_from
        ? format(new Date(taxRule.effective_from), "PPP")
        : "—",
    },
    {
      label: "Effective To",
      value: taxRule.effective_to
        ? format(new Date(taxRule.effective_to), "PPP")
        : "—",
    },
    {
      label: "Status",
      value: taxRule.is_active ? "Active" : "Inactive",
    },
    {
      label: "Created",
      value: taxRule.created_at
        ? format(new Date(taxRule.created_at), "PPP")
        : "—",
    },
  ]
}

export function TaxRulesViewDialog({
  open,
  onOpenChange,
  taxRule,
}: TaxRulesViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tax Rule Details"
      description={`Viewing tax rule #${taxRule.id}`}
      fields={getTaxRuleViewFields(taxRule)}
    />
  )
}
