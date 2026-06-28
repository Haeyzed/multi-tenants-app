"use client"

import * as React from "react"
import { FormDialog } from "@/components/form-dialog"
import {
  useCreateTenant,
  useUpdateTenant,
} from "@/hooks/central/use-tenant-query"
import {
  TenantFormValues,
  UpdateTenantFormValues,
} from "@/schemas/central/tenant-schema"
import { Tenant } from "@/types/central/tenant"
import { TenantForm } from "./tenant-form"
import { toast } from "sonner"

interface TenantDialogProps {
  children: React.ReactElement
  tenant?: Tenant
}

export function TenantDialog({ children, tenant }: TenantDialogProps) {
  const [open, setOpen] = React.useState(false)
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()

  const isSubmitting = createTenant.isPending || updateTenant.isPending

  const onSubmit = (values: TenantFormValues | UpdateTenantFormValues) => {
    if (tenant) {
      updateTenant.mutate(
        { id: tenant.id, tenant: values as UpdateTenantFormValues },
        {
          onSuccess: () => {
            toast.success("Tenant updated successfully")
            setOpen(false)
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update tenant")
          },
        }
      )
    } else {
      createTenant.mutate(values as TenantFormValues, {
        onSuccess: () => {
          toast.success("Tenant created successfully")
          setOpen(false)
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create tenant")
        },
      })
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={tenant ? "Edit Tenant" : "Create Tenant"}
    >
      <TenantForm
        tenant={tenant}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </FormDialog>
  )
}
