"use client"

import { format } from "date-fns"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type AttributeSet } from "@/types/tenant/attribute-set"

type AttributeSetsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attributeSet: AttributeSet
}

function getAttributeSetViewFields(
  attributeSet: AttributeSet
): ModuleViewField[] {
  return [
    { label: "Name", value: attributeSet.name },
    { label: "Slug", value: attributeSet.slug },
    {
      label: "Description",
      value: attributeSet.description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Status",
      value: attributeSet.is_active ? "Active" : "Inactive",
    },
    {
      label: "Attributes",
      value: String(attributeSet.attributes_count ?? 0),
    },
    {
      label: "Categories",
      value: String(attributeSet.categories_count ?? 0),
    },
    { label: "Sort order", value: String(attributeSet.sort_order ?? 0) },
    {
      label: "Created",
      value: attributeSet.created_at
        ? format(new Date(attributeSet.created_at), "PPP")
        : "—",
    },
  ]
}

export function AttributeSetsViewDialog({
  open,
  onOpenChange,
  attributeSet,
}: AttributeSetsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={attributeSet.name}
      description={`Attribute set details · ${attributeSet.slug}`}
      fields={getAttributeSetViewFields(attributeSet)}
    />
  )
}
