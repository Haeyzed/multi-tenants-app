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
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateAttribute,
  useUpdateAttribute,
} from "@/hooks/tenant/use-attribute-query"
import {
  type Attribute,
  type AttributeDisplayType,
  type AttributeType,
} from "@/types/tenant/attribute"
import {
  storeAttributeSchema,
  updateAttributeSchema,
  type StoreAttributeFormValues,
  type UpdateAttributeFormValues,
} from "@/schemas/tenant/attribute-schema"

type AttributeTypeOption = { label: string; value: AttributeType }
type AttributeDisplayTypeOption = {
  label: string
  value: AttributeDisplayType
}

const attributeTypeOptions: AttributeTypeOption[] = [
  { label: "Select", value: "select" },
  { label: "Text", value: "text" },
  { label: "Textarea", value: "textarea" },
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Color", value: "color" },
]

const attributeDisplayTypeOptions: AttributeDisplayTypeOption[] = [
  { label: "Dropdown", value: "dropdown" },
  { label: "Swatch", value: "swatch" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Text Input", value: "text_input" },
]

type AttributesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Attribute
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function AttributesFormDialog({
  open,
  onOpenChange,
  currentRow,
}: AttributesFormDialogProps) {
  const isUpdate = !!currentRow
  const createAttribute = useCreateAttribute()
  const updateAttribute = useUpdateAttribute()
  const isSubmitting = createAttribute.isPending || updateAttribute.isPending

  const schema = isUpdate ? updateAttributeSchema : storeAttributeSchema

  const form = useForm<StoreAttributeFormValues | UpdateAttributeFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      type: "select",
      display_type: "dropdown",
      description: "",
      is_filterable: false,
      is_visible_on_product: true,
      is_visible_on_listing: true,
      is_required: false,
      is_variant: false,
      is_user_defined: false,
      sort_order: 0,
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code || "",
        type: currentRow.type,
        display_type: currentRow.display_type,
        description: currentRow.description || "",
        is_filterable: currentRow.is_filterable,
        is_visible_on_product: currentRow.is_visible_on_product,
        is_visible_on_listing: currentRow.is_visible_on_listing,
        is_required: currentRow.is_required,
        is_variant: currentRow.is_variant,
        is_user_defined: currentRow.is_user_defined,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        code: "",
        type: "select",
        display_type: "dropdown",
        description: "",
        is_filterable: false,
        is_visible_on_product: true,
        is_visible_on_listing: true,
        is_required: false,
        is_variant: false,
        is_user_defined: false,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const typeValue = form.watch("type")
  const displayTypeValue = form.watch("display_type")

  const selectedType =
    attributeTypeOptions.find((item) => item.value === typeValue) ??
    attributeTypeOptions[0]

  const selectedDisplayType =
    attributeDisplayTypeOptions.find((item) => item.value === displayTypeValue) ??
    attributeDisplayTypeOptions[0]

  const onSubmit = (data: StoreAttributeFormValues | UpdateAttributeFormValues) => {
    const payload = {
      ...data,
      code: data.code || null,
      description: data.description || null,
      is_filterable: data.is_filterable ?? false,
      is_visible_on_product: data.is_visible_on_product ?? true,
      is_visible_on_listing: data.is_visible_on_listing ?? true,
      is_required: data.is_required ?? false,
      is_variant: data.is_variant ?? false,
      is_user_defined: data.is_user_defined ?? false,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateAttribute.mutate(
        { id: currentRow.id, attribute: payload as UpdateAttributeFormValues },
        {
          onSuccess: () => {
            toast.success("Attribute updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update attribute")
          },
        }
      )
    } else {
      createAttribute.mutate(payload as StoreAttributeFormValues, {
        onSuccess: () => {
          toast.success("Attribute created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create attribute")
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
            {isUpdate ? "Update" : "Create"} Attribute
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the attribute by providing necessary info."
              : "Add a new attribute by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="attributes-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Attribute name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Code</FieldLabel>
            <FieldContent>
              <Input
                placeholder="color"
                className="font-mono"
                {...form.register("code")}
              />
              <FieldError message={form.formState.errors.code?.message} />
            </FieldContent>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Type *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={attributeTypeOptions}
                  itemToStringValue={(item) => item.label}
                  value={selectedType}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("type", item.value)
                  }}
                >
                  <ComboboxInput placeholder="Select attribute type..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No types found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError message={form.formState.errors.type?.message} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Display Type *</FieldLabel>
              <FieldContent>
                <Combobox
                  items={attributeDisplayTypeOptions}
                  itemToStringValue={(item) => item.label}
                  value={selectedDisplayType}
                  onValueChange={(item) => {
                    if (!item) return
                    form.setValue("display_type", item.value)
                  }}
                >
                  <ComboboxInput placeholder="Select display type..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No display types found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <FieldError
                  message={form.formState.errors.display_type?.message}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Attribute description..."
                {...form.register("description")}
              />
              <FieldError message={form.formState.errors.description?.message} />
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_filterable"
                checked={form.watch("is_filterable")}
                onCheckedChange={(checked) =>
                  form.setValue("is_filterable", !!checked)
                }
              />
              <label htmlFor="is_filterable" className="text-sm font-medium">
                Filterable
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_visible_on_product"
                checked={form.watch("is_visible_on_product")}
                onCheckedChange={(checked) =>
                  form.setValue("is_visible_on_product", !!checked)
                }
              />
              <label
                htmlFor="is_visible_on_product"
                className="text-sm font-medium"
              >
                Visible on product
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_visible_on_listing"
                checked={form.watch("is_visible_on_listing")}
                onCheckedChange={(checked) =>
                  form.setValue("is_visible_on_listing", !!checked)
                }
              />
              <label
                htmlFor="is_visible_on_listing"
                className="text-sm font-medium"
              >
                Visible on listing
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_required"
                checked={form.watch("is_required")}
                onCheckedChange={(checked) =>
                  form.setValue("is_required", !!checked)
                }
              />
              <label htmlFor="is_required" className="text-sm font-medium">
                Required
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_variant"
                checked={form.watch("is_variant")}
                onCheckedChange={(checked) =>
                  form.setValue("is_variant", !!checked)
                }
              />
              <label htmlFor="is_variant" className="text-sm font-medium">
                Variant
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_user_defined"
                checked={form.watch("is_user_defined")}
                onCheckedChange={(checked) =>
                  form.setValue("is_user_defined", !!checked)
                }
              />
              <label htmlFor="is_user_defined" className="text-sm font-medium">
                User defined
              </label>
            </div>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="attributes-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Attribute"
                : "Create Attribute"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
