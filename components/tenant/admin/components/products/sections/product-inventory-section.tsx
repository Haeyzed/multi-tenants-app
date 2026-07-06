"use client"

import * as React from "react"
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
import { useGetWarehouseOptions } from "@/hooks/tenant/use-warehouse-query"
import { type Product } from "@/types/tenant/product"
import { type ProductFormSectionProps } from "./product-form-shared"
import { ProductVariantInventoryDialog } from "./product-variant-inventory-dialog"

type ProductInventorySectionProps = ProductFormSectionProps & {
  product?: Product
}

export function ProductInventorySection({
  form,
  product,
}: ProductInventorySectionProps) {
  const [inventoryOpen, setInventoryOpen] = React.useState(false)
  const { data: warehouseOptions = [] } = useGetWarehouseOptions()
  const warehouseId = form.watch("default_variant.inventory.warehouse_id")

  const selectedWarehouse =
    warehouseOptions.find((item) => item.value === warehouseId) ?? null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Inventory</CardTitle>
        {product?.default_variant && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setInventoryOpen(true)}
          >
            Manage stock
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="track_inventory"
              checked={form.watch("track_inventory")}
              onCheckedChange={(checked) =>
                form.setValue("track_inventory", !!checked)
              }
            />
            <label htmlFor="track_inventory" className="text-sm font-medium">
              Track inventory
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allow_backorders"
              checked={form.watch("allow_backorders")}
              onCheckedChange={(checked) =>
                form.setValue("allow_backorders", !!checked)
              }
            />
            <label htmlFor="allow_backorders" className="text-sm font-medium">
              Allow backorders
            </label>
          </div>
        </div>

        {form.watch("track_inventory") && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Warehouse</FieldLabel>
              <FieldContent>
                <Combobox
                  items={warehouseOptions}
                  itemToStringValue={(item) => item.label}
                  value={selectedWarehouse}
                  onValueChange={(item) => {
                    form.setValue(
                      "default_variant.inventory.warehouse_id",
                      item ? item.value : null,
                      { shouldDirty: true }
                    )
                  }}
                >
                  <ComboboxInput placeholder="Select warehouse..." />
                  <ComboboxContent>
                    <ComboboxEmpty>No warehouses found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Quantity</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...form.register("default_variant.inventory.quantity", {
                    valueAsNumber: true,
                  })}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Low stock threshold</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...form.register("default_variant.inventory.reorder_level", {
                    setValueAs: (value) =>
                      value === "" || value === null ? null : Number(value),
                  })}
                />
              </FieldContent>
            </Field>
          </div>
        )}
      </CardContent>

      {product?.default_variant && (
        <ProductVariantInventoryDialog
          open={inventoryOpen}
          onOpenChange={setInventoryOpen}
          productId={product.id}
          variant={product.default_variant}
        />
      )}
    </Card>
  )
}
