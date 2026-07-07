"use client"

import { format } from "date-fns"

import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type ProductLabel } from "@/types/tenant/product-label"

type ProductLabelsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  label: ProductLabel
}

function ColorPreview({ color }: { color: string | null }) {
  if (!color) {
    return <>—</>
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block size-4 shrink-0 rounded border"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="font-mono text-sm">{color}</span>
    </div>
  )
}

function getProductLabelViewFields(label: ProductLabel): ModuleViewField[] {
  return [
    { label: "Name", value: label.name },
    { label: "Slug", value: label.slug },
    { label: "Text Color", value: <ColorPreview color={label.color} /> },
    {
      label: "Background Color",
      value: <ColorPreview color={label.background_color} />,
    },
    { label: "Icon", value: label.icon || "—" },
    {
      label: "Status",
      value: (
        <Status variant={label.is_active ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{label.is_active ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      ),
    },
    { label: "Sort order", value: String(label.sort_order ?? 0) },
    {
      label: "Created",
      value: label.created_at
        ? format(new Date(label.created_at), "PPP")
        : "—",
    },
  ]
}

export function ProductLabelsViewDialog({
  open,
  onOpenChange,
  label,
}: ProductLabelsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={label.name}
      description={`Product label details · ${label.slug}`}
      fields={getProductLabelViewFields(label)}
    />
  )
}
