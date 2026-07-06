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
  useCreateTaxClass,
  useUpdateTaxClass,
} from "@/hooks/tenant/use-tax-class-query"
import { type TaxClass } from "@/types/tenant/tax-class"
import {
  storeTaxClassSchema,
  updateTaxClassSchema,
  type StoreTaxClassFormValues,
  type UpdateTaxClassFormValues,
} from "@/schemas/tenant/tax-class-schema"

type TaxClassesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: TaxClass
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

export function TaxClassesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: TaxClassesFormDialogProps) {
  const isUpdate = !!currentRow
  const createTaxClass = useCreateTaxClass()
  const updateTaxClass = useUpdateTaxClass()
  const isSubmitting = createTaxClass.isPending || updateTaxClass.isPending

  const schema = isUpdate ? updateTaxClassSchema : storeTaxClassSchema

  const form = useForm<StoreTaxClassFormValues | UpdateTaxClassFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      is_default: false,
      is_active: true,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code,
        description: currentRow.description || "",
        is_default: currentRow.is_default,
        is_active: currentRow.is_active,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        code: "",
        description: "",
        is_default: false,
        is_active: true,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StoreTaxClassFormValues | UpdateTaxClassFormValues) => {
    const payload = {
      ...data,
      description: data.description || null,
      is_default: data.is_default ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateTaxClass.mutate(
        { id: currentRow.id, taxClass: payload as UpdateTaxClassFormValues },
        {
          onSuccess: () => {
            toast.success("Tax class updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update tax class")
          },
        }
      )
    } else {
      createTaxClass.mutate(payload as StoreTaxClassFormValues, {
        onSuccess: () => {
          toast.success("Tax class created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create tax class")
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
            {isUpdate ? "Update" : "Create"} Tax Class
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the tax class details."
              : "Add a new tax class for your store."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="tax-classes-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Standard Rate"
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
                placeholder="standard"
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
                placeholder="Tax class description..."
                {...form.register("description")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Sort Order</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                {...form.register("sort_order", { valueAsNumber: true })}
              />
            </FieldContent>
          </Field>

          <div className="flex flex-wrap items-center gap-6">
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) =>
                  form.setValue("is_default", !!checked)
                }
              />
              <label htmlFor="is_default" className="text-sm font-medium">
                Default
              </label>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="tax-classes-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Tax Class"
                : "Create Tax Class"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
