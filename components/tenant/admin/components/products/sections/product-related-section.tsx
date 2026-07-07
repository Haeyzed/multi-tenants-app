"use client"

import * as React from "react"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useDebounce } from "@/hooks/useDebounce"
import {
  useGetProductOptions,
  useGetProducts,
} from "@/hooks/tenant/use-product-query"
import { useSyncProductRelations } from "@/hooks/tenant/use-product-variant-query"
import {
  type SyncProductRelationsFormValues,
  syncProductRelationsSchema,
} from "@/schemas/tenant/product-schema"
import { type Product, type ProductRelationRef } from "@/types/tenant/product"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

type ProductRelatedSectionProps = {
  product: Product
}

type ProductPickerOption = {
  label: string
  value: number
  sku?: string | null
  image_url?: string | null
}

function mapProductRelations(product: Product): SyncProductRelationsFormValues {
  return {
    related_product_ids: product.related_products?.map((item) => item.id) ?? [],
    cross_sell_product_ids:
      product.cross_sell_products?.map((item) => item.id) ?? [],
    up_sell_product_ids: product.up_sell_products?.map((item) => item.id) ?? [],
  }
}

function resolveRelationImageUrl(
  related: ProductRelationRef | undefined,
  option: ProductPickerOption | undefined
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
  optionMap,
  relatedProducts = [],
  onRemove,
}: {
  selectedIds: number[]
  optionMap: Map<number, ProductPickerOption>
  relatedProducts?: ProductRelationRef[]
  onRemove: (productId: number) => void
}) {
  if (selectedIds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No products selected yet. Search above to add related items.
      </p>
    )
  }

  const items = selectedIds.map((id) => {
    const related = relatedProducts.find((item) => item.id === id)
    const option = optionMap.get(id)

    return {
      id,
      name: related?.name ?? option?.label ?? `Product #${id}`,
      sku: related?.sku ?? option?.sku ?? null,
      imageUrl: resolveRelationImageUrl(related, option),
    }
  })

  return (
    <ItemGroup className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <Item key={item.id} variant="outline" size="sm" className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute end-1 top-1 z-10 size-6 bg-background/80"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name}`}
          >
            <X className="size-3.5" />
          </Button>
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

function RelationPicker({
  label,
  description,
  selectedIds,
  excludeProductId,
  relatedProducts,
  optionMap,
  onAdd,
  onRemove,
}: {
  label: string
  description: string
  selectedIds: number[]
  excludeProductId: number
  relatedProducts?: ProductRelationRef[]
  optionMap: Map<number, ProductPickerOption>
  onAdd: (productId: number) => void
  onRemove: (productId: number) => void
}) {
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search.trim(), 300)
  const { data: searchResponse, isFetching } = useGetProducts(
    debouncedSearch.length >= 2
      ? {
          search: debouncedSearch,
          per_page: 12,
          page: 1,
        }
      : undefined,
    { enabled: debouncedSearch.length >= 2 }
  )

  const searchResults = React.useMemo(() => {
    return (searchResponse?.data ?? [])
      .filter(
        (item) => item.id !== excludeProductId && !selectedIds.includes(item.id)
      )
      .map((item) => ({
        value: item.id,
        label: item.name,
        sku: item.default_variant?.sku ?? null,
        image_url: item.primary_image_media?.url ?? null,
      }))
  }, [excludeProductId, searchResponse?.data, selectedIds])

  const handleSelect = (option: ProductPickerOption) => {
    onAdd(option.value)
    setSearch("")
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <p className="mb-2 text-sm text-muted-foreground">{description}</p>

        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products by name or SKU..."
            className="ps-9"
          />
          {isFetching ? (
            <Spinner className="absolute end-3 top-1/2 size-4 -translate-y-1/2" />
          ) : null}
        </div>

        {debouncedSearch.length >= 2 ? (
          <div className="mt-2 max-h-48 overflow-y-auto rounded-md border">
            {searchResults.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No matching products found.
              </p>
            ) : (
              searchResults.map((option) => {
                const imageUrl = option.image_url
                  ? resolveTenantMediaUrl({ url: option.image_url, path: null })
                  : null

                return (
                  <button
                    key={option.value}
                    type="button"
                    className="flex w-full items-center gap-3 border-b px-3 py-2 text-left last:border-b-0 hover:bg-muted/50"
                    onClick={() => handleSelect(option)}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={option.label}
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-sm object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                        —
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {option.label}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {option.sku ?? "No SKU"}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        ) : search.length > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Type at least 2 characters to search.
          </p>
        ) : null}

        <div className="mt-3">
          <RelationPreviewGrid
            selectedIds={selectedIds}
            optionMap={optionMap}
            relatedProducts={relatedProducts}
            onRemove={onRemove}
          />
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

  const optionMap = React.useMemo(() => {
    const map = new Map<number, ProductPickerOption>()

    productOptions.forEach((option) => {
      map.set(option.value, option)
    })

    for (const related of [
      ...(product.related_products ?? []),
      ...(product.cross_sell_products ?? []),
      ...(product.up_sell_products ?? []),
    ]) {
      map.set(related.id, {
        value: related.id,
        label: related.name,
        sku: related.sku ?? null,
        image_url: related.primary_image_media?.url ?? null,
      })
    }

    return map
  }, [product, productOptions])

  const addId = (
    key: keyof SyncProductRelationsFormValues,
    productId: number
  ) => {
    setRelations((current) => {
      if (current[key].includes(productId)) {
        return current
      }

      return {
        ...current,
        [key]: [...current[key], productId],
      }
    })
  }

  const removeId = (
    key: keyof SyncProductRelationsFormValues,
    productId: number
  ) => {
    setRelations((current) => ({
      ...current,
      [key]: current[key].filter((id) => id !== productId),
    }))
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
      onError: (error) =>
        toastApiError(error, "Failed to save product relations"),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RelationPicker
          label="Related products"
          description="Shown as similar items on the product page."
          selectedIds={relations.related_product_ids}
          excludeProductId={product.id}
          relatedProducts={product.related_products}
          optionMap={optionMap}
          onAdd={(productId) => addId("related_product_ids", productId)}
          onRemove={(productId) => removeId("related_product_ids", productId)}
        />

        <RelationPicker
          label="Cross-sell products"
          description="Suggested add-ons in cart or checkout."
          selectedIds={relations.cross_sell_product_ids}
          excludeProductId={product.id}
          relatedProducts={product.cross_sell_products}
          optionMap={optionMap}
          onAdd={(productId) => addId("cross_sell_product_ids", productId)}
          onRemove={(productId) =>
            removeId("cross_sell_product_ids", productId)
          }
        />

        <RelationPicker
          label="Upsell products"
          description="Higher-value alternatives to recommend."
          selectedIds={relations.up_sell_product_ids}
          excludeProductId={product.id}
          relatedProducts={product.up_sell_products}
          optionMap={optionMap}
          onAdd={(productId) => addId("up_sell_product_ids", productId)}
          onRemove={(productId) => removeId("up_sell_product_ids", productId)}
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
