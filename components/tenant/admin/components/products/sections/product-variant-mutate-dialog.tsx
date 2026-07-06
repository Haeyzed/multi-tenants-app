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
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateProductVariant,
  useUpdateProductVariant,
} from "@/hooks/tenant/use-product-variant-query"
import {
  storeProductVariantSchema,
  updateProductVariantSchema,
  type StoreProductVariantFormValues,
  type UpdateProductVariantFormValues,
} from "@/schemas/tenant/product-schema"
import { type ProductVariant } from "@/types/tenant/product"
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

  const form = useForm<StoreProductVariantFormValues | UpdateProductVariantFormValues>({
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
      inventory: { quantity: 0 },
    },
  })

  React.useEffect(() => {
    if (!open) return

    if (variant) {
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
        inventory: {
          quantity: variant.inventories?.[0]?.quantity ?? 0,
          reorder_level: variant.inventories?.[0]?.reorder_level ?? null,
        },
      })
      return
    }

    form.reset({
      title: "",
      sku: "",
      price: 0,
      compare_at_price: null,
      cost_price: null,
      barcode: null,
      is_default: false,
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
          onSuccess: () => {
            toast.success("Variant updated")
            onOpenChange(false)
          },
          onError: (error) =>
            handleFormApiError(error, form.setError, "Failed to update variant"),
        }
      )
      return
    }

    createVariant.mutate(data as StoreProductVariantFormValues, {
      onSuccess: () => {
        toast.success("Variant created")
        onOpenChange(false)
      },
      onError: (error) =>
        handleFormApiError(error, form.setError, "Failed to create variant"),
    })
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Edit variant" : "Add variant"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Configure sellable variant details including SKU, pricing, and stock.
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
