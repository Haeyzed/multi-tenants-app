"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, GripVertical, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { handleFormApiError } from "@/lib/form-api-errors"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/tenant/use-product-query"
import { useGetBrandOptions } from "@/hooks/tenant/use-brand-query"
import { useGetCategoryOptions } from "@/hooks/tenant/use-category-query"
import {
  productFormSchema,
  type ProductFormValues,
} from "@/schemas/tenant/product-schema"
import { type Product } from "@/types/tenant/product"

type ProductFormProps = {
  product?: Product
}

type Option = { label: string; value: string }

const statusOptions: Option[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
]

const typeOptions: Option[] = [
  { label: "Physical", value: "standard" },
  { label: "Digital", value: "digital" },
  { label: "Service", value: "service" },
  { label: "Combo", value: "combo" },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isUpdate = !!product
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: brandOptions = [] } = useGetBrandOptions()
  const { data: categoryOptions = [] } = useGetCategoryOptions()
  const isSubmitting = createProduct.isPending || updateProduct.isPending
  const [slugManual, setSlugManual] = React.useState(false)
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = React.useState<string | null>(
    null
  )
  const [primaryPreviewTitle, setPrimaryPreviewTitle] = React.useState<
    string | null
  >(null)
  const [galleryPreviews, setGalleryPreviews] = React.useState<
    Record<number, { url: string; name?: string | null }>
  >({})

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      barcode: "",
      short_description: "",
      description: "",
      product_type: "standard",
      price: 0,
      compare_at_price: null,
      sale_price: null,
      cost_price: null,
      taxable: true,
      status: "draft",
      is_visible: true,
      is_featured: false,
      track_inventory: true,
      allow_backorders: false,
      category_id: null,
      category_ids: [],
      brand_id: null,
      tag_ids: [],
      primary_image_media_id: null,
      gallery: [],
      inventory: {
        quantity: 0,
        reserved_quantity: 0,
        low_stock_threshold: 5,
      },
      variants: [],
      weight: 0,
      length: null,
      width: null,
      height: null,
      weight_unit: "kg",
      dimension_unit: "cm",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      canonical_url: "",
    },
  })

  React.useEffect(() => {
    if (!product) return

    form.reset({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      barcode: product.barcode || "",
      short_description: product.short_description || "",
      description: product.description || "",
      product_type: product.product_type?.value ?? "standard",
      price: Number(product.price),
      compare_at_price: product.compare_at_price
        ? Number(product.compare_at_price)
        : null,
      sale_price: product.sale_price ? Number(product.sale_price) : null,
      cost_price: product.cost_price ? Number(product.cost_price) : null,
      taxable: product.taxable ?? true,
      status: product.status,
      is_visible: product.is_visible,
      is_featured: product.is_featured,
      track_inventory: product.track_inventory ?? true,
      allow_backorders: product.allow_backorders ?? false,
      category_id: product.category_id,
      category_ids:
        product.category_ids ??
        product.categories?.map((category) => category.id) ??
        [],
      brand_id: product.brand_id,
      primary_image_media_id: product.primary_image_media?.id ?? null,
      gallery:
        product.gallery?.map((item, index) => ({
          media_id: item.media_id ?? item.media?.id ?? 0,
          sort_order: item.sort_order ?? index,
          alt_text: item.alt_text ?? null,
          caption: item.caption ?? null,
          is_primary: item.is_primary,
        })) ?? [],
      inventory: {
        quantity: product.inventory?.quantity ?? 0,
        reserved_quantity: product.inventory?.reserved_quantity ?? 0,
        low_stock_threshold: product.inventory?.low_stock_threshold ?? 5,
      },
      variants:
        product.variants?.map((variant) => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: Number(variant.price),
          compare_at_price: variant.compare_at_price
            ? Number(variant.compare_at_price)
            : null,
          is_default: variant.is_default,
          inventory: {
            quantity: variant.inventory?.quantity ?? 0,
            low_stock_threshold: variant.inventory?.low_stock_threshold ?? 5,
          },
        })) ?? [],
      weight: product.weight ? Number(product.weight) : 0,
      length: product.length ? Number(product.length) : null,
      width: product.width ? Number(product.width) : null,
      height: product.height ? Number(product.height) : null,
      weight_unit: (product.weight_unit as ProductFormValues["weight_unit"]) ?? "kg",
      dimension_unit:
        (product.dimension_unit as ProductFormValues["dimension_unit"]) ?? "cm",
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
      meta_keywords: product.meta_keywords || "",
      canonical_url: product.canonical_url || "",
    })

    setSlugManual(true)
    setPrimaryPreviewUrl(
      product.primary_image_media?.url
        ? resolveTenantMediaUrl(product.primary_image_media)
        : null
    )
    setPrimaryPreviewTitle(product.primary_image_media?.name ?? product.name)

    const previews: Record<number, { url: string; name?: string | null }> = {}
    for (const item of product.gallery ?? []) {
      const mediaId = item.media_id ?? item.media?.id
      if (!mediaId || !item.media?.url) continue
      previews[mediaId] = {
        url: resolveTenantMediaUrl(item.media),
        name: item.media.name ?? item.alt_text,
      }
    }
    setGalleryPreviews(previews)
  }, [product, form])

  const nameValue = form.watch("name")
  React.useEffect(() => {
    if (isUpdate || slugManual || !nameValue) return
    form.setValue("slug", slugify(nameValue), { shouldDirty: true })
  }, [nameValue, isUpdate, slugManual, form])

  const status = form.watch("status")
  const productType = form.watch("product_type")
  const brandId = form.watch("brand_id")
  const categoryId = form.watch("category_id")
  const gallery = form.watch("gallery") || []
  const variants = form.watch("variants") || []

  const selectedStatus =
    statusOptions.find((item) => item.value === status) ?? statusOptions[0]
  const selectedType =
    typeOptions.find((item) => item.value === productType) ?? typeOptions[0]
  const selectedBrand =
    brandOptions.find((item) => item.value === brandId) ?? null
  const selectedCategory =
    categoryOptions.find((item) => item.value === categoryId) ?? null

  const onSubmit = (data: ProductFormValues) => {
    const payload: ProductFormValues = {
      ...data,
      barcode: data.barcode || null,
      short_description: data.short_description || null,
      description: data.description || null,
      compare_at_price: data.compare_at_price ?? null,
      sale_price: data.sale_price ?? null,
      cost_price: data.cost_price ?? null,
      category_ids:
        data.category_ids && data.category_ids.length > 0
          ? data.category_ids
          : data.category_id
            ? [data.category_id]
            : [],
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      meta_keywords: data.meta_keywords || null,
      canonical_url: data.canonical_url || null,
      weight: data.product_type === "standard" ? (data.weight ?? 0) : data.weight,
    }

    if (isUpdate && product) {
      updateProduct.mutate(
        { id: product.id, product: payload },
        {
          onSuccess: () => {
            toast.success("Product updated successfully")
            router.push("/admin/products")
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update product")
          },
        }
      )
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => {
          toast.success("Product created successfully")
          router.push("/admin/products")
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create product")
        },
      })
    }
  }

  const addGalleryItem = (
    mediaId: number | null,
    media?: { url?: string; title?: string; name?: string; path?: string | null } | null
  ) => {
    if (!mediaId) return
    const next = [
      ...gallery,
      {
        media_id: mediaId,
        sort_order: gallery.length,
        alt_text: media?.title ?? media?.name ?? null,
        is_primary: gallery.length === 0,
      },
    ]
    form.setValue("gallery", next, { shouldDirty: true })
    if (media?.url) {
      setGalleryPreviews((current) => ({
        ...current,
        [mediaId]: {
          url: resolveTenantMediaUrl(media),
          name: media.title ?? media.name,
        },
      }))
    }
  }

  const removeGalleryItem = (index: number) => {
    const removed = gallery[index]
    form.setValue(
      "gallery",
      gallery.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
    if (removed?.media_id) {
      setGalleryPreviews((current) => {
        const next = { ...current }
        delete next[removed.media_id]
        return next
      })
    }
  }

  const addVariant = () => {
    form.setValue(
      "variants",
      [
        ...variants,
        {
          name: `Variant ${variants.length + 1}`,
          sku: `${form.getValues("sku") || "SKU"}-${variants.length + 1}`,
          price: form.getValues("price") || 0,
          is_default: variants.length === 0,
          inventory: { quantity: 0, low_stock_threshold: 5 },
        },
      ],
      { shouldDirty: true }
    )
  }

  const removeVariant = (index: number) => {
    form.setValue(
      "variants",
      variants.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            render={<Link href="/admin/products" />}
            nativeButton={false}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isUpdate ? "Edit product" : "Add product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure catalog details, pricing, inventory, media, and SEO.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/admin/products" />}
            nativeButton={false}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Save product"
                : "Create product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
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
                        setSlugManual(true)
                        form.setValue("slug", event.target.value, {
                          shouldDirty: true,
                        })
                      }}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>SKU *</FieldLabel>
                  <FieldContent>
                    <Input placeholder="SKU-001" {...form.register("sku")} />
                    <FieldError message={form.formState.errors.sku?.message} />
                  </FieldContent>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Barcode</FieldLabel>
                  <FieldContent>
                    <Input placeholder="Barcode" {...form.register("barcode")} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Product type</FieldLabel>
                  <FieldContent>
                    <Combobox
                      items={typeOptions}
                      itemToStringValue={(item) => item.label}
                      value={selectedType}
                      onValueChange={(item) => {
                        if (!item) return
                        form.setValue(
                          "product_type",
                          item.value as ProductFormValues["product_type"]
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
                  </FieldContent>
                </Field>
              </div>
              <Field>
                <FieldLabel>Short description</FieldLabel>
                <FieldContent>
                  <Textarea
                    placeholder="Brief product summary..."
                    {...form.register("short_description")}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    className="min-h-32"
                    placeholder="Full product description..."
                    {...form.register("description")}
                  />
                </FieldContent>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Selling price *</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                  />
                  <FieldError message={form.formState.errors.price?.message} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Compare-at price</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("compare_at_price", {
                      setValueAs: (value) =>
                        value === "" || value === null ? null : Number(value),
                    })}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Sale price</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("sale_price", {
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
                    {...form.register("cost_price", {
                      setValueAs: (value) =>
                        value === "" || value === null ? null : Number(value),
                    })}
                  />
                </FieldContent>
              </Field>
              <div className="flex items-center space-x-2 md:col-span-2">
                <Checkbox
                  id="taxable"
                  checked={form.watch("taxable")}
                  onCheckedChange={(checked) =>
                    form.setValue("taxable", !!checked)
                  }
                />
                <label htmlFor="taxable" className="text-sm font-medium">
                  Charge tax on this product
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field>
                  <FieldLabel>Quantity</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...form.register("inventory.quantity", {
                        valueAsNumber: true,
                      })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Reserved</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      {...form.register("inventory.reserved_quantity", {
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
                      {...form.register("inventory.low_stock_threshold", {
                        valueAsNumber: true,
                      })}
                    />
                  </FieldContent>
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <MediaPickerField
                label="Primary image"
                value={form.watch("primary_image_media_id") ?? null}
                previewUrl={primaryPreviewUrl}
                previewTitle={primaryPreviewTitle}
                onChange={(mediaId, media) => {
                  form.setValue("primary_image_media_id", mediaId)
                  setPrimaryPreviewUrl(
                    media?.url ? resolveTenantMediaUrl(media) : null
                  )
                  setPrimaryPreviewTitle(media?.title ?? media?.name ?? null)
                }}
                accept="image/*"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel>Gallery</FieldLabel>
                  <MediaPickerField
                    label=""
                    value={null}
                    onChange={(mediaId, media) => addGalleryItem(mediaId, media)}
                    accept="image/*"
                  />
                </div>
                {gallery.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No gallery images yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {gallery.map((item, index) => (
                      <div
                        key={`${item.media_id}-${index}`}
                        className="relative rounded-lg border p-2"
                      >
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <GripVertical className="size-3" />
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <MediaThumbnail
                          media={
                            galleryPreviews[item.media_id]
                              ? {
                                  id: item.media_id,
                                  url: galleryPreviews[item.media_id].url,
                                  name:
                                    galleryPreviews[item.media_id].name ??
                                    item.alt_text,
                                }
                              : null
                          }
                          alt={item.alt_text ?? "Gallery image"}
                          size="md"
                          zoomable={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="size-4" />
                Add variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No variants yet. Add size, color, or other options.
                </p>
              ) : (
                variants.map((variant, index) => (
                  <div
                    key={variant.id ?? index}
                    className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-4"
                  >
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <FieldContent>
                        <Input
                          value={variant.name}
                          onChange={(event) => {
                            const next = [...variants]
                            next[index] = {
                              ...next[index],
                              name: event.target.value,
                            }
                            form.setValue("variants", next, { shouldDirty: true })
                          }}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>SKU</FieldLabel>
                      <FieldContent>
                        <Input
                          value={variant.sku}
                          onChange={(event) => {
                            const next = [...variants]
                            next[index] = {
                              ...next[index],
                              sku: event.target.value,
                            }
                            form.setValue("variants", next, { shouldDirty: true })
                          }}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Price</FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(event) => {
                            const next = [...variants]
                            next[index] = {
                              ...next[index],
                              price: Number(event.target.value),
                            }
                            form.setValue("variants", next, { shouldDirty: true })
                          }}
                        />
                      </FieldContent>
                    </Field>
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <Field>
                          <FieldLabel>Stock</FieldLabel>
                          <FieldContent>
                            <Input
                              type="number"
                              value={variant.inventory?.quantity ?? 0}
                              onChange={(event) => {
                                const next = [...variants]
                                next[index] = {
                                  ...next[index],
                                  inventory: {
                                    ...next[index].inventory,
                                    quantity: Number(event.target.value),
                                  },
                                }
                                form.setValue("variants", next, {
                                  shouldDirty: true,
                                })
                              }}
                            />
                          </FieldContent>
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {productType === "standard" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Weight</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.001"
                      {...form.register("weight", { valueAsNumber: true })}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Length</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      step="0.001"
                      {...form.register("length", {
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
                      step="0.001"
                      {...form.register("width", {
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
                      step="0.001"
                      {...form.register("height", {
                        setValueAs: (value) =>
                          value === "" || value === null ? null : Number(value),
                      })}
                    />
                  </FieldContent>
                </Field>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Meta title</FieldLabel>
                <FieldContent>
                  <Input {...form.register("meta_title")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Meta description</FieldLabel>
                <FieldContent>
                  <Textarea {...form.register("meta_description")} />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Meta keywords</FieldLabel>
                <FieldContent>
                  <Input {...form.register("meta_keywords")} />
                </FieldContent>
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Combobox
                    items={statusOptions}
                    itemToStringValue={(item) => item.label}
                    value={selectedStatus}
                    onValueChange={(item) => {
                      if (!item) return
                      form.setValue(
                        "status",
                        item.value as ProductFormValues["status"]
                      )
                      form.setValue("is_visible", item.value === "active")
                    }}
                  >
                    <ComboboxInput placeholder="Select status..." />
                    <ComboboxContent>
                      <ComboboxEmpty>No statuses found.</ComboboxEmpty>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={form.watch("is_featured")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_featured", !!checked)
                  }
                />
                <label htmlFor="is_featured" className="text-sm font-medium">
                  Featured product
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Primary category</FieldLabel>
                <FieldContent>
                  <Combobox
                    items={categoryOptions}
                    itemToStringValue={(item) => item.label}
                    value={selectedCategory}
                    onValueChange={(item) => {
                      form.setValue("category_id", item ? item.value : null)
                      form.setValue(
                        "category_ids",
                        item ? [item.value] : [],
                        { shouldDirty: true }
                      )
                    }}
                  >
                    <ComboboxInput placeholder="Select category..." />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
