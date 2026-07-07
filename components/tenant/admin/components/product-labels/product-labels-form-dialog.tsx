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
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/ui/color-picker"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateProductLabel,
  useUpdateProductLabel,
} from "@/hooks/tenant/use-product-label-query"
import { type ProductLabel } from "@/types/tenant/product-label"
import {
  storeProductLabelSchema,
  updateProductLabelSchema,
  type StoreProductLabelFormValues,
  type UpdateProductLabelFormValues,
} from "@/schemas/tenant/product-label-schema"

type ProductLabelsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ProductLabel
  onCreated?: (label: ProductLabel) => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function ColorField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <ColorPicker
          value={value || "#3b82f6"}
          onValueChange={(nextValue) => onChange(nextValue || "")}
          defaultFormat="hex"
        >
          <div className="flex items-center gap-3">
            <ColorPickerTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 px-3"
                >
                  <ColorPickerSwatch className="size-4" />
                  {value || "Pick color"}
                </Button>
              }
            />
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("")}
              >
                Clear
              </Button>
            ) : null}
          </div>
          <ColorPickerContent>
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect />
              <ColorPickerInput />
            </div>
          </ColorPickerContent>
        </ColorPicker>
        <FieldError message={error} />
      </FieldContent>
    </Field>
  )
}

export function ProductLabelsFormDialog({
  open,
  onOpenChange,
  currentRow,
  onCreated,
}: ProductLabelsFormDialogProps) {
  const isUpdate = !!currentRow
  const createProductLabel = useCreateProductLabel()
  const updateProductLabel = useUpdateProductLabel()
  const isSubmitting =
    createProductLabel.isPending || updateProductLabel.isPending

  const schema = isUpdate ? updateProductLabelSchema : storeProductLabelSchema

  const form = useForm<StoreProductLabelFormValues | UpdateProductLabelFormValues>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        color: "",
        background_color: "",
        icon: "",
        is_active: true,
        sort_order: 0,
      },
    }
  )

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        color: currentRow.color || "",
        background_color: currentRow.background_color || "",
        icon: currentRow.icon || "",
        is_active: currentRow.is_active,
        sort_order: currentRow.sort_order ?? 0,
      })
    } else {
      form.reset({
        name: "",
        color: "",
        background_color: "",
        icon: "",
        is_active: true,
        sort_order: 0,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (
    data: StoreProductLabelFormValues | UpdateProductLabelFormValues
  ) => {
    const payload = {
      ...data,
      color: data.color || null,
      background_color: data.background_color || null,
      icon: data.icon || null,
      sort_order: data.sort_order ?? 0,
    }

    if (isUpdate && currentRow) {
      updateProductLabel.mutate(
        { id: currentRow.id, label: payload as UpdateProductLabelFormValues },
        {
          onSuccess: () => {
            toast.success("Product label updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update product label"
            )
          },
        }
      )
    } else {
      createProductLabel.mutate(payload as StoreProductLabelFormValues, {
        onSuccess: (created) => {
          toast.success("Product label created successfully")
          onCreated?.(created)
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create product label"
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
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Product Label
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the product label by providing necessary info."
              : "Add a new product label by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="product-labels-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Label name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <ColorField
            label="Text Color"
            value={form.watch("color") || ""}
            onChange={(value) =>
              form.setValue("color", value, { shouldDirty: true })
            }
            error={form.formState.errors.color?.message}
          />

          <ColorField
            label="Background Color"
            value={form.watch("background_color") || ""}
            onChange={(value) =>
              form.setValue("background_color", value, { shouldDirty: true })
            }
            error={form.formState.errors.background_color?.message}
          />

          <Field>
            <FieldLabel>Icon</FieldLabel>
            <FieldContent>
              <Input placeholder="lucide-tag" {...form.register("icon")} />
              <FieldError message={form.formState.errors.icon?.message} />
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
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button
            type="submit"
            form="product-labels-form"
            disabled={isSubmitting}
          >
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Label"
                : "Create Label"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
