"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import { type TaxClass } from "@/types/tenant/tax-class"

type TaxClassesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taxClass: TaxClass
}

function getTaxClassViewFields(taxClass: TaxClass): ModuleViewField[] {
  return [
    { label: "Name", value: taxClass.name },
    { label: "Code", value: taxClass.code },
    {
      label: "Description",
      value: taxClass.description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Status",
      value: taxClass.is_active ? "Active" : "Inactive",
    },
    {
      label: "Default",
      value: taxClass.is_default ? (
        <Badge variant="secondary">Default</Badge>
      ) : (
        "No"
      ),
    },
    { label: "Rates", value: String(taxClass.rates_count ?? 0) },
    { label: "Products", value: String(taxClass.products_count ?? 0) },
    { label: "Sort order", value: String(taxClass.sort_order ?? 0) },
    {
      label: "Created",
      value: taxClass.created_at
        ? format(new Date(taxClass.created_at), "PPP")
        : "—",
    },
  ]
}

export function TaxClassesViewDialog({
  open,
  onOpenChange,
  taxClass,
}: TaxClassesViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tax Class Details"
      description={`Viewing tax class #${taxClass.id}`}
      fields={getTaxClassViewFields(taxClass)}
    />
  )
}
