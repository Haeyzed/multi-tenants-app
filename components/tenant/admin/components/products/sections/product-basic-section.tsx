"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
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
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"
import {
  FieldError,
  productConditionOptions,
  productTypeOptions,
  type ProductFormSectionProps,
} from "./product-form-shared"

type ProductBasicSectionProps = ProductFormSectionProps & {
  slugManual: boolean
  onSlugManualChange: (manual: boolean) => void
}

export function ProductBasicSection({
  form,
  slugManual,
  onSlugManualChange,
}: ProductBasicSectionProps) {
  const productType = form.watch("type")
  const condition = form.watch("condition")

  const selectedType =
    productTypeOptions.find((item) => item.value === productType) ??
    productTypeOptions[0]
  const selectedCondition =
    productConditionOptions.find((item) => item.value === condition) ??
    productConditionOptions[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Name *</FieldLabel>
          <FieldContent>
            <Input placeholder="Product name" {...form.register("name")} />
            <FieldError message={form.formState.errors.name?.message} />
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <FieldContent>
              <Input
                placeholder="product-slug"
                {...form.register("slug")}
                onChange={(event) => {
                  onSlugManualChange(true)
                  form.setValue("slug", event.target.value, {
                    shouldDirty: true,
                  })
                }}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Subtitle</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Short tagline"
                {...form.register("subtitle")}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Product type</FieldLabel>
            <FieldContent>
              <Combobox
                items={productTypeOptions}
                itemToStringValue={(item) => item.label}
                value={selectedType}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue(
                    "type",
                    item.value as StoreProductFormValues["type"]
                  )
                }}
              >
                <ComboboxInput placeholder="Select type..." />
                <ComboboxContent>
                  <ComboboxEmpty>No types found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError message={form.formState.errors.type?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Condition</FieldLabel>
            <FieldContent>
              <Combobox
                items={productConditionOptions}
                itemToStringValue={(item) => item.label}
                value={selectedCondition}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue(
                    "condition",
                    item.value as StoreProductFormValues["condition"]
                  )
                }}
              >
                <ComboboxInput placeholder="Select condition..." />
                <ComboboxContent>
                  <ComboboxEmpty>No conditions found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <FieldError message={form.formState.errors.condition?.message} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Summary</FieldLabel>
          <FieldContent>
            <Textarea
              placeholder="Brief product summary for listings..."
              {...form.register("summary")}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldContent>
            <RichTextEditor
              value={form.watch("description") ?? ""}
              onChange={(html) =>
                form.setValue("description", html || null, { shouldDirty: true })
              }
              placeholder="Full product description..."
            />
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  )
}
