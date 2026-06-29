"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { useCreateTenant, useUpdateTenant } from "@/hooks/central/use-tenant-query"
import { type Tenant } from "@/types/central/tenant"
import { tenantSchema, updateTenantSchema, type StoreTenantFormValues, type UpdateTenantFormValues } from "@/schemas/central/tenant-schema"
import { PhoneInput, PhoneInputCountrySelect, PhoneInputField } from "@/components/ui/phone-input"
import { useGetPlanOptions } from "@/hooks/central/use-plan-query"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { PlanOption } from "@/types/central/plan"

type TenantsMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Tenant
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-destructive mt-1">{message}</p>
}

export function TenantsMutateDialog({
                                    open,
                                    onOpenChange,
                                    currentRow,
                                  }: TenantsMutateDialogProps) {
  const isUpdate = !!currentRow
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const { data: planOptions, isLoading: isLoadingPlans } = useGetPlanOptions()
  const isSubmitting = createTenant.isPending || updateTenant.isPending

  const schema = isUpdate ? updateTenantSchema : tenantSchema

  const form = useForm<StoreTenantFormValues | UpdateTenantFormValues>({
    resolver: zodResolver(schema),
    defaultValues: currentRow
      ? {
        name: currentRow.name,
        email: currentRow.email || "",
        phone: currentRow.phone || "",
        plan: currentRow.plan || "",
        trial_ends_at: currentRow.trial_ends_at || "",
      }
      : {
        name: "",
        slug: "",
        email: "",
        phone: "",
        plan: "",
        trial_ends_at: "",
        subdomain: "",
        owner: { name: "", email: "", phone: "" },
      },
  })

  const onSubmit = (data: StoreTenantFormValues | UpdateTenantFormValues) => {
    if (isUpdate && currentRow) {
      updateTenant.mutate(
        { id: currentRow.id, tenant: data as UpdateTenantFormValues },
        {
          onSuccess: () => {
            toast.success("Tenant updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            toast.error(error.message || "Failed to update tenant")
          },
        }
      )
    } else {
      createTenant.mutate(data as StoreTenantFormValues, {
        onSuccess: () => {
          toast.success("Tenant created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create tenant")
        },
      })
    }
  }

  const selectedPlan = planOptions?.find(option => option.value === form.watch("plan"));

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Tenant
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tenant by providing necessary info."
              : "Add a new tenant by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <form
          id="tenants-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Acme Inc." {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          {!isUpdate && (
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <FieldContent>
                <Input placeholder="acme-inc" {...form.register("slug")} />
                <FieldError message={(form.formState.errors as any).slug?.message} />
              </FieldContent>
            </Field>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input placeholder="contact@acme.inc" {...form.register("email")} />
                <FieldError message={form.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <PhoneInput {...form.register("phone")} required
                >
                  <PhoneInputCountrySelect />
                  <PhoneInputField />
                </PhoneInput>
                <FieldError message={form.formState.errors.phone?.message} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Plan</FieldLabel>
              <FieldContent>
                <Combobox
                  items={planOptions || []}
                  itemToStringValue={(plan:PlanOption) => plan.label}
                  value={selectedPlan}
                  onValueChange={(item) => {
                    form.setValue("plan", item ? item.value : "");
                  }}
                >
                  <ComboboxInput placeholder="Select a plan..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No plans found.</ComboboxEmpty>
                    <ComboboxList>
                      {(plan) => (
                        <ComboboxItem key={plan.value} value={plan}>
                          {plan.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError message={form.formState.errors.plan?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Trial Ends At</FieldLabel>
              <FieldContent>
                <Input type="datetime-local" {...form.register("trial_ends_at")} />
                <FieldError message={form.formState.errors.trial_ends_at?.message} />
              </FieldContent>
            </Field>
          </div>

          {!isUpdate && (
            <>
              <Field>
                <FieldLabel>Subdomain</FieldLabel>
                <FieldContent>
                  <Input placeholder="acme" {...form.register("subdomain")} />
                  <FieldError message={(form.formState.errors as any).subdomain?.message} />
                </FieldContent>
              </Field>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Owner Information
                </h3>

                <Field>
                  <FieldLabel>Owner Name *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="John Doe" {...form.register("owner.name")} />
                    <FieldError message={(form.formState.errors as any).owner?.name?.message} />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>Owner Email *</FieldLabel>
                    <FieldContent>
                      <Input placeholder="john.doe@acme.inc" {...form.register("owner.email")} />
                      <FieldError message={(form.formState.errors as any).owner?.email?.message} />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Owner Phone</FieldLabel>
                    <FieldContent>
                      <PhoneInput {...form.register("owner.phone")} required
                      >
                        <PhoneInputCountrySelect />
                        <PhoneInputField />
                      </PhoneInput>
                      <FieldError message={(form.formState.errors as any).owner?.phone?.message} />
                    </FieldContent>
                  </Field>
                </div>
              </div>
            </>
          )}

          {isUpdate && (
            <Field>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(value) => form.setValue("status", value as "pending" | "active" | "suspended")}
                  defaultValue={currentRow?.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          )}
        </form>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Close</Button>} />
          <Button type="submit" form="tenants-form" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tenant"
                : "Create Tenant"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
