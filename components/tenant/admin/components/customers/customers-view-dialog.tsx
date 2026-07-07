"use client"

import { format } from "date-fns"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Customer } from "@/types/tenant/customer"

type CustomersViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer
}

function getCustomerViewFields(customer: Customer): ModuleViewField[] {
  return [
    { label: "First name", value: customer.first_name },
    { label: "Last name", value: customer.last_name },
    { label: "Email", value: customer.email || "—" },
    { label: "Phone", value: customer.phone || "—" },
    { label: "Group", value: customer.group?.name ?? "—" },
    {
      label: "Date of birth",
      value: customer.date_of_birth
        ? format(new Date(customer.date_of_birth), "PPP")
        : "—",
    },
    { label: "Gender", value: customer.gender || "—" },
    {
      label: "Status",
      value: (
        <Status variant={customer.is_active ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>
            {customer.is_active ? "Active" : "Inactive"}
          </StatusLabel>
        </Status>
      ),
    },
    { label: "Orders", value: String(customer.orders_count ?? 0) },
    { label: "Total spent", value: customer.total_spent || "0.00" },
    {
      label: "Created",
      value: customer.created_at
        ? format(new Date(customer.created_at), "PPP")
        : "—",
    },
  ]
}

export function CustomersViewDialog({
  open,
  onOpenChange,
  customer,
}: CustomersViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={customer.full_name}
      description="Customer details"
      fields={getCustomerViewFields(customer)}
    />
  )
}
