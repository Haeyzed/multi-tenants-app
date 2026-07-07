"use client"

import { Input } from "@/components/ui/input"
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
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { useGetUnitOptions } from "@/hooks/tenant/use-unit-query"
import { type UnitOption } from "@/types/tenant/unit"
import { PRICING_PRODUCT_TYPES } from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type ProductFormSectionProps } from "./product-form-shared"

type ProductShippingSectionProps = ProductFormSectionProps & {
  product?: Product
}

export function ProductShippingSection({
  form,
  product,
}: ProductShippingSectionProps) {
  const productType = form.watch("type")
  const { data: unitOptions = [] } = useGetUnitOptions()
  const weightUnitId = form.watch("default_variant.weight_unit_id")
  const dimensionUnitId = form.watch("default_variant.dimension_unit_id")
  const imageMediaId = form.watch("default_variant.image_media_id")

  if (!PRICING_PRODUCT_TYPES.includes(productType)) {
    return null
  }

  const weightUnits = (unitOptions as UnitOption[]).filter(
    (unit) => unit.type === "weight"
  )
  const dimensionUnits = (unitOptions as UnitOption[]).filter(
    (unit) => unit.type === "length"
  )

  const selectedWeightUnit =
    weightUnits.find((unit) => unit.value === weightUnitId) ?? null
  const selectedDimensionUnit =
    dimensionUnits.find((unit) => unit.value === dimensionUnitId) ?? null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & variant image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MediaPickerField
          label="Variant image"
          value={imageMediaId ?? null}
          previewUrl={
            product?.default_variant?.image_media?.url
              ? resolveTenantMediaUrl(product.default_variant.image_media)
              : null
          }
          previewTitle={product?.default_variant?.title ?? product?.name}
          onChange={(mediaId) => {
            form.setValue("default_variant.image_media_id", mediaId, {
              shouldDirty: true,
            })
          }}
          accept="image/*"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Weight</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                step="0.01"
                {...form.register("default_variant.weight", {
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
                itemToStringValue={(item) => `${item.label} (${item.symbol})`}
                value={selectedWeightUnit}
                onValueChange={(item) => {
                  form.setValue(
                    "default_variant.weight_unit_id",
                    item ? item.value : null,
                    { shouldDirty: true }
                  )
                }}
              >
                <ComboboxInput placeholder="Select weight unit..." />
                <ComboboxContent>
                  <ComboboxEmpty>No weight units found.</ComboboxEmpty>
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
                {...form.register("default_variant.length", {
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
                {...form.register("default_variant.width", {
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
                {...form.register("default_variant.height", {
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
              itemToStringValue={(item) => `${item.label} (${item.symbol})`}
              value={selectedDimensionUnit}
              onValueChange={(item) => {
                form.setValue(
                  "default_variant.dimension_unit_id",
                  item ? item.value : null,
                  { shouldDirty: true }
                )
              }}
            >
              <ComboboxInput placeholder="Select dimension unit..." />
              <ComboboxContent>
                <ComboboxEmpty>No dimension units found.</ComboboxEmpty>
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
  )
}
