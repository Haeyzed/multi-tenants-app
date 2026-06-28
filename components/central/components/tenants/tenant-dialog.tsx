"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"
import { Tenant } from "@/types/central/tenant"
import { TenantForm } from "./tenant-form"
import { useCreateTenant, useUpdateTenant } from "@/hooks/central/use-tenant-query"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive"]),
})

export function TenantDialog({
  children,
  tenant,
}: {
  children: React.ReactNode
  tenant?: Tenant
}) {
  const [open, setOpen] = React.useState(false)
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (tenant) {
      updateTenant.mutate({ id: tenant.id, tenant: values })
    } else {
      createTenant.mutate(values)
    }
    setOpen(false)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {tenant ? "Edit Tenant" : "Create Tenant"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <TenantForm tenant={tenant} onSubmit={onSubmit} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}