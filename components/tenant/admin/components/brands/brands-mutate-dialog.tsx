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
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import { useCreateBrand, useUpdateBrand } from "@/hooks/tenant/use-brand-query"
import { MediaPickerField } from "@/components/tenant/admin/components/media/media-picker-field"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"
import { type Brand } from "@/types/tenant/brand"
import {
  storeBrandSchema,
  updateBrandSchema,
  type StoreBrandFormValues,
  type UpdateBrandFormValues,
} from "@/schemas/tenant/brand-schema"

type BrandsMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Brand
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function BrandsMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: BrandsMutateDialogProps) {
  const isUpdate = !!currentRow
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const isSubmitting = createBrand.isPending || updateBrand.isPending

  const schema = isUpdate ? updateBrandSchema : storeBrandSchema

  const form = useForm<StoreBrandFormValues | UpdateBrandFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      summary: "",
      is_visible: true,
      is_featured: false,
      logo_media_id: null,
      banner_media_id: null,
      meta_title: "",
      meta_description: "",
      website_url: "",
      country_of_origin: "",
      sort_order: 0,
    },
  })

  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null)
  const [logoPreviewTitle, setLogoPreviewTitle] = React.useState<string | null>(
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
        summary: currentRow.summary || "",
        is_visible: currentRow.is_visible,
        is_featured: currentRow.is_featured,
        logo_media_id: currentRow.logo?.id ?? null,
        banner_media_id: currentRow.banner?.id ?? null,
        meta_title: currentRow.meta_title || "",
        meta_description: currentRow.meta_description || "",
        website_url: currentRow.website_url || "",
        country_of_origin: currentRow.country_of_origin || "",
        sort_order: currentRow.sort_order ?? 0,
      })
      setLogoPreviewUrl(
        currentRow.logo?.url ? resolveTenantMediaUrl(currentRow.logo) : null
      )
      setLogoPreviewTitle(currentRow.logo?.name ?? currentRow.name)
      setBannerPreviewUrl(
        currentRow.banner?.url ? resolveTenantMediaUrl(currentRow.banner) : null
      )
      setBannerPreviewTitle(currentRow.banner?.name ?? currentRow.name)
    } else {
      form.reset({
        name: "",
        description: "",
        summary: "",
        is_visible: true,
        is_featured: false,
        logo_media_id: null,
        banner_media_id: null,
        meta_title: "",
        meta_description: "",
        website_url: "",
        country_of_origin: "",
        sort_order: 0,
      })
      setLogoPreviewUrl(null)
      setLogoPreviewTitle(null)
      setBannerPreviewUrl(null)
      setBannerPreviewTitle(null)
    }
  }, [open, currentRow, form])

  const onSubmit = (data: StoreBrandFormValues | UpdateBrandFormValues) => {
    const payload = {
      ...data,
      website_url: data.website_url || null,
      description: data.description || null,
      summary: data.summary || null,
      country_of_origin: data.country_of_origin || null,
      meta_title: data.meta_title || null,
      meta_description: data.meta_description || null,
      is_featured: data.is_featured ?? false,
    }

    if (isUpdate && currentRow) {
      updateBrand.mutate(
        { id: currentRow.id, brand: payload as UpdateBrandFormValues },
        {
          onSuccess: () => {
            toast.success("Brand updated successfully")
            onOpenChange(false)
            form.reset()
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update brand")
          },
        }
      )
    } else {
      createBrand.mutate(payload as StoreBrandFormValues, {
        onSuccess: () => {
          toast.success("Brand created successfully")
          onOpenChange(false)
          form.reset()
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create brand")
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
            {isUpdate ? "Update" : "Create"} Brand
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {isUpdate
              ? "Update the brand by providing necessary info."
              : "Add a new brand by providing necessary info."}{" "}
            Click save when you&apos;re done.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="brands-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Field>
            <FieldLabel>Name *</FieldLabel>
            <FieldContent>
              <Input placeholder="Brand name" {...form.register("name")} />
              <FieldError message={form.formState.errors.name?.message} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Summary</FieldLabel>
            <FieldContent>
              <Input placeholder="Short summary" {...form.register("summary")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Textarea
                placeholder="Brand description..."
                {...form.register("description")}
              />
              <FieldError message={form.formState.errors.description?.message} />
            </FieldContent>
          </Field>

          <MediaPickerField
            label="Logo"
            value={form.watch("logo_media_id") ?? null}
            previewUrl={logoPreviewUrl}
            previewTitle={logoPreviewTitle}
            onChange={(mediaId, media) => {
              form.setValue("logo_media_id", mediaId)
              setLogoPreviewUrl(media?.url ? resolveTenantMediaUrl(media) : null)
              setLogoPreviewTitle(media?.title ?? media?.name ?? null)
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

          {(logoPreviewUrl || bannerPreviewUrl) && isUpdate ? (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              {logoPreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Logo preview</p>
                  <MediaThumbnail
                    media={{ url: logoPreviewUrl, name: logoPreviewTitle }}
                    alt={logoPreviewTitle ?? "Brand logo"}
                    size="md"
                  />
                </div>
              ) : null}
              {bannerPreviewUrl ? (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Banner preview</p>
                  <MediaThumbnail
                    media={{ url: bannerPreviewUrl, name: bannerPreviewTitle }}
                    alt={bannerPreviewTitle ?? "Brand banner"}
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
              <FieldLabel>Website URL</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="https://example.com"
                  {...form.register("website_url")}
                />
                <FieldError message={form.formState.errors.website_url?.message} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Country of origin</FieldLabel>
              <FieldContent>
                <Input
                  placeholder="United States"
                  {...form.register("country_of_origin")}
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

          <Field>
            <FieldLabel>Sort Order</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                {...form.register("sort_order", { valueAsNumber: true })}
              />
            </FieldContent>
          </Field>

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
          <Button type="submit" form="brands-form" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update Brand"
                : "Create Brand"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
