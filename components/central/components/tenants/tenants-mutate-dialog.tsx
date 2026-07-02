"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
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
import {
  useCreateTenant,
  useUpdateTenant,
} from "@/hooks/central/use-tenant-query"
import { type Tenant } from "@/types/central/tenant"
import {
  tenantSchema,
  updateTenantSchema,
  type StoreTenantFormValues,
  type UpdateTenantFormValues,
} from "@/schemas/central/tenant-schema"
import { useGetPlanOptions } from "@/hooks/central/use-plan-query"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { PlanOption } from "@/types/central/plan"
import { PhoneInput } from "@/components/ui/phone-input"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group"

type TenantsMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Tenant
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
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
        plan_id: currentRow.plan_id ?? undefined,
        trial_ends_at: currentRow.trial_ends_at || "",
      }
      : {
        name: "",
        slug: "",
        email: "",
        phone: "",
        plan_id: undefined,
        trial_ends_at: "",
        subdomain: "",
        owner: { name: "", email: "", phone: "" },
      },
  })

  const planIdValue = form.watch("plan_id")
  const selectedPlan = React.useMemo(
    () => planOptions?.find((p) => p.value === planIdValue) ?? null,
    [planOptions, planIdValue]
  )

  // Watch the name field to automatically generate the slug
  const nameValue = form.watch("name")

  React.useEffect(() => {
    if (!isUpdate && nameValue) {
      // Convert name to a URL-friendly slug
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
        .replace(/(^-|-$)+/g, "") // Remove leading or trailing hyphens

      form.setValue("slug", generatedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [nameValue, isUpdate, form])

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
            handleFormApiError(
              error,
              form.setError,
              "Failed to update tenant"
            )
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
          handleFormApiError(error, form.setError, "Failed to create tenant")
        },
      })
    }
  }

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
                <FieldError
                  message={(form.formState.errors as any).slug?.message}
                />
              </FieldContent>
            </Field>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="contact@acme.inc"
                  {...form.register("email")}
                />
                <FieldError message={form.formState.errors.email?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <PhoneInput
                      placeholder="Enter phone number"
                      defaultCountry="NG"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
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
                  itemToStringValue={(plan: PlanOption) => plan.label}
                  value={selectedPlan}
                  onValueChange={(item) => {
                    form.setValue("plan_id", item ? item.value : null)
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
                <FieldError message={form.formState.errors.plan_id?.message} />
              </FieldContent>
            </Field>
            {isUpdate && (
              <Field>
                <FieldLabel>Trial Ends At</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="trial_ends_at"
                    render={({ field }) => (
                      <Input
                        type="datetime-local"
                        value={field.value ? field.value.substring(0, 16) : ""}
                        onChange={(e) => {
                          const val = e.target.value
                          field.onChange(val ? new Date(val).toISOString() : null)
                        }}
                      />
                    )}
                  />
                  <FieldError
                    message={form.formState.errors.trial_ends_at?.message}
                  />
                </FieldContent>
              </Field>
            )}
          </div>

          {!isUpdate && (
            <>
              <Field>
                <FieldLabel>Subdomain</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="acme"
                      {...form.register("subdomain")}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>.multi-tenants-api.test</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError
                    message={(form.formState.errors as any).subdomain?.message}
                  />
                </FieldContent>
              </Field>

              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  Owner Information
                </h3>

                <Field>
                  <FieldLabel>Owner Name *</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="John Doe"
                      {...form.register("owner.name")}
                    />
                    <FieldError
                      message={
                        (form.formState.errors as any).owner?.name?.message
                      }
                    />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Owner Email *</FieldLabel>
                    <FieldContent>
                      <Input
                        placeholder="john.doe@acme.inc"
                        {...form.register("owner.email")}
                      />
                      <FieldError
                        message={
                          (form.formState.errors as any).owner?.email?.message
                        }
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Owner Phone</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={form.control}
                        name="owner.phone"
                        render={({ field }) => (
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry="NG"
                            value={field.value ?? undefined}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <FieldError
                        message={
                          (form.formState.errors as any).owner?.phone?.message
                        }
                      />
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
                  onValueChange={(value) =>
                    form.setValue(
                      "status",
                      value as "pending" | "active" | "suspended"
                    )
                  }
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
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tenants-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
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