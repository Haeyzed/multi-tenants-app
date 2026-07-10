"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { useGetProductOptions } from "@/hooks/tenant/use-product-query"
import { useSyncProductBundleItems } from "@/hooks/tenant/use-product-variant-query"
import {
  type SyncProductBundleItemsFormValues,
  syncProductBundleItemsSchema,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { FieldError } from "./product-form-shared"

type ProductBundleSectionProps = {
  product: Product
}

function createEmptyBundleItem(): SyncProductBundleItemsFormValues["bundle_items"][number] {
  return {
    included_product_id: 0,
    quantity: 1,
    is_optional: false,
    discount_percentage: null,
    fixed_price: null,
  }
}

function mapBundleItems(
  product: Product
): SyncProductBundleItemsFormValues["bundle_items"] {
  return (
    product.bundle_items?.map((item) => ({
      included_product_id: item.included_product_id,
      included_variant_id: item.included_variant_id ?? null,
      quantity: item.quantity ?? 1,
      is_optional: item.is_optional ?? false,
      discount_percentage: item.discount_percentage
        ? Number(item.discount_percentage)
        : null,
      fixed_price: item.fixed_price ? Number(item.fixed_price) : null,
      sort_order: item.sort_order,
    })) ?? []
  )
}

export function ProductBundleSection({ product }: ProductBundleSectionProps) {
  const syncBundleItems = useSyncProductBundleItems(product.id)
  const { data: productOptions = [] } = useGetProductOptions()
  const availableProducts = productOptions.filter(
    (option: { label: string; value: number }) => option.value !== product.id
  )
  const [bundleItems, setBundleItems] = React.useState(() =>
    mapBundleItems(product)
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const updateItem = (
    index: number,
    patch: Partial<SyncProductBundleItemsFormValues["bundle_items"][number]>
  ) => {
    setBundleItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  const handleSave = () => {
    const payload = { bundle_items: bundleItems }
    const result = syncProductBundleItemsSchema.safeParse(payload)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path.join(".")] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    syncBundleItems.mutate(result.data, {
      onSuccess: (response) =>
        toastApiSuccess(response.message, "Bundle items saved"),
      onError: (error) => toastApiError(error, "Failed to save bundle items"),
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Bundle contents</CardTitle>
          <p className="text-sm text-muted-foreground">
            Products included when customers buy this bundle.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setBundleItems((current) => [...current, createEmptyBundleItem()])
          }
        >
          <Plus className="mr-1 size-4" />
          Add product
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {bundleItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bundle items yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Discount %</TableHead>
                <TableHead>Fixed price</TableHead>
                <TableHead>Optional</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundleItems.map((item, index) => {
                const selectedProduct =
                  availableProducts.find(
                    (option) => option.value === item.included_product_id
                  ) ?? null

                return (
                  <TableRow key={`bundle-item-${index}`}>
                    <TableCell className="min-w-[240px]">
                      <Combobox
                        items={availableProducts}
                        itemToStringValue={(option: {
                          label: string
                          value: number
                        }) => option.label}
                        value={selectedProduct}
                        onValueChange={(option) =>
                          updateItem(index, {
                            included_product_id: option ? option.value : 0,
                          })
                        }
                      >
                        <ComboboxInput placeholder="Select product" showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No products found.</ComboboxEmpty>
                          <ComboboxList>
                            {(option) => (
                              <ComboboxItem key={option.value} value={option}>
                                {option.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      <FieldError
                        message={
                          errors[`bundle_items.${index}.included_product_id`]
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(index, {
                            quantity: Number(event.target.value) || 1,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={item.discount_percentage ?? ""}
                        onChange={(event) =>
                          updateItem(index, {
                            discount_percentage: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        placeholder="—"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={item.fixed_price ?? ""}
                        onChange={(event) =>
                          updateItem(index, {
                            fixed_price: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        placeholder="—"
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={item.is_optional ?? false}
                        onCheckedChange={(checked) =>
                          updateItem(index, { is_optional: !!checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setBundleItems((current) =>
                            current.filter(
                              (_, itemIndex) => itemIndex !== index
                            )
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={syncBundleItems.isPending}
          >
            {syncBundleItems.isPending && <Spinner />}
            Save bundle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
