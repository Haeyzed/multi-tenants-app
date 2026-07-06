"use client"

import * as React from "react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { useGetProductOptions } from "@/hooks/tenant/use-product-query"
import { useSyncProductRelations } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductRelationsSchema,
  type SyncProductRelationsFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"

type ProductRelatedSectionProps = {
  product: Product
}

function mapProductRelations(product: Product): SyncProductRelationsFormValues {
  return {
    related_product_ids: product.related_products?.map((item) => item.id) ?? [],
    cross_sell_product_ids:
      product.cross_sell_products?.map((item) => item.id) ?? [],
    up_sell_product_ids: product.up_sell_products?.map((item) => item.id) ?? [],
  }
}

type RelationListProps = {
  label: string
  description: string
  selectedIds: number[]
  options: { label: string; value: number }[]
  onToggle: (productId: number, checked: boolean) => void
}

function RelationList({
  label,
  description,
  selectedIds,
  options,
  onToggle,
}: RelationListProps) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <p className="mb-2 text-sm text-muted-foreground">{description}</p>
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No other products available.
            </p>
          ) : (
            options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${label}-${option.value}`}
                  checked={selectedIds.includes(option.value)}
                  onCheckedChange={(checked) =>
                    onToggle(option.value, !!checked)
                  }
                />
                <label htmlFor={`${label}-${option.value}`} className="text-sm">
                  {option.label}
                </label>
              </div>
            ))
          )}
        </div>
      </FieldContent>
    </Field>
  )
}

export function ProductRelatedSection({ product }: ProductRelatedSectionProps) {
  const syncRelations = useSyncProductRelations(product.id)
  const { data: productOptions = [] } = useGetProductOptions()
  const [relations, setRelations] = React.useState(() =>
    mapProductRelations(product)
  )

  React.useEffect(() => {
    setRelations(mapProductRelations(product))
  }, [product])

  const availableOptions = productOptions.filter(
    (option) => option.value !== product.id
  )

  const toggleIds = (
    key: keyof SyncProductRelationsFormValues,
    productId: number,
    checked: boolean
  ) => {
    setRelations((current) => {
      const currentIds = current[key]
      const nextIds = checked
        ? [...currentIds, productId]
        : currentIds.filter((id) => id !== productId)

      return {
        ...current,
        [key]: nextIds,
      }
    })
  }

  const handleSave = () => {
    const parsed = syncProductRelationsSchema.safeParse(relations)

    if (!parsed.success) {
      toast.error("Fix relation selections before saving")
      return
    }

    syncRelations.mutate(parsed.data, {
      onSuccess: () => toast.success("Product relations saved"),
      onError: () => toast.error("Failed to save product relations"),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RelationList
          label="Related products"
          description="Shown as similar items on the product page."
          selectedIds={relations.related_product_ids}
          options={availableOptions}
          onToggle={(productId, checked) =>
            toggleIds("related_product_ids", productId, checked)
          }
        />

        <RelationList
          label="Cross-sell products"
          description="Suggested add-ons in cart or checkout."
          selectedIds={relations.cross_sell_product_ids}
          options={availableOptions}
          onToggle={(productId, checked) =>
            toggleIds("cross_sell_product_ids", productId, checked)
          }
        />

        <RelationList
          label="Upsell products"
          description="Higher-value alternatives to recommend."
          selectedIds={relations.up_sell_product_ids}
          options={availableOptions}
          onToggle={(productId, checked) =>
            toggleIds("up_sell_product_ids", productId, checked)
          }
        />

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={syncRelations.isPending}
          >
            {syncRelations.isPending && <Spinner />}
            Save relations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
