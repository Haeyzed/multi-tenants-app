"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Attribute } from "@/types/tenant/attribute"

type AttributesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attribute: Attribute
}

const DISPLAY_TYPE_LABELS: Record<string, string> = {
  dropdown: "Dropdown",
  swatch: "Swatch",
  radio: "Radio",
  checkbox: "Checkbox",
  text_input: "Text Input",
}

function formatBoolean(value: boolean): string {
  return value ? "Yes" : "No"
}

function getAttributeViewFields(attribute: Attribute): ModuleViewField[] {
  return [
    { label: "Name", value: attribute.name },
    { label: "Slug", value: attribute.slug },
    { label: "Code", value: attribute.code || "—" },
    {
      label: "Type",
      value: <Badge variant="outline" className="capitalize">{attribute.type}</Badge>,
    },
    {
      label: "Display type",
      value: DISPLAY_TYPE_LABELS[attribute.display_type] ?? attribute.display_type,
    },
    {
      label: "Description",
      value: attribute.description || "—",
      className: "sm:col-span-2",
    },
    { label: "Values", value: String(attribute.values_count ?? 0) },
    { label: "Filterable", value: formatBoolean(attribute.is_filterable) },
    {
      label: "Visible on product",
      value: formatBoolean(attribute.is_visible_on_product),
    },
    {
      label: "Visible on listing",
      value: formatBoolean(attribute.is_visible_on_listing),
    },
    { label: "Required", value: formatBoolean(attribute.is_required) },
    { label: "Variant", value: formatBoolean(attribute.is_variant) },
    { label: "User defined", value: formatBoolean(attribute.is_user_defined) },
    { label: "Sort order", value: String(attribute.sort_order ?? 0) },
    {
      label: "Created",
      value: attribute.created_at
        ? format(new Date(attribute.created_at), "PPP")
        : "—",
    },
  ]
}

export function AttributesViewDialog({
  open,
  onOpenChange,
  attribute,
}: AttributesViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={attribute.name}
      description={`Attribute details · ${attribute.slug}`}
      fields={getAttributeViewFields(attribute)}
    />
  )
}
