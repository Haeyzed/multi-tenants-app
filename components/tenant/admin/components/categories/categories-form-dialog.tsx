"use client"

import { toastApiSuccess } from "@/lib/toast-api"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
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
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/ui/color-picker"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateCategory,
  useGetCategoryTreeSelect,
  useUpdateCategory,
} from "@/hooks/tenant/use-category-query"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type Category, type CategoryOption } from "@/types/tenant/category"
import {
  type StoreCategoryFormValues,
  storeCategorySchema,
  type UpdateCategoryFormValues,
  updateCategorySchema,
} from "@/schemas/tenant/category-schema"

type CategoriesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Category
  onCreated?: (category: Category) => void
}

const noneParentOption: CategoryOption = {
  label: "None (root category)",
  value: 0,
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function CategoriesFormDialog({
  open,
  onOpenChange,
  currentRow,
  onCreated,
}: CategoriesFormDialogProps) {
  const isUpdate = !!currentRow
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const { data: categoryOptions = [] } = useGetCategoryTreeSelect()
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
      summary: "",
      parent_id: null,
      is_visible: true,
      is_featured: false,
      sort_order: 0,
      image_media_id: null,
      banner_media_id: null,
      icon_media_id: null,
      color: "",
      icon_class: "",
      meta_title: "",
      meta_description: "",
    },
  })

  const [imagePreviewUrl, setImagePreviewUrl] = React.useState<string | null>(
    null
  )
  const [imagePreviewTitle, setImagePreviewTitle] = React.useState<
    string | null
  >(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = React.useState<string | null>(
    null
  )
  const [bannerPreviewTitle, setBannerPreviewTitle] = React.useState<
    string | null
  >(null)
  const [iconPreviewUrl, setIconPreviewUrl] = React.useState<string | null>(
    null
  )
  const [iconPreviewTitle, setIconPreviewTitle] = React.useState<string | null>(
    null
  )

  React.useEffect(() => {
    if (!open) return

    if (currentRow) {
      form.reset({
        name: currentRow.name,
        description: currentRow.description || "",
        summary: currentRow.summary || "",
        parent_id: currentRow.parent_id,
        is_visible: currentRow.is_visible,
        is_featured: currentRow.is_featured,
        sort_order: currentRow.sort_order,
        image_media_id: currentRow.image?.id ?? null,
        banner_media_id: currentRow.banner?.id ?? null,
        icon_media_id: currentRow.icon?.id ?? null,
        color: currentRow.color || "",
        icon_class: currentRow.icon_class || "",
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
      setIconPreviewUrl(
        currentRow.icon?.url ? resolveTenantMediaUrl(currentRow.icon) : null
      )
      setIconPreviewTitle(currentRow.icon?.name ?? currentRow.name)
    } else {
      form.reset({
        name: "",
        description: "",
        summary: "",
        parent_id: null,
        is_visible: true,
        is_featured: false,
        sort_order: 0,
        image_media_id: null,
        banner_media_id: null,
        icon_media_id: null,
        color: "",
        icon_class: "",
        meta_title: "",
        meta_description: "",
      })
      setImagePreviewUrl(null)
      setImagePreviewTitle(null)
      setBannerPreviewUrl(null)
      setBannerPreviewTitle(null)
      setIconPreviewUrl(null)
      setIconPreviewTitle(null)
    }
  }, [open, currentRow, form])

  const parentId = form.watch("parent_id")
  const selectedParent =
    parentItems.find((item) =>
      parentId ? item.value === parentId : item.value === 0
    ) ?? noneParentOption

  const onSubmit = (
    data: StoreCategoryFormValues | UpdateCategoryFormValues
  ) => {
    const payload = {
      ...data,
      description: data.description || null,
      summary: data.summary || null,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      color: data.color || null,
      icon_class: data.icon_class || null,
      parent_id: data.parent_id || null,
      is_featured: data.is_featured ?? false,
    }

    if (isUpdate && currentRow) {
      updateCategory.mutate(
        { id: currentRow.id, category: payload as UpdateCategoryFormValues },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Category updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(
              error,
              form.setError,
              "Failed to update category"
            )
          },
        }
      )
    } else {
      createCategory.mutate(payload as StoreCategoryFormValues, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Category created successfully")
          onCreated?.(result.data)
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
                  form.setValue(
                    "parent_id",
                    item.value === 0 ? null : item.value
                  )
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
            <FieldLabel>Summary</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Short summary"
                {...form.register("summary")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Category description..."
                {...form.register("description")}
              />
              <FieldError
                message={form.formState.errors.description?.message}
              />
            </FieldContent>
          </Field>

          <MediaPickerField
            label="Image"
            value={form.watch("image_media_id") ?? null}
            previewUrl={imagePreviewUrl}
            previewTitle={imagePreviewTitle}
            onChange={(mediaId, media) => {
              form.setValue("image_media_id", mediaId)
              setImagePreviewUrl(
                media?.url ? resolveTenantMediaUrl(media) : null
              )
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
              setBannerPreviewUrl(
                media?.url ? resolveTenantMediaUrl(media) : null
              )
              setBannerPreviewTitle(media?.title ?? media?.name ?? null)
            }}
            accept="image/*"
          />

          <MediaPickerField
            label="Icon image"
            value={form.watch("icon_media_id") ?? null}
            previewUrl={iconPreviewUrl}
            previewTitle={iconPreviewTitle}
            onChange={(mediaId, media) => {
              form.setValue("icon_media_id", mediaId)
              setIconPreviewUrl(
                media?.url ? resolveTenantMediaUrl(media) : null
              )
              setIconPreviewTitle(media?.title ?? media?.name ?? null)
            }}
            accept="image/*"
          />

          {(imagePreviewUrl || bannerPreviewUrl || iconPreviewUrl) &&
          isUpdate ? (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              {imagePreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Image preview
                  </p>
                  <MediaThumbnail
                    media={{ url: imagePreviewUrl, name: imagePreviewTitle }}
                    alt={imagePreviewTitle ?? "Category image"}
                    size="md"
                  />
                </div>
              ) : null}
              {bannerPreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Banner preview
                  </p>
                  <MediaThumbnail
                    media={{ url: bannerPreviewUrl, name: bannerPreviewTitle }}
                    alt={bannerPreviewTitle ?? "Category banner"}
                    size="md"
                  />
                </div>
              ) : null}
              {iconPreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Icon preview
                  </p>
                  <MediaThumbnail
                    media={{ url: iconPreviewUrl, name: iconPreviewTitle }}
                    alt={iconPreviewTitle ?? "Category icon"}
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
                <Input
                  placeholder="SEO title"
                  {...form.register("meta_title")}
                />
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
                <ColorPicker
                  value={form.watch("color") || "#3b82f6"}
                  onValueChange={(value) =>
                    form.setValue("color", value || null, { shouldDirty: true })
                  }
                  defaultFormat="hex"
                >
                  <div className="flex items-center gap-3">
                    <ColorPickerTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="flex items-center gap-2 px-3"
                        >
                          <ColorPickerSwatch className="size-4" />
                          {form.watch("color") || "Pick color"}
                        </Button>
                      }
                    />
                    {form.watch("color") ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          form.setValue("color", null, { shouldDirty: true })
                        }
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                  <ColorPickerContent>
                    <ColorPickerArea />
                    <div className="flex items-center gap-2">
                      <ColorPickerEyeDropper />
                      <div className="flex flex-1 flex-col gap-2">
                        <ColorPickerHueSlider />
                        <ColorPickerAlphaSlider />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ColorPickerFormatSelect />
                      <ColorPickerInput />
                    </div>
                  </ColorPickerContent>
                </ColorPicker>
                <FieldError message={form.formState.errors.color?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Icon class</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="lucide-tag"
                  {...form.register("icon_class")}
                />
              </FieldContent>
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-6">
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) =>
                  form.setValue("is_featured", !!checked)
                }
              />
              <label htmlFor="is_featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
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
