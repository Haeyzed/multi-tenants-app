"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toastApiSuccess } from "@/lib/toast-api"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { PhoneInput } from "@/components/ui/phone-input"
import { Spinner } from "@/components/ui/spinner"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateTenant,
  useUpdateTenant,
} from "@/hooks/central/use-tenant-query"
import { useGetPlanOptions } from "@/hooks/central/use-plan-query"
import { type PlanOption } from "@/types/central/plan"
import { type Tenant, type TenantStatus } from "@/types/central/tenant"
import {
  type StoreTenantFormValues,
  tenantSchema,
  type UpdateTenantFormValues,
  updateTenantSchema,
} from "@/schemas/central/tenant-schema"

type TenantsMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Tenant
}

type StatusOption = { label: string; value: TenantStatus }

const statusOptions: StatusOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function parseDateString(value?: string | null): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function TenantsMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: TenantsMutateDialogProps) {
  const isUpdate = !!currentRow
  const createTenant = useCreateTenant()
  const updateTenant = useUpdateTenant()
  const { data: planOptions = [] } = useGetPlanOptions()
  const isSubmitting = createTenant.isPending || updateTenant.isPending
  const schema = isUpdate ? updateTenantSchema : tenantSchema

  const form = useForm<StoreTenantFormValues | UpdateTenantFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      email: "",
      phone: "",
      plan_id: null,
      trial_ends_at: null,
      subdomain: "",
      status: "pending",
      owner: { name: "", email: "", phone: "" },
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        email: currentRow.email || "",
        phone: currentRow.phone || "",
        plan_id: currentRow.plan_id,
        trial_ends_at: currentRow.trial_ends_at,
        status: currentRow.status,
      })
    } else {
      form.reset({
        name: "",
        slug: "",
        email: "",
        phone: "",
        plan_id: null,
        trial_ends_at: null,
        subdomain: "",
        status: "pending",
        owner: { name: "", email: "", phone: "" },
      })
    }
  }, [open, currentRow, form])

  const nameValue = form.watch("name")

  React.useEffect(() => {
    if (isUpdate || !nameValue) return

    const generatedSlug = nameValue
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

    form.setValue("slug", generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [nameValue, isUpdate, form])

  const planId = form.watch("plan_id")
  const selectedPlan = planOptions.find((plan) => plan.value === planId) ?? null

  const status = form.watch("status")
  const selectedStatus =
    statusOptions.find((item) => item.value === status) ?? statusOptions[0]

  const trialEndsAt = form.watch("trial_ends_at")
  const selectedTrialEndsAt = parseDateString(trialEndsAt)

  const onSubmit = (data: StoreTenantFormValues | UpdateTenantFormValues) => {
    const payload = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      plan_id: data.plan_id ?? null,
      trial_ends_at: data.trial_ends_at || null,
    }

    if (isUpdate && currentRow) {
      updateTenant.mutate(
        { id: currentRow.id, tenant: payload as UpdateTenantFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Tenant updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update tenant")
          },
        }
      )
    } else {
      createTenant.mutate(payload as StoreTenantFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Tenant created successfully")
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
                  message={
                    (form.formState.errors as { slug?: { message?: string } })
                      .slug?.message
                  }
                />
              </FieldContent>
            </Field>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
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
                  items={planOptions}
                  itemToStringValue={(plan: PlanOption) => plan.label}
                  value={selectedPlan}
                  onValueChange={(item) => {
                    form.setValue("plan_id", item ? item.value : null)
                  }}
                >
                  <ComboboxInput placeholder="Select a plan..." showClear />
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
                  <DatePicker
                    selected={selectedTrialEndsAt}
                    onSelect={(date) => {
                      form.setValue(
                        "trial_ends_at",
                        date ? date.toISOString() : null
                      )
                    }}
                    placeholder="Pick trial end date"
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
                    message={
                      (
                        form.formState.errors as {
                          subdomain?: { message?: string }
                        }
                      ).subdomain?.message
                    }
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
                        (
                          form.formState.errors as {
                            owner?: { name?: { message?: string } }
                          }
                        ).owner?.name?.message
                      }
                    />
                  </FieldContent>
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel>Owner Email *</FieldLabel>
                    <FieldContent>
                      <Input
                        type="email"
                        placeholder="john.doe@acme.inc"
                        {...form.register("owner.email")}
                      />
                      <FieldError
                        message={
                          (
                            form.formState.errors as {
                              owner?: { email?: { message?: string } }
                            }
                          ).owner?.email?.message
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
                          (
                            form.formState.errors as {
                              owner?: { phone?: { message?: string } }
                            }
                          ).owner?.phone?.message
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
                <Combobox
                  items={statusOptions}
                  itemToStringValue={(item) => item.label}
                  value={selectedStatus}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("status", item.value)
                  }}
                >
                  <ComboboxInput placeholder="Select status..." showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>No statuses found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError message={form.formState.errors.status?.message} />
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
