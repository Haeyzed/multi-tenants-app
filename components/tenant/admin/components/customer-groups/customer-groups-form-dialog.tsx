"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateCustomerGroup,
  useUpdateCustomerGroup,
} from "@/hooks/tenant/use-customer-group-query"
import { type CustomerGroup } from "@/types/tenant/customer-group"
import {
  type StoreCustomerGroupFormValues,
  storeCustomerGroupSchema,
  type UpdateCustomerGroupFormValues,
  updateCustomerGroupSchema,
} from "@/schemas/tenant/customer-group-schema"

type CustomerGroupsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: CustomerGroup
  onSuccess?: (group: CustomerGroup) => void
}

export function CustomerGroupsFormDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: CustomerGroupsFormDialogProps) {
  const isUpdate = !!currentRow
  const createGroup = useCreateCustomerGroup()
  const updateGroup = useUpdateCustomerGroup()
  const isSubmitting = createGroup.isPending || updateGroup.isPending
  const schema = isUpdate ? updateCustomerGroupSchema : storeCustomerGroupSchema

  const form = useForm<
    StoreCustomerGroupFormValues | UpdateCustomerGroupFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      discount_percentage: null,
      is_active: true,
    },
  })

  React.useEffect(() => {
    if (!open) return
    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || "",
        discount_percentage:
          currentRow.discount_percentage != null
            ? Number(currentRow.discount_percentage)
            : currentRow.discount_percent != null
              ? Number(currentRow.discount_percent)
              : null,
        is_active: currentRow.is_active,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        discount_percentage: null,
        is_active: true,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (
    data: StoreCustomerGroupFormValues | UpdateCustomerGroupFormValues
  ) => {
    const payload = {
      ...data,
      description: data.description || null,
      discount_percentage: data.discount_percentage ?? null,
    }

    if (isUpdate && currentRow) {
      updateGroup.mutate(
        { id: currentRow.id, group: payload as UpdateCustomerGroupFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(
              result.message,
              "Customer group updated successfully"
            )
            onSuccess?.(result.data)
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update customer group"
            )
          },
        }
      )
    } else {
      createGroup.mutate(payload as StoreCustomerGroupFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Customer group created successfully")
          onSuccess?.(result.data)
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create customer group"
          )
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
            {isUpdate ? "Update" : "Create"} Customer Group
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the customer group by providing necessary info."
              : "Add a new customer group by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="customer-groups-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Group name" {...form.register("name")} />
              {form.formState.errors.name?.message ? (
                <p className="mt-1 text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Group description..."
                {...form.register("description")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Discount %</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                {...form.register("discount_percentage", {
                  valueAsNumber: true,
                })}
              />
            </FieldContent>
          </Field>

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
          <Button
            type="submit"
            form="customer-groups-form"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Group"
                : "Create Group"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
