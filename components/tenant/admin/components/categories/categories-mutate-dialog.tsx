"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateCategory,
  useGetCategoryOptions,
  useUpdateCategory,
} from "@/hooks/tenant/use-category-query"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type Category, type CategoryOption } from "@/types/tenant/category"
import {
  storeCategorySchema,
  updateCategorySchema,
  type StoreCategoryFormValues,
  type UpdateCategoryFormValues,
} from "@/schemas/tenant/category-schema"

type CategoriesMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
}

const noneParentOption: CategoryOption = { label: "None (root category)", value: 0 }

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function CategoriesMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: CategoriesMutateDialogProps) {
  const isUpdate = !!currentRow
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const { data: categoryOptions = [] } = useGetCategoryOptions()
  const isSubmitting = createCategory.isPending || updateCategory.isPending

  const schema = isUpdate ? updateCategorySchema : storeCategorySchema

  const parentItems = React.useMemo(() => {
    const filtered = currentRow
      ? categoryOptions.filter((option) => option.value !== currentRow.id)
      : categoryOptions

    return [noneParentOption, ...filtered]
  }, [categoryOptions, currentRow])

  const form = useForm<StoreCategoryFormValues | UpdateCategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      parent_id: null,
      is_visible: true,
      sort_order: 0,
      image_media_id: null,
      banner_media_id: null,
      color: "",
      icon: "",
      meta_title: "",
      meta_description: "",
    },
  })

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  )
  const [imagePreviewTitle, setImagePreviewTitle] = React.useState<string | null>(
    null
  )
  const [bannerPreviewUrl, setBannerPreviewUrl] = React.useState<string | null>(
    null
  )
  const [bannerPreviewTitle, setBannerPreviewTitle] = React.useState<
    string | null
  >(null)

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || "",
        parent_id: currentRow.parent_id,
        is_visible: currentRow.is_visible,
        sort_order: currentRow.sort_order,
        image_media_id: currentRow.image?.id ?? null,
        banner_media_id: currentRow.banner?.id ?? null,
        color: "",
        icon: "",
        meta_title: currentRow.meta_title || "",
        meta_description: currentRow.meta_description || "",
      })
      setImagePreviewUrl(
        currentRow.image?.url ? resolveTenantMediaUrl(currentRow.image) : null
      )
      setImagePreviewTitle(currentRow.image?.name ?? currentRow.name)
      setBannerPreviewUrl(
        currentRow.banner?.url ? resolveTenantMediaUrl(currentRow.banner) : null
      )
      setBannerPreviewTitle(currentRow.banner?.name ?? currentRow.name)
    } else {
      form.reset({
        name: "",
        description: "",
        parent_id: null,
        is_visible: true,
        sort_order: 0,
        image_media_id: null,
        banner_media_id: null,
        color: "",
        icon: "",
        meta_title: "",
        meta_description: "",
      })
      setImagePreviewUrl(null)
      setImagePreviewTitle(null)
      setBannerPreviewUrl(null)
      setBannerPreviewTitle(null)
    }
  }, [open, currentRow, form])

  const parentId = form.watch("parent_id")
  const selectedParent =
    parentItems.find((item) =>
      parentId ? item.value === parentId : item.value === 0
    ) ?? noneParentOption

  const onSubmit = (data: StoreCategoryFormValues | UpdateCategoryFormValues) => {
    const payload = {
      ...data,
      description: data.description || null,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      color: data.color || null,
      icon: data.icon || null,
      parent_id: data.parent_id || null,
    }

    if (isUpdate && currentRow) {
      updateCategory.mutate(
        { id: currentRow.id, category: payload as UpdateCategoryFormValues },
        {
          onSuccess: () => {
            toast.success("Category updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update category")
          },
        }
      )
    } else {
      createCategory.mutate(payload as StoreCategoryFormValues, {
        onSuccess: () => {
          toast.success("Category created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create category")
        },
      })
    }
  }

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) form.reset()
      }}
    >
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isUpdate ? "Update" : "Create"} Category
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the category by providing necessary info."
              : "Add a new category by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="categories-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Category name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Parent Category</FieldLabel>
            <FieldContent>
              <Combobox
                items={parentItems}
                itemToStringValue={(item) => item.label}
                value={selectedParent}
                onValueChange={(item) => {
                  if (!item) return
                  form.setValue("parent_id", item.value === 0 ? null : item.value)
                }}
              >
                <ComboboxInput placeholder="Select parent category..." />
                <ComboboxContent>
                  <ComboboxEmpty>No categories found.</ComboboxEmpty>
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
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Category description..."
                {...form.register("description")}
              />
              <FieldError message={form.formState.errors.description?.message} />
            </FieldContent>
          </Field>

          <MediaPickerField
            label="Image"
            value={form.watch("image_media_id") ?? null}
            previewUrl={imagePreviewUrl}
            previewTitle={imagePreviewTitle}
            onChange={(mediaId, media) => {
              form.setValue("image_media_id", mediaId)
              setImagePreviewUrl(media?.url ? resolveTenantMediaUrl(media) : null)
              setImagePreviewTitle(media?.title ?? media?.name ?? null)
            }}
            accept="image/*"
          />

          <MediaPickerField
            label="Banner"
            value={form.watch("banner_media_id") ?? null}
            previewUrl={bannerPreviewUrl}
            previewTitle={bannerPreviewTitle}
            onChange={(mediaId, media) => {
              form.setValue("banner_media_id", mediaId)
              setBannerPreviewUrl(media?.url ? resolveTenantMediaUrl(media) : null)
              setBannerPreviewTitle(media?.title ?? media?.name ?? null)
            }}
            accept="image/*"
          />

          {(imagePreviewUrl || bannerPreviewUrl) && isUpdate ? (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              {imagePreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Image preview</p>
                  <MediaThumbnail
                    media={{ url: imagePreviewUrl, name: imagePreviewTitle }}
                    alt={imagePreviewTitle ?? "Category image"}
                    size="md"
                  />
                </div>
              ) : null}
              {bannerPreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Banner preview</p>
                  <MediaThumbnail
                    media={{ url: bannerPreviewUrl, name: bannerPreviewTitle }}
                    alt={bannerPreviewTitle ?? "Category banner"}
                    size="md"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Meta Title</FieldLabel>
              <FieldContent>
                <Input placeholder="SEO title" {...form.register("meta_title")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Sort Order</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  {...form.register("sort_order", { valueAsNumber: true })}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Meta Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="SEO description..."
                {...form.register("meta_description")}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Color</FieldLabel>
              <FieldContent>
                <Input placeholder="#000000" {...form.register("color")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Icon</FieldLabel>
              <FieldContent>
                <Input placeholder="icon-name" {...form.register("icon")} />
              </FieldContent>
            </Field>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_visible"
              checked={form.watch("is_visible")}
              onCheckedChange={(checked) =>
                form.setValue("is_visible", !!checked)
              }
            />
            <label htmlFor="is_visible" className="text-sm font-medium">
              Visible
            </label>
          </div>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button type="submit" form="categories-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Category"
                : "Create Category"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
