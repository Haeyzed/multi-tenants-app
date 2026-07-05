"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import { type TaxRate } from "@/types/tenant/tax-rate"

type TaxRatesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taxRate: TaxRate
}

function getTaxRateViewFields(taxRate: TaxRate): ModuleViewField[] {
  return [
    { label: "Name", value: taxRate.name },
    { label: "Tax Class", value: taxRate.tax_class?.name ?? "—" },
    { label: "Tax Zone", value: taxRate.tax_zone?.name ?? "—" },
    { label: "Rate", value: `${taxRate.rate}%` },
    { label: "Priority", value: String(taxRate.priority) },
    {
      label: "Compound",
      value: taxRate.is_compound ? (
        <Badge variant="secondary">Yes</Badge>
      ) : (
        "No"
      ),
    },
    {
      label: "Applies to Shipping",
      value: taxRate.applies_to_shipping ? "Yes" : "No",
    },
    {
      label: "Effective From",
      value: taxRate.effective_from
        ? format(new Date(taxRate.effective_from), "PPP")
        : "—",
    },
    {
      label: "Effective To",
      value: taxRate.effective_to
        ? format(new Date(taxRate.effective_to), "PPP")
        : "—",
    },
    {
      label: "Status",
      value: taxRate.is_active ? "Active" : "Inactive",
    },
    {
      label: "Created",
      value: taxRate.created_at
        ? format(new Date(taxRate.created_at), "PPP")
        : "—",
    },
  ]
}

export function TaxRatesViewDialog({
  open,
  onOpenChange,
  taxRate,
}: TaxRatesViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tax Rate Details"
      description={`Viewing tax rate #${taxRate.id}`}
      fields={getTaxRateViewFields(taxRate)}
    />
  )
}
