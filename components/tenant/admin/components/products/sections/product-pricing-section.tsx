"use client"

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
import { useGetTaxClassOptions } from "@/hooks/tenant/use-tax-class-query"
import { PRICING_PRODUCT_TYPES } from "@/schemas/tenant/product-schema"
import { FieldError, type ProductFormSectionProps } from "./product-form-shared"
import { ProductPriceTiersEditor } from "./product-price-tiers-editor"

export function ProductPricingSection({ form }: ProductFormSectionProps) {
  const productType = form.watch("type")
  const isTaxable = form.watch("is_taxable")
  const taxClassId = form.watch("tax_class_id")
  const { data: taxClassOptions = [] } = useGetTaxClassOptions()

  if (!PRICING_PRODUCT_TYPES.includes(productType)) {
    return null
  }

  const defaultVariantErrors = form.formState.errors.default_variant
  const priceTiers = form.watch("default_variant.price_tiers") ?? []
  const selectedTaxClass =
    taxClassOptions.find((item) => item.value === taxClassId) ?? null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>SKU *</FieldLabel>
            <FieldContent>
              <Input
                placeholder="SKU-001"
                {...form.register("default_variant.sku")}
              />
              <FieldError message={defaultVariantErrors?.sku?.message} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Variant title</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Default"
                {...form.register("default_variant.title")}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Selling price *</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                step="0.01"
                {...form.register("default_variant.price", {
                  valueAsNumber: true,
                })}
              />
              <FieldError message={defaultVariantErrors?.price?.message} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Compare-at price</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                step="0.01"
                {...form.register("default_variant.compare_at_price", {
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
                {...form.register("default_variant.cost_price", {
                  setValueAs: (value) =>
                    value === "" || value === null ? null : Number(value),
                })}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Barcode</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Barcode"
                {...form.register("default_variant.barcode")}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_taxable"
            checked={isTaxable}
            onCheckedChange={(checked) =>
              form.setValue("is_taxable", !!checked)
            }
          />
          <label htmlFor="is_taxable" className="text-sm font-medium">
            Charge tax on this product
          </label>
        </div>

        {isTaxable && (
          <Field>
            <FieldLabel>Tax class</FieldLabel>
            <FieldContent>
              <Combobox
                items={taxClassOptions}
                itemToStringValue={(item) => item.label}
                value={selectedTaxClass}
                onValueChange={(item) => {
                  form.setValue("tax_class_id", item ? item.value : null, {
                    shouldDirty: true,
                  })
                }}
              >
                <ComboboxInput placeholder="Select tax class..." />
                <ComboboxContent>
                  <ComboboxEmpty>No tax classes found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <p className="mt-1 text-xs text-muted-foreground">
                Determines which tax rates apply when this product is taxable.
              </p>
            </FieldContent>
          </Field>
        )}

        <ProductPriceTiersEditor
          tiers={priceTiers}
          onChange={(tiers) =>
            form.setValue("default_variant.price_tiers", tiers, {
              shouldDirty: true,
            })
          }
        />
      </CardContent>
    </Card>
  )
}
