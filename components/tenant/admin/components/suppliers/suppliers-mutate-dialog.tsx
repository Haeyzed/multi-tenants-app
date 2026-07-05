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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateSupplier,
  useUpdateSupplier,
} from "@/hooks/tenant/use-supplier-query"
import { type Supplier } from "@/types/tenant/supplier"
import {
  storeSupplierSchema,
  updateSupplierSchema,
  type StoreSupplierFormValues,
  type UpdateSupplierFormValues,
} from "@/schemas/tenant/supplier-schema"

type SuppliersMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Supplier
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function slugifyCode(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

export function SuppliersMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: SuppliersMutateDialogProps) {
  const isUpdate = !!currentRow
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()
  const isSubmitting = createSupplier.isPending || updateSupplier.isPending

  const schema = isUpdate ? updateSupplierSchema : storeSupplierSchema

  const form = useForm<StoreSupplierFormValues | UpdateSupplierFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      website_url: "",
      tax_id: "",
      registration_number: "",
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code,
        description: currentRow.description || "",
        contact_name: currentRow.contact_name || "",
        contact_email: currentRow.contact_email || "",
        contact_phone: currentRow.contact_phone || "",
        website_url: currentRow.website_url || "",
        tax_id: currentRow.tax_id || "",
        registration_number: currentRow.registration_number || "",
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        website_url: "",
        tax_id: "",
        registration_number: "",
        is_active: true,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StoreSupplierFormValues | UpdateSupplierFormValues) => {
    const payload = {
      ...data,
      description: data.description || null,
      contact_name: data.contact_name || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
      website_url: data.website_url || null,
      tax_id: data.tax_id || null,
      registration_number: data.registration_number || null,
    }

    if (isUpdate && currentRow) {
      updateSupplier.mutate(
        { id: currentRow.id, supplier: payload as UpdateSupplierFormValues },
        {
          onSuccess: () => {
            toast.success("Supplier updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update supplier")
          },
        }
      )
    } else {
      createSupplier.mutate(payload as StoreSupplierFormValues, {
        onSuccess: () => {
          toast.success("Supplier created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create supplier")
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
            {isUpdate ? "Update" : "Create"} Supplier
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the supplier details."
              : "Add a new supplier for your store."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="suppliers-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Acme Supplies"
                {...form.register("name", {
                  onChange: (event) => {
                    if (!isUpdate && !form.getValues("code")) {
                      form.setValue("code", slugifyCode(event.target.value))
                    }
                  },
                })}
              />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Code *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="acme_supplies"
                className="font-mono"
                {...form.register("code")}
              />
              <FieldError message={form.formState.errors.code?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Supplier description..."
                {...form.register("description")}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Contact Name</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="John Doe"
                  {...form.register("contact_name")}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Contact Email</FieldLabel>
              <FieldContent>
                <Input
                  type="email"
                  placeholder="contact@example.com"
                  {...form.register("contact_email")}
                />
                <FieldError
                  message={form.formState.errors.contact_email?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Contact Phone</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="+1 555 000 0000"
                  {...form.register("contact_phone")}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Website</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="https://example.com"
                  {...form.register("website_url")}
                />
                <FieldError
                  message={form.formState.errors.website_url?.message}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Tax ID</FieldLabel>
              <FieldContent>
                <Input placeholder="Tax ID" {...form.register("tax_id")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Registration Number</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="Registration number"
                  {...form.register("registration_number")}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(checked) =>
                form.setValue("is_active", !!checked)
              }
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active
            </label>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="suppliers-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Supplier"
                : "Create Supplier"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
