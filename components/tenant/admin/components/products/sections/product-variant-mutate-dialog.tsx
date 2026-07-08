"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { handleFormApiError } from "@/lib/form-api-errors"
import { useGetUnitOptions } from "@/hooks/tenant/use-unit-query"
import {
  useCreateProductVariant,
  useUpdateProductVariant,
} from "@/hooks/tenant/use-product-variant-query"
import {
  type StoreProductVariantFormValues,
  storeProductVariantSchema,
  type UpdateProductVariantFormValues,
  updateProductVariantSchema,
} from "@/schemas/tenant/product-schema"
import { type ProductVariant } from "@/types/tenant/product"
import { type UnitOption } from "@/types/tenant/unit"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { FieldError } from "./product-form-shared"

type ProductVariantMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  variant?: ProductVariant | null
}

export function ProductVariantMutateDialog({
  open,
  onOpenChange,
  productId,
  variant,
}: ProductVariantMutateDialogProps) {
  const isUpdate = !!variant
  const createVariant = useCreateProductVariant(productId)
  const updateVariant = useUpdateProductVariant(productId)
  const isSubmitting = createVariant.isPending || updateVariant.isPending
  const { data: unitOptions = [] } = useGetUnitOptions()

  const weightUnits = (unitOptions as UnitOption[]).filter(
    (unit) => unit.type === "weight"
  )
  const dimensionUnits = (unitOptions as UnitOption[]).filter(
    (unit) => unit.type === "length"
  )

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  )

  const form = useForm<
    StoreProductVariantFormValues | UpdateProductVariantFormValues
  >({
    resolver: zodResolver(
      isUpdate ? updateProductVariantSchema : storeProductVariantSchema
    ),
    defaultValues: {
      title: "",
      sku: "",
      price: 0,
      compare_at_price: null,
      cost_price: null,
      barcode: null,
      is_default: false,
      weight: null,
      length: null,
      width: null,
      height: null,
      weight_unit_id: null,
      dimension_unit_id: null,
      image_media_id: null,
      inventory: { quantity: 0 },
    },
  })

  const weightUnitId = form.watch("weight_unit_id")
  const dimensionUnitId = form.watch("dimension_unit_id")
  const selectedWeightUnit =
    weightUnits.find((unit) => unit.value === weightUnitId) ?? null
  const selectedDimensionUnit =
    dimensionUnits.find((unit) => unit.value === dimensionUnitId) ?? null

  React.useEffect(() => {
    if (!open) return

    if (variant) {
      const variantImage =
        variant.image_media ??
        (variant as ProductVariant & { image?: ProductVariant["image_media"] })
          .image ??
        null

      setImagePreviewUrl(
        variantImage?.url ? resolveTenantMediaUrl(variantImage) : null
      )
      form.reset({
        title: variant.title,
        sku: variant.sku,
        price: Number(variant.price),
        compare_at_price: variant.compare_at_price
          ? Number(variant.compare_at_price)
          : null,
        cost_price: variant.cost_price ? Number(variant.cost_price) : null,
        barcode: variant.barcode ?? null,
        is_default: variant.is_default ?? false,
        weight: variant.weight ? Number(variant.weight) : null,
        length: variant.length ? Number(variant.length) : null,
        width: variant.width ? Number(variant.width) : null,
        height: variant.height ? Number(variant.height) : null,
        weight_unit_id: variant.weight_unit_id ?? null,
        dimension_unit_id: variant.dimension_unit_id ?? null,
        image_media_id: variant.image_media_id ?? variantImage?.id ?? null,
        inventory: {
          quantity: variant.inventories?.[0]?.quantity ?? 0,
          reorder_level: variant.inventories?.[0]?.reorder_level ?? null,
        },
      })
      return
    }

    setImagePreviewUrl(null)
    form.reset({
      title: "",
      sku: "",
      price: 0,
      compare_at_price: null,
      cost_price: null,
      barcode: null,
      is_default: false,
      weight: null,
      length: null,
      width: null,
      height: null,
      weight_unit_id: null,
      dimension_unit_id: null,
      image_media_id: null,
      inventory: { quantity: 0 },
    })
  }, [open, variant, form])

  const onSubmit = (
    data: StoreProductVariantFormValues | UpdateProductVariantFormValues
  ) => {
    if (isUpdate && variant) {
      updateVariant.mutate(
        { variantId: variant.id, payload: data },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Variant updated")
            onOpenChange(false)
          },
          onError: (error) =>
            handleFormApiError(
              error,
              form.setError,
              "Failed to update variant"
            ),
        }
      )
      return
    }

    createVariant.mutate(data as StoreProductVariantFormValues, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, "Variant created")
        onOpenChange(false)
      },
      onError: (error) =>
        handleFormApiError(error, form.setError, "Failed to create variant"),
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit variant" : "Add variant"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Configure sellable variant details including SKU, pricing, image,
            shipping, and stock.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input placeholder="Red / Large" {...form.register("title")} />
              <FieldError message={form.formState.errors.title?.message} />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>SKU</FieldLabel>
              <FieldContent>
                <Input placeholder="SKU-001-RED-L" {...form.register("sku")} />
                <FieldError message={form.formState.errors.sku?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Price</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("price", { valueAsNumber: true })}
                />
                <FieldError message={form.formState.errors.price?.message} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Compare-at price</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("compare_at_price", {
                    setValueAs: (value) =>
                      value === "" || value === null ? null : Number(value),
                  })}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Cost price</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...form.register("cost_price", {
                    setValueAs: (value) =>
                      value === "" || value === null ? null : Number(value),
                  })}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Quantity</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...form.register("inventory.quantity", {
                    valueAsNumber: true,
                  })}
                />
              </FieldContent>
            </Field>
          </div>

          <MediaPickerField
            label="Variant image"
            value={form.watch("image_media_id") ?? null}
            previewUrl={
              imagePreviewUrl ??
              (variant?.image_media?.url
                ? resolveTenantMediaUrl(variant.image_media)
                : null)
            }
            previewTitle={variant?.image_media?.name ?? variant?.title ?? null}
            onChange={(mediaId, media) => {
              form.setValue("image_media_id", mediaId, { shouldDirty: true })
              setImagePreviewUrl(
                media?.url ? resolveTenantMediaUrl(media) : null
              )
            }}
            accept="image/*"
          />

          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Weight</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register("weight", {
                        setValueAs: (value) =>
                          value === "" || value === null ? null : Number(value),
                      })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Weight unit</FieldLabel>
                  <FieldContent>
                    <Combobox
                      items={weightUnits}
                      itemToStringValue={(item) =>
                        `${item.label} (${item.symbol})`
                      }
                      value={selectedWeightUnit}
                      onValueChange={(item) => {
                        form.setValue(
                          "weight_unit_id",
                          item ? item.value : null,
                          { shouldDirty: true }
                        )
                      }}
                    >
                      <ComboboxInput placeholder="Select unit..." />
                      <ComboboxContent>
                        <ComboboxEmpty>No units found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              {item.label} ({item.symbol})
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </FieldContent>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel>Length</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register("length", {
                        setValueAs: (value) =>
                          value === "" || value === null ? null : Number(value),
                      })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Width</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register("width", {
                        setValueAs: (value) =>
                          value === "" || value === null ? null : Number(value),
                      })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Height</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.01"
                      {...form.register("height", {
                        setValueAs: (value) =>
                          value === "" || value === null ? null : Number(value),
                      })}
                    />
                  </FieldContent>
                </Field>
              </div>
              <Field>
                <FieldLabel>Dimension unit</FieldLabel>
                <FieldContent>
                  <Combobox
                    items={dimensionUnits}
                    itemToStringValue={(item) =>
                      `${item.label} (${item.symbol})`
                    }
                    value={selectedDimensionUnit}
                    onValueChange={(item) => {
                      form.setValue(
                        "dimension_unit_id",
                        item ? item.value : null,
                        { shouldDirty: true }
                      )
                    }}
                  >
                    <ComboboxInput placeholder="Select unit..." />
                    <ComboboxContent>
                      <ComboboxEmpty>No units found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label} ({item.symbol})
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="variant_is_default"
              checked={form.watch("is_default")}
              onCheckedChange={(checked) =>
                form.setValue("is_default", !!checked)
              }
            />
            <label htmlFor="variant_is_default" className="text-sm font-medium">
              Set as default variant
            </label>
          </div>

          <ResponsiveDialogFooter className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {isUpdate ? "Save variant" : "Create variant"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
