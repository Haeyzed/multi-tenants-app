"use client"

import * as React from "react"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useUpdateProductVariant } from "@/hooks/tenant/use-product-variant-query"
import { type ProductPriceTierFormValues } from "@/schemas/tenant/product-schema"
import { type ProductVariant } from "@/types/tenant/product"
import { ProductPriceTiersEditor } from "./product-price-tiers-editor"

type ProductVariantPriceTiersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: number
  variant: ProductVariant | null
}

function mapVariantPriceTiers(
  variant: ProductVariant | null
): ProductPriceTierFormValues[] {
  return (
    variant?.price_tiers?.map((tier) => ({
      id: tier.id,
      min_quantity: tier.min_quantity,
      max_quantity: tier.max_quantity ?? null,
      price: Number(tier.price),
      customer_group_id: tier.customer_group_id ?? null,
      starts_at: tier.starts_at ?? null,
      ends_at: tier.ends_at ?? null,
    })) ?? []
  )
}

export function ProductVariantPriceTiersDialog({
  open,
  onOpenChange,
  productId,
  variant,
}: ProductVariantPriceTiersDialogProps) {
  const updateVariant = useUpdateProductVariant(productId)
  const [tiers, setTiers] = React.useState<ProductPriceTierFormValues[]>([])

  React.useEffect(() => {
    if (!open) return
    setTiers(mapVariantPriceTiers(variant))
  }, [open, variant])

  const handleSave = () => {
    if (!variant) return

    updateVariant.mutate(
      {
        variantId: variant.id,
        payload: { price_tiers: tiers },
      },
      {
        onSuccess: (response) => {
          toastApiSuccess(response.message, "Price tiers saved")
          onOpenChange(false)
        },
        onError: (error) => toastApiError(error, "Failed to save price tiers"),
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="flex max-h-[min(90dvh,800px)] flex-col overflow-hidden sm:max-w-4xl">
        <ResponsiveDialogHeader className="shrink-0">
          <ResponsiveDialogTitle>
            Price tiers{variant ? ` — ${variant.title}` : ""}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Configure quantity-based pricing for this variant.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ProductPriceTiersEditor tiers={tiers} onChange={setTiers} />
        </div>

        <ResponsiveDialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!variant || updateVariant.isPending}
          >
            {updateVariant.isPending && <Spinner />}
            Save tiers
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
