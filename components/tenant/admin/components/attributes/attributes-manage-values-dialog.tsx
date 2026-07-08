"use client"

import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateAttributeValue,
  useDeleteAttributeValue,
  useGetAttributeValues,
  useUpdateAttributeValue,
} from "@/hooks/tenant/use-attribute-query"
import { type Attribute, type AttributeValue } from "@/types/tenant/attribute"
import {
  type StoreAttributeValueFormValues,
  storeAttributeValueSchema,
  type UpdateAttributeValueFormValues,
  updateAttributeValueSchema,
} from "@/schemas/tenant/attribute-schema"

type AttributesManageValuesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  attribute: Attribute
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function AttributesManageValuesDialog({
  open,
  onOpenChange,
  attribute,
}: AttributesManageValuesDialogProps) {
  const { data: values = [], isLoading } = useGetAttributeValues(
    attribute.id,
    open
  )
  const createValue = useCreateAttributeValue(attribute.id)
  const updateValue = useUpdateAttributeValue(attribute.id)
  const deleteValue = useDeleteAttributeValue(attribute.id)

  const [formOpen, setFormOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<AttributeValue | null>(null)
  const [deletingValue, setDeletingValue] = useState<AttributeValue | null>(
    null
  )

  const isUpdate = !!editingValue
  const schema = isUpdate
    ? updateAttributeValueSchema
    : storeAttributeValueSchema

  const form = useForm<
    StoreAttributeValueFormValues | UpdateAttributeValueFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      value: "",
      color_hex: "",
      description: "",
      is_default: false,
      sort_order: 0,
    },
  })

  const openCreateForm = () => {
    setEditingValue(null)
    form.reset({
      value: "",
      color_hex: "",
      description: "",
      is_default: false,
      sort_order: 0,
    })
    setFormOpen(true)
  }

  const openEditForm = (value: AttributeValue) => {
    setEditingValue(value)
    form.reset({
      value: value.value,
      color_hex: value.color_hex || "",
      description: value.description || "",
      is_default: value.is_default,
      sort_order: value.sort_order ?? 0,
    })
    setFormOpen(true)
  }

  const onSubmit = (
    data: StoreAttributeValueFormValues | UpdateAttributeValueFormValues
  ) => {
    const payload = {
      ...data,
      color_hex: data.color_hex || null,
      description: data.description || null,
      is_default: data.is_default ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && editingValue) {
      updateValue.mutate(
        { valueId: editingValue.id, value: payload },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Value updated successfully")
            setFormOpen(false)
            setEditingValue(null)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update value")
          },
        }
      )
    } else {
      createValue.mutate(payload as StoreAttributeValueFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Value created successfully")
          setFormOpen(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create value")
        },
      })
    }
  }

  const handleDelete = () => {
    if (!deletingValue) return
    deleteValue.mutate(deletingValue.id, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Value deleted successfully")
        setDeletingValue(null)
      },
      onError: (error) => toastApiError(error, "Failed to delete value"),
    })
  }

  const isSubmitting = createValue.isPending || updateValue.isPending

  return (
    <>
      <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] flex-col gap-0 overflow-hidden sm:max-w-3xl">
          <ResponsiveDialogHeader className="shrink-0">
            <ResponsiveDialogTitle>Manage Values</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Values for &quot;{attribute.name}&quot;
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="flex shrink-0 justify-end">
            <Button size="sm" onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Value
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-2">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : values.length === 0 ? (
              <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                No values yet. Add one to get started.
              </p>
            ) : (
              <div className="max-h-[min(50dvh,360px)] overflow-auto rounded-md border">
                <div className="min-w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Value</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Sort</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {values.map((value) => (
                        <TableRow key={value.id}>
                          <TableCell className="font-medium">
                            {value.value}
                          </TableCell>
                          <TableCell>
                            {value.color_hex ? (
                              <div className="flex items-center gap-2">
                                <span
                                  className="inline-block size-4 rounded border"
                                  style={{ backgroundColor: value.color_hex }}
                                />
                                <span className="font-mono text-xs text-muted-foreground">
                                  {value.color_hex}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="max-w-40 truncate">
                            {value.description || "—"}
                          </TableCell>
                          <TableCell>
                            {value.is_default ? (
                              <Badge variant="secondary">Default</Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>{value.sort_order}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEditForm(value)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeletingValue(value)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <ResponsiveDialogFooter className="shrink-0">
            <ResponsiveDialogClose
              render={<Button variant="outline">Close</Button>}
            />
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={formOpen}
        onOpenChange={(val) => {
          setFormOpen(val)
          if (!val) {
            setEditingValue(null)
            form.reset()
          }
        }}
      >
        <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              {isUpdate ? "Edit" : "Add"} Value
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              {isUpdate
                ? "Update attribute value details."
                : "Add a new value for this attribute."}
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            id="attribute-value-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Value *</FieldLabel>
              <FieldContent>
                <Input placeholder="Red" {...form.register("value")} />
                <FieldError message={form.formState.errors.value?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Color Hex</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="#FF0000"
                  className="font-mono"
                  {...form.register("color_hex")}
                />
                <FieldError
                  message={form.formState.errors.color_hex?.message}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Textarea
                  placeholder="Value description..."
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={form.watch("is_default")}
                onCheckedChange={(checked) =>
                  form.setValue("is_default", !!checked)
                }
              />
              <label htmlFor="is_default" className="text-sm font-medium">
                Default value
              </label>
            </div>
          </form>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              type="submit"
              form="attribute-value-form"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting
                ? "Saving..."
                : isUpdate
                  ? "Update Value"
                  : "Add Value"}
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={!!deletingValue}
        onOpenChange={(val) => {
          if (!val) setDeletingValue(null)
        }}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Delete value?</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              You are about to delete &quot;{deletingValue?.value}&quot;. This
              action cannot be undone.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteValue.isPending}
            >
              {deleteValue.isPending && <Spinner />}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
