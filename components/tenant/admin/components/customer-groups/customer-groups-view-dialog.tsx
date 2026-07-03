"use client"

import { format } from "date-fns"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type CustomerGroup } from "@/types/tenant/customer-group"

type CustomerGroupsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: CustomerGroup
}

function getCustomerGroupViewFields(group: CustomerGroup): ModuleViewField[] {
  const discount =
    group.discount_percentage ?? group.discount_percent ?? "0"

  return [
    { label: "Name", value: group.name },
    { label: "Slug", value: group.slug },
    {
      label: "Description",
      value: group.description || "—",
      className: "sm:col-span-2",
    },
    { label: "Discount %", value: `${discount}%` },
    {
      label: "Status",
      value: (
        <Status variant={group.is_active ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{group.is_active ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      ),
    },
    { label: "Customers", value: String(group.customers_count ?? 0) },
    {
      label: "Created",
      value: group.created_at
        ? format(new Date(group.created_at), "PPP")
        : "—",
    },
  ]
}

export function CustomerGroupsViewDialog({
  open,
  onOpenChange,
  group,
}: CustomerGroupsViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={group.name}
      description={`Customer group details · ${group.slug}`}
      fields={getCustomerGroupViewFields(group)}
    />
  )
}
