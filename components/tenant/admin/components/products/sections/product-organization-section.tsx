"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
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
import { useGetProductLabelOptions } from "@/hooks/tenant/use-product-label-query"
import { type BrandOption } from "@/types/tenant/brand"
import { type CategoryOption } from "@/types/tenant/category"
import { type CollectionOption } from "@/types/tenant/collection"
import { type ProductLabelOption } from "@/types/tenant/product-label"
import { type TagOption } from "@/types/tenant/tag"
import { BrandsFormDialog } from "@/components/tenant/admin/components/brands/brands-form-dialog"
import { CategoriesFormDialog } from "@/components/tenant/admin/components/categories/categories-form-dialog"
import { CollectionsFormDialog } from "@/components/tenant/admin/components/collections/collections-form-dialog"
import { TagsFormDialog } from "@/components/tenant/admin/components/tags/tags-form-dialog"
import { ProductLabelsFormDialog } from "@/components/tenant/admin/components/product-labels/product-labels-form-dialog"
import { type ProductFormSectionProps } from "./product-form-shared"

function FieldLabelWithAdd({
  label,
  addLabel,
  onAdd,
}: {
  label: string
  addLabel: string
  onAdd: () => void
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <FieldLabel className="mb-0">{label}</FieldLabel>
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-1 size-3.5" />
        {addLabel}
      </Button>
    </div>
  )
}

export function ProductOrganizationSection({ form }: ProductFormSectionProps) {
  const queryClient = useQueryClient()
  const { data: brandOptions = [] } = useGetBrandOptions()
  const { data: categoryOptions = [] } = useGetCategoryOptions()
  const { data: tagOptions = [] } = useGetTagOptions()
  const { data: labelOptions = [] } = useGetProductLabelOptions()
  const { data: collectionOptions = [] } = useGetCollectionOptions()

  const brandOptionsList = brandOptions as BrandOption[]
  const categoryOptionsList = categoryOptions as CategoryOption[]
  const tagOptionsList = tagOptions as TagOption[]
  const labelOptionsList = labelOptions as ProductLabelOption[]
  const collectionOptionsList = collectionOptions as CollectionOption[]

  const [categoryDialogOpen, setCategoryDialogOpen] = React.useState(false)
  const [brandDialogOpen, setBrandDialogOpen] = React.useState(false)
  const [tagDialogOpen, setTagDialogOpen] = React.useState(false)
  const [labelDialogOpen, setLabelDialogOpen] = React.useState(false)
  const [collectionDialogOpen, setCollectionDialogOpen] = React.useState(false)

  const brandId = form.watch("brand_id")
  const categoryIds = form.watch("category_ids") ?? []
  const primaryCategoryId = form.watch("primary_category_id")
  const tagIds = form.watch("tag_ids") ?? []
  const labelIds = form.watch("label_ids") ?? []
  const collectionIds = form.watch("collection_ids") ?? []

  const selectedBrand =
    brandOptionsList.find((item) => item.value === brandId) ?? null

  const selectedPrimaryCategory =
    categoryOptionsList.find((item) => item.value === primaryCategoryId) ?? null

  const primaryCategoryOptions = categoryOptionsList.filter((option) =>
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

  const toggleLabel = (labelId: number, checked: boolean) => {
    const nextIds = checked
      ? [...labelIds, labelId]
      : labelIds.filter((id) => id !== labelId)

    form.setValue("label_ids", nextIds, { shouldDirty: true })
  }

  const toggleCollection = (collectionId: number, checked: boolean) => {
    const nextIds = checked
      ? [...collectionIds, collectionId]
      : collectionIds.filter((id) => id !== collectionId)

    form.setValue("collection_ids", nextIds, { shouldDirty: true })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabelWithAdd
              label="Categories"
              addLabel="Add category"
              onAdd={() => setCategoryDialogOpen(true)}
            />
            <FieldContent>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {categoryOptionsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories available.
                  </p>
                ) : (
                  categoryOptionsList.map((category) => (
                    <div
                      key={category.value}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`category-${category.value}`}
                        className="shrink-0"
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
            <FieldLabelWithAdd
              label="Brand"
              addLabel="Add brand"
              onAdd={() => setBrandDialogOpen(true)}
            />
            <FieldContent>
              <Combobox
                items={brandOptionsList}
                itemToStringValue={(item) => item.label}
                value={selectedBrand}
                onValueChange={(item) => {
                  form.setValue("brand_id", item ? item.value : null, {
                    shouldDirty: true,
                  })
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
            <FieldLabelWithAdd
              label="Tags"
              addLabel="Add tag"
              onAdd={() => setTagDialogOpen(true)}
            />
            <FieldContent>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {tagOptionsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No tags available.
                  </p>
                ) : (
                  tagOptionsList.map((tag) => (
                    <div key={tag.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag.value}`}
                        className="shrink-0"
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
            <FieldLabelWithAdd
              label="Product labels"
              addLabel="Add label"
              onAdd={() => setLabelDialogOpen(true)}
            />
            <FieldContent>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {labelOptionsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No product labels available.
                  </p>
                ) : (
                  labelOptionsList.map((label) => (
                    <div key={label.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`label-${label.value}`}
                        className="shrink-0"
                        checked={labelIds.includes(label.value)}
                        onCheckedChange={(checked) =>
                          toggleLabel(label.value, !!checked)
                        }
                      />
                      <label htmlFor={`label-${label.value}`} className="text-sm">
                        {label.label}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabelWithAdd
              label="Collections"
              addLabel="Add collection"
              onAdd={() => setCollectionDialogOpen(true)}
            />
            <FieldContent>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {collectionOptionsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No collections available.
                  </p>
                ) : (
                  collectionOptionsList.map((collection) => (
                    <div
                      key={collection.value}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`collection-${collection.value}`}
                        className="shrink-0"
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

      <CategoriesFormDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onCreated={(category) => {
          void queryClient.invalidateQueries({ queryKey: ["categoryOptions"] })
          toggleCategory(category.id, true)
        }}
      />
      <BrandsFormDialog
        open={brandDialogOpen}
        onOpenChange={setBrandDialogOpen}
        onCreated={(brand) => {
          void queryClient.invalidateQueries({ queryKey: ["brandOptions"] })
          form.setValue("brand_id", brand.id, { shouldDirty: true })
        }}
      />
      <TagsFormDialog
        open={tagDialogOpen}
        onOpenChange={setTagDialogOpen}
        onCreated={(tag) => {
          void queryClient.invalidateQueries({ queryKey: ["tagOptions"] })
          toggleTag(tag.id, true)
        }}
      />
      <ProductLabelsFormDialog
        open={labelDialogOpen}
        onOpenChange={setLabelDialogOpen}
        onCreated={(label) => {
          void queryClient.invalidateQueries({ queryKey: ["productLabelOptions"] })
          toggleLabel(label.id, true)
        }}
      />
      <CollectionsFormDialog
        open={collectionDialogOpen}
        onOpenChange={setCollectionDialogOpen}
        onCreated={(collection) => {
          void queryClient.invalidateQueries({ queryKey: ["collectionOptions"] })
          toggleCollection(collection.id, true)
        }}
      />
    </>
  )
}
