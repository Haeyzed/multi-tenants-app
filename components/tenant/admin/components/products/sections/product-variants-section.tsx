"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Layers, Package, Plus, Sparkles, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  useDeleteProductVariant,
  useGenerateProductVariants,
} from "@/hooks/tenant/use-product-variant-query"
import {
  generateProductVariantsSchema,
  type GenerateProductVariantsFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { ProductVariantMutateDialog } from "./product-variant-mutate-dialog"
import { ProductVariantInventoryDialog } from "./product-variant-inventory-dialog"
import { ProductVariantPriceTiersDialog } from "./product-variant-price-tiers-dialog"

type ProductVariantsSectionProps = {
  product: Product
}

function formatOptionValues(product: Product, variantId: number) {
  const variant = product.variants?.find((entry) => entry.id === variantId)

  if (!variant?.option_values?.length) {
    return "—"
  }

  return variant.option_values
    .map((value) => value.value)
    .join(" / ")
}

export function ProductVariantsSection({ product }: ProductVariantsSectionProps) {
  const generateVariants = useGenerateProductVariants(product.id)
  const deleteVariant = useDeleteProductVariant(product.id)
  const [mutateOpen, setMutateOpen] = React.useState(false)
  const [inventoryOpen, setInventoryOpen] = React.useState(false)
  const [priceTiersOpen, setPriceTiersOpen] = React.useState(false)
  const [generateOpen, setGenerateOpen] = React.useState(false)
  const [selectedVariantId, setSelectedVariantId] = React.useState<number | null>(
    null
  )

  const selectedVariant =
    product.variants?.find((variant) => variant.id === selectedVariantId) ?? null

  const generateForm = useForm<GenerateProductVariantsFormValues>({
    resolver: zodResolver(generateProductVariantsSchema),
    defaultValues: {
      price: 0,
      compare_at_price: null,
      cost_price: null,
      skip_existing: true,
      inventory: { quantity: 0 },
    },
  })

  const openCreate = () => {
    setSelectedVariantId(null)
    setMutateOpen(true)
  }

  const openEdit = (variantId: number) => {
    setSelectedVariantId(variantId)
    setMutateOpen(true)
  }

  const openInventory = (variantId: number) => {
    setSelectedVariantId(variantId)
    setInventoryOpen(true)
  }

  const openPriceTiers = (variantId: number) => {
    setSelectedVariantId(variantId)
    setPriceTiersOpen(true)
  }

  const handleDelete = (variantId: number) => {
    deleteVariant.mutate(variantId, {
      onSuccess: () => toast.success("Variant deleted"),
      onError: () => toast.error("Failed to delete variant"),
    })
  }

  const handleGenerate = (data: GenerateProductVariantsFormValues) => {
    generateVariants.mutate(data, {
      onSuccess: (variants) => {
        toast.success(`${variants.length} variants generated`)
        setGenerateOpen(false)
      },
      onError: () => toast.error("Failed to generate variants"),
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Variants</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage sellable SKUs for this product.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGenerateOpen(true)}
              disabled={!product.options?.length}
            >
              <Sparkles className="mr-2 size-4" />
              Generate
            </Button>
            <Button type="button" size="sm" onClick={openCreate}>
              <Plus className="mr-2 size-4" />
              Add variant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {product.variants?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{variant.title}</span>
                        {variant.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{variant.sku}</TableCell>
                    <TableCell>{formatOptionValues(product, variant.id)}</TableCell>
                    <TableCell>{variant.price}</TableCell>
                    <TableCell>
                      {variant.inventories?.[0]?.quantity ??
                        variant.inventory?.quantity ??
                        0}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => openPriceTiers(variant.id)}
                              >
                                <Layers className="size-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>Manage price tiers</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => openInventory(variant.id)}
                              >
                                <Package className="size-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>Manage inventory</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(variant.id)}
                              >
                                <Edit className="size-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>Edit variant</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(variant.id)}
                                disabled={deleteVariant.isPending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            }
                          />
                          <TooltipContent>Delete variant</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No variants yet. Save options and generate variants, or add one manually.
            </p>
          )}
        </CardContent>
      </Card>

      <ProductVariantMutateDialog
        open={mutateOpen}
        onOpenChange={setMutateOpen}
        productId={product.id}
        variant={selectedVariant}
      />

      {selectedVariant && (
        <ProductVariantInventoryDialog
          open={inventoryOpen}
          onOpenChange={setInventoryOpen}
          productId={product.id}
          variant={selectedVariant}
        />
      )}

      {selectedVariant && (
        <ProductVariantPriceTiersDialog
          open={priceTiersOpen}
          onOpenChange={setPriceTiersOpen}
          productId={product.id}
          variant={selectedVariant}
        />
      )}

      <ResponsiveDialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Generate variants</ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Create variants for every combination of saved option values.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <form
            onSubmit={generateForm.handleSubmit(handleGenerate)}
            className="space-y-4"
          >
            <Field>
              <FieldLabel>Base price</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  step="0.01"
                  {...generateForm.register("price", { valueAsNumber: true })}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Initial quantity</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...generateForm.register("inventory.quantity", {
                    valueAsNumber: true,
                  })}
                />
              </FieldContent>
            </Field>

            <ResponsiveDialogFooter className="shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setGenerateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={generateVariants.isPending}>
                {generateVariants.isPending && <Spinner />}
                Generate variants
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
