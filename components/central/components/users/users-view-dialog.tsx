"use client"

import { format } from "date-fns"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/central/components/shared/module-view-dialog"
import { type User } from "@/types/central/user"

type UsersViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User
}

function getUserViewFields(user: User): ModuleViewField[] {
  return [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone || "—" },
    {
      label: "Status",
      value: (
        <Status variant={user.is_active ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{user.is_active ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      ),
    },
    {
      label: "Roles",
      value: user.roles?.length ? user.roles.join(", ") : "—",
      className: "sm:col-span-2",
    },
    {
      label: "Created",
      value: user.created_at ? format(new Date(user.created_at), "PPP") : "—",
    },
  ]
}

export function UsersViewDialog({
  open,
  onOpenChange,
  user,
}: UsersViewDialogProps) {
  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={user.name}
      description={`User details · ${user.email}`}
      fields={getUserViewFields(user)}
    />
  )
}
