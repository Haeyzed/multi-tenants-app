"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { useGetAttributeSetAttributes, useGetAttributeSetOptions } from "@/hooks/tenant/use-attribute-set-query"
import { useGetAttributeValues } from "@/hooks/tenant/use-attribute-query"
import { type Attribute, type AttributeValue } from "@/types/tenant/attribute"
import {
  type StoreProductFormValues,
} from "@/schemas/tenant/product-schema"
import { type ProductFormSectionProps } from "./product-form-shared"

type AttributeValueFormItem = NonNullable<
  StoreProductFormValues["attribute_values"]
>[number]

function usesPredefinedValues(type: Attribute["type"]): boolean {
  return type === "select" || type === "color" || type === "boolean"
}

function AttributeValueField({
  attribute,
  value,
  onChange,
}: {
  attribute: Attribute
  value?: AttributeValueFormItem
  onChange: (next: AttributeValueFormItem) => void
}) {
  const predefinedValues = attribute.values ?? []
  const shouldFetchValues =
    usesPredefinedValues(attribute.type) && predefinedValues.length === 0
  const { data: fetchedValues = [] } = useGetAttributeValues(
    shouldFetchValues ? attribute.id : undefined,
    shouldFetchValues
  )
  const options = predefinedValues.length > 0 ? predefinedValues : fetchedValues

  if (attribute.type === "textarea") {
    return (
      <Textarea
        placeholder={`Enter ${attribute.name.toLowerCase()}`}
        value={value?.custom_value ?? ""}
        onChange={(event) =>
          onChange({
            attribute_id: attribute.id,
            custom_value: event.target.value || null,
            attribute_value_id: null,
          })
        }
      />
    )
  }

  if (usesPredefinedValues(attribute.type)) {
    const selected =
      options.find((item) => item.id === value?.attribute_value_id) ?? null

    return (
      <Combobox
        items={options}
        itemToStringValue={(item: AttributeValue) => item.value}
        value={selected}
        onValueChange={(item) => {
          onChange({
            attribute_id: attribute.id,
            attribute_value_id: item?.id ?? null,
            custom_value: null,
          })
        }}
      >
        <ComboboxInput placeholder={`Select ${attribute.name.toLowerCase()}...`} />
        <ComboboxContent>
          <ComboboxEmpty>No values found.</ComboboxEmpty>
          <ComboboxList>
            {(item: AttributeValue) => (
              <ComboboxItem key={item.id} value={item}>
                {item.value}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )
  }

  return (
    <Input
      type={attribute.type === "number" ? "number" : "text"}
      placeholder={`Enter ${attribute.name.toLowerCase()}`}
      value={value?.custom_value ?? ""}
      onChange={(event) =>
        onChange({
          attribute_id: attribute.id,
          custom_value: event.target.value || null,
          attribute_value_id: null,
        })
      }
    />
  )
}

export function ProductAttributesSection({ form }: ProductFormSectionProps) {
  const { data: attributeSetOptions = [] } = useGetAttributeSetOptions()
  const attributeSetId = form.watch("attribute_set_id")
  const attributeValues = form.watch("attribute_values") ?? []
  const { data: attributes = [], isLoading } = useGetAttributeSetAttributes(
    attributeSetId ?? undefined,
    !!attributeSetId
  )

  const selectedAttributeSet =
    attributeSetOptions.find((item) => item.value === attributeSetId) ?? null

  const updateAttributeValue = (next: AttributeValueFormItem) => {
    const current = form.getValues("attribute_values") ?? []
    const index = current.findIndex(
      (item) => item.attribute_id === next.attribute_id
    )
    const updated =
      index === -1
        ? [...current, next]
        : current.map((item, itemIndex) =>
            itemIndex === index ? next : item
          )

    form.setValue("attribute_values", updated, { shouldDirty: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Attribute set</FieldLabel>
          <FieldContent>
            <Combobox
              items={attributeSetOptions}
              itemToStringValue={(item) => item.label}
              value={selectedAttributeSet}
              onValueChange={(item) => {
                form.setValue("attribute_set_id", item ? item.value : null, {
                  shouldDirty: true,
                })
                if (!item) {
                  form.setValue("attribute_values", [], { shouldDirty: true })
                }
              }}
            >
              <ComboboxInput placeholder="Select attribute set..." />
              <ComboboxContent>
                <ComboboxEmpty>No attribute sets found.</ComboboxEmpty>
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

        {!attributeSetId ? (
          <p className="text-sm text-muted-foreground">
            Choose an attribute set to configure product specifications.
          </p>
        ) : isLoading ? (
          <p className="text-sm text-muted-foreground">Loading attributes...</p>
        ) : attributes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This attribute set has no attributes assigned.
          </p>
        ) : (
          <div className="space-y-4">
            {attributes.map((attribute) => {
              const currentValue = attributeValues.find(
                (item) => item.attribute_id === attribute.id
              )

              return (
                <Field key={attribute.id}>
                  <FieldLabel>
                    {attribute.name}
                    {attribute.is_required ? " *" : ""}
                  </FieldLabel>
                  <FieldContent>
                    <AttributeValueField
                      attribute={attribute}
                      value={currentValue}
                      onChange={updateAttributeValue}
                    />
                  </FieldContent>
                </Field>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
