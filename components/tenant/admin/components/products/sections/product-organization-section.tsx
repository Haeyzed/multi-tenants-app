"use client"

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
import { useGetBrandOptions } from "@/hooks/tenant/use-brand-query"
import { useGetCategoryOptions } from "@/hooks/tenant/use-category-query"
import { useGetCollectionOptions } from "@/hooks/tenant/use-collection-query"
import { useGetTagOptions } from "@/hooks/tenant/use-tag-query"
import { type ProductFormSectionProps } from "./product-form-shared"

export function ProductOrganizationSection({ form }: ProductFormSectionProps) {
  const { data: brandOptions = [] } = useGetBrandOptions()
  const { data: categoryOptions = [] } = useGetCategoryOptions()
  const { data: tagOptions = [] } = useGetTagOptions()
  const { data: collectionOptions = [] } = useGetCollectionOptions()

  const brandId = form.watch("brand_id")
  const categoryIds = form.watch("category_ids") ?? []
  const primaryCategoryId = form.watch("primary_category_id")
  const tagIds = form.watch("tag_ids") ?? []
  const collectionIds = form.watch("collection_ids") ?? []

  const selectedBrand =
    brandOptions.find((item) => item.value === brandId) ?? null

  const selectedPrimaryCategory =
    categoryOptions.find((item) => item.value === primaryCategoryId) ?? null

  const primaryCategoryOptions = categoryOptions.filter((option) =>
    categoryIds.includes(option.value)
  )

  const toggleCategory = (categoryId: number, checked: boolean) => {
    const nextIds = checked
      ? [...categoryIds, categoryId]
      : categoryIds.filter((id) => id !== categoryId)

    form.setValue("category_ids", nextIds, { shouldDirty: true })

    if (!checked && primaryCategoryId === categoryId) {
      form.setValue("primary_category_id", nextIds[0] ?? null, {
        shouldDirty: true,
      })
    } else if (checked && nextIds.length === 1) {
      form.setValue("primary_category_id", categoryId, { shouldDirty: true })
    }
  }

  const toggleTag = (tagId: number, checked: boolean) => {
    const nextIds = checked
      ? [...tagIds, tagId]
      : tagIds.filter((id) => id !== tagId)

    form.setValue("tag_ids", nextIds, { shouldDirty: true })
  }

  const toggleCollection = (collectionId: number, checked: boolean) => {
    const nextIds = checked
      ? [...collectionIds, collectionId]
      : collectionIds.filter((id) => id !== collectionId)

    form.setValue("collection_ids", nextIds, { shouldDirty: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field>
          <FieldLabel>Categories</FieldLabel>
          <FieldContent>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {categoryOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No categories available.
                </p>
              ) : (
                categoryOptions.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={categoryIds.includes(category.value)}
                      onCheckedChange={(checked) =>
                        toggleCategory(category.value, !!checked)
                      }
                    />
                    <label
                      htmlFor={`category-${category.value}`}
                      className="text-sm"
                    >
                      {category.label}
                    </label>
                  </div>
                ))
              )}
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Primary category</FieldLabel>
          <FieldContent>
            <Combobox
              items={primaryCategoryOptions}
              itemToStringValue={(item) => item.label}
              value={selectedPrimaryCategory}
              onValueChange={(item) => {
                form.setValue("primary_category_id", item ? item.value : null, {
                  shouldDirty: true,
                })
              }}
            >
              <ComboboxInput placeholder="Select primary category..." />
              <ComboboxContent>
                <ComboboxEmpty>
                  {categoryIds.length === 0
                    ? "Select categories first."
                    : "No categories found."}
                </ComboboxEmpty>
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
          <FieldLabel>Brand</FieldLabel>
          <FieldContent>
            <Combobox
              items={brandOptions}
              itemToStringValue={(item) => item.label}
              value={selectedBrand}
              onValueChange={(item) => {
                form.setValue("brand_id", item ? item.value : null)
              }}
            >
              <ComboboxInput placeholder="Select brand..." />
              <ComboboxContent>
                <ComboboxEmpty>No brands found.</ComboboxEmpty>
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
          <FieldLabel>Tags</FieldLabel>
          <FieldContent>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {tagOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tags available.
                </p>
              ) : (
                tagOptions.map((tag) => (
                  <div key={tag.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.value}`}
                      checked={tagIds.includes(tag.value)}
                      onCheckedChange={(checked) =>
                        toggleTag(tag.value, !!checked)
                      }
                    />
                    <label htmlFor={`tag-${tag.value}`} className="text-sm">
                      {tag.label}
                    </label>
                  </div>
                ))
              )}
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Collections</FieldLabel>
          <FieldContent>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
              {collectionOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No collections available.
                </p>
              ) : (
                collectionOptions.map((collection) => (
                  <div
                    key={collection.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`collection-${collection.value}`}
                      checked={collectionIds.includes(collection.value)}
                      onCheckedChange={(checked) =>
                        toggleCollection(collection.value, !!checked)
                      }
                    />
                    <label
                      htmlFor={`collection-${collection.value}`}
                      className="text-sm"
                    >
                      {collection.label}
                    </label>
                  </div>
                ))
              )}
            </div>
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  )
}
