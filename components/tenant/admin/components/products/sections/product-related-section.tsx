"use client"

import * as React from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
import { useGetProductOptions } from "@/hooks/tenant/use-product-query"
import { useSyncProductRelations } from "@/hooks/tenant/use-product-variant-query"
import {
  syncProductRelationsSchema,
  type SyncProductRelationsFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product, type ProductRelationRef } from "@/types/tenant/product"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

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
  options: ProductOption[]
  relatedProducts?: ProductRelationRef[]
  onToggle: (productId: number, checked: boolean) => void
}

type ProductOption = {
  label: string
  value: number
  image_url?: string | null
}

function resolveRelationImageUrl(
  related: ProductRelationRef | undefined,
  option: ProductOption | undefined
) {
  if (related?.primary_image_media?.url) {
    return resolveTenantMediaUrl(related.primary_image_media)
  }

  if (option?.image_url) {
    return resolveTenantMediaUrl({ url: option.image_url, path: null })
  }

  return null
}

function RelationPreviewGrid({
  selectedIds,
  options,
  relatedProducts = [],
}: {
  selectedIds: number[]
  options: ProductOption[]
  relatedProducts?: ProductRelationRef[]
}) {
  if (selectedIds.length === 0) return null

  const items = selectedIds.map((id) => {
    const related = relatedProducts.find((item) => item.id === id)
    const option = options.find((item) => item.value === id)

    return {
      id,
      name: related?.name ?? option?.label ?? `Product #${id}`,
      sku: related?.sku ?? null,
      imageUrl: resolveRelationImageUrl(related, option),
    }
  })

  return (
    <ItemGroup className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <Item key={item.id} variant="outline" size="sm">
          <ItemHeader>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={72}
                height={72}
                className="aspect-square w-full rounded-sm object-cover"
                unoptimized
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </ItemHeader>
          <ItemContent>
            <ItemTitle className="line-clamp-2 text-xs">{item.name}</ItemTitle>
            <ItemDescription className="text-[10px]">
              {item.sku ?? "—"}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  )
}

function RelationList({
  label,
  description,
  selectedIds,
  options,
  relatedProducts,
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
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${label}-${option.value}`}
                  className="shrink-0"
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
        <RelationPreviewGrid
          selectedIds={selectedIds}
          options={options}
          relatedProducts={relatedProducts}
        />
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
      onSuccess: (response) =>
        toastApiSuccess(response.message, "Product relations saved"),
      onError: (error) => toastApiError(error, "Failed to save product relations"),
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
          relatedProducts={product.related_products}
          onToggle={(productId, checked) =>
            toggleIds("related_product_ids", productId, checked)
          }
        />

        <RelationList
          label="Cross-sell products"
          description="Suggested add-ons in cart or checkout."
          selectedIds={relations.cross_sell_product_ids}
          options={availableOptions}
          relatedProducts={product.cross_sell_products}
          onToggle={(productId, checked) =>
            toggleIds("cross_sell_product_ids", productId, checked)
          }
        />

        <RelationList
          label="Upsell products"
          description="Higher-value alternatives to recommend."
          selectedIds={relations.up_sell_product_ids}
          options={availableOptions}
          relatedProducts={product.up_sell_products}
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
