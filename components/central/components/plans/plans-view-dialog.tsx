"use client"

import { format } from "date-fns"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/central/components/shared/module-view-dialog"
import { type Plan } from "@/types/central/plan"

type PlansViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan
}

function getPlanViewFields(plan: Plan): ModuleViewField[] {
  const features = Array.isArray(plan.features) ? plan.features.join(", ") : "—"

  return [
    { label: "Name", value: plan.name },
    { label: "Slug", value: plan.slug },
    {
      label: "Description",
      value: plan.description || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Price",
      value: `$${parseFloat(plan.price).toFixed(2)} ${plan.currency}`,
    },
    { label: "Interval", value: plan.interval },
    {
      label: "Status",
      value: (
        <Status variant={plan.is_active ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{plan.is_active ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      ),
    },
    {
      label: "Featured",
      value: plan.is_featured ? "Yes" : "No",
    },
    { label: "Sort order", value: String(plan.sort_order ?? 0) },
    {
      label: "Features",
      value: features || "—",
      className: "sm:col-span-2",
    },
    {
      label: "Created",
      value: plan.created_at ? format(new Date(plan.created_at), "PPP") : "—",
    },
  ]
}

export function PlansViewDialog({
  open,
  onOpenChange,
  plan,
}: PlansViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={plan.name}
      description={`Plan details · ${plan.slug}`}
      fields={getPlanViewFields(plan)}
    />
  )
}
