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
  useCreateAttributeSet,
  useUpdateAttributeSet,
} from "@/hooks/tenant/use-attribute-set-query"
import { type AttributeSet } from "@/types/tenant/attribute-set"
import {
  type StoreAttributeSetFormValues,
  storeAttributeSetSchema,
  type UpdateAttributeSetFormValues,
  updateAttributeSetSchema,
} from "@/schemas/tenant/attribute-set-schema"

type AttributeSetsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: AttributeSet
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function AttributeSetsFormDialog({
  open,
  onOpenChange,
  currentRow,
}: AttributeSetsFormDialogProps) {
  const isUpdate = !!currentRow
  const createAttributeSet = useCreateAttributeSet()
  const updateAttributeSet = useUpdateAttributeSet()
  const isSubmitting =
    createAttributeSet.isPending || updateAttributeSet.isPending

  const schema = isUpdate ? updateAttributeSetSchema : storeAttributeSetSchema

  const form = useForm<
    StoreAttributeSetFormValues | UpdateAttributeSetFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || "",
        is_active: currentRow.is_active,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        description: "",
        is_active: true,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (
    data: StoreAttributeSetFormValues | UpdateAttributeSetFormValues
  ) => {
    const payload = {
      ...data,
      description: data.description || null,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateAttributeSet.mutate(
        {
          id: currentRow.id,
          attributeSet: payload as UpdateAttributeSetFormValues,
        },
        {
          onSuccess: (result) => {
            toastApiSuccess(
              result.message,
              "Attribute set updated successfully"
            )
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update attribute set"
            )
          },
        }
      )
    } else {
      createAttributeSet.mutate(payload as StoreAttributeSetFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Attribute set created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create attribute set"
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
            {isUpdate ? "Update" : "Create"} Attribute Set
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the attribute set by providing necessary info."
              : "Add a new attribute set by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="attribute-sets-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Attribute set name"
                {...form.register("name")}
              />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Attribute set description..."
                {...form.register("description")}
              />
              <FieldError
                message={form.formState.errors.description?.message}
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
            form="attribute-sets-form"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Attribute Set"
                : "Create Attribute Set"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
