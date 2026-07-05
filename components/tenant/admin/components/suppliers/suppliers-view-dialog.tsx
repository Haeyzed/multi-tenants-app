"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Supplier } from "@/types/tenant/supplier"

type SuppliersViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier
}

function getSupplierViewFields(supplier: Supplier): ModuleViewField[] {
  return [
    { label: "Name", value: supplier.name },
    { label: "Code", value: supplier.code },
    { label: "Slug", value: supplier.slug },
    {
      label: "Description",
      value: supplier.description || "—",
      className: "sm:col-span-2",
    },
    { label: "Contact Name", value: supplier.contact_name || "—" },
    { label: "Contact Email", value: supplier.contact_email || "—" },
    { label: "Contact Phone", value: supplier.contact_phone || "—" },
    { label: "Website", value: supplier.website_url || "—" },
    { label: "Tax ID", value: supplier.tax_id || "—" },
    {
      label: "Registration Number",
      value: supplier.registration_number || "—",
    },
    {
      label: "Status",
      value: supplier.is_active ? "Active" : "Inactive",
    },
    { label: "Products", value: String(supplier.products_count ?? 0) },
    {
      label: "Created",
      value: supplier.created_at
        ? format(new Date(supplier.created_at), "PPP")
        : "—",
    },
  ]
}

export function SuppliersViewDialog({
  open,
  onOpenChange,
  supplier,
}: SuppliersViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Supplier Details"
      description={`Viewing supplier #${supplier.id}`}
      fields={getSupplierViewFields(supplier)}
    />
  )
}
