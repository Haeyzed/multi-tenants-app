"use client"

import { format } from "date-fns"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { useGetProduct } from "@/hooks/tenant/use-product-query"
import {
  type Product,
  type ProductRelationRef,
  resolveProductEnumLabel,
  resolveProductEnumValue,
} from "@/types/tenant/product"
import { resolveTenantMediaUrl } from "@/lib/tenant-media-url"

type ProductsViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

function getGalleryImages(product: Product) {
  const images: { url: string; alt: string }[] = []

  if (product.primary_image_media?.url) {
    images.push({
      url: resolveTenantMediaUrl(product.primary_image_media),
      alt: product.name,
    })
  }

  for (const item of product.gallery ?? []) {
    if (!item.media?.url) continue
    const url = resolveTenantMediaUrl(item.media)
    if (images.some((image) => image.url === url)) continue
    images.push({
      url,
      alt: item.alt_text ?? product.name,
    })
  }

  return images
}

function resolveRelatedImage(related: Product | ProductRelationRef) {
  const media =
    related.primary_image_media ??
    ("gallery" in related ? related.gallery?.[0]?.media : null) ??
    null

  return media?.url ? resolveTenantMediaUrl(media) : null
}

function renderRelatedProductsGrid(products: ProductRelationRef[] | undefined) {
  if (!products?.length) {
    return "—"
  }

  return (
    <ItemGroup className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {products.map((related) => {
        const imageUrl = resolveRelatedImage(related)
        return (
          <Item key={related.id} variant="outline" size="sm">
            <ItemHeader>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={related.name}
                  width={72}
                  height={72}
                  className="aspect-square w-full rounded-sm object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-sm bg-muted text-[10px] text-muted-foreground">
                  No image
                </div>
              )}
            </ItemHeader>
            <ItemContent>
              <ItemTitle className="line-clamp-2 text-xs">
                {related.name}
              </ItemTitle>
              <ItemDescription className="text-[10px]">
                {related.sku ?? "—"}
              </ItemDescription>
            </ItemContent>
          </Item>
        )
      })}
    </ItemGroup>
  )
}

function getProductViewFields(product: Product): ModuleViewField[] {
  const status = resolveProductEnumValue(product.status, "draft")
  const visibility = resolveProductEnumValue(product.visibility, "visible")
  const galleryImages = getGalleryImages(product)

  return [
    {
      label: "Gallery",
      value:
        galleryImages.length > 0 ? (
          <Carousel className="w-full max-w-md">
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={`${image.url}-${index}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {galleryImages.length > 1 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        ) : (
          "—"
        ),
      className: "col-span-full",
    },
    { label: "SKU", value: product.default_variant?.sku ?? "—" },
    {
      label: "Type",
      value: (
        <Badge variant="outline" className="capitalize">
          {resolveProductEnumLabel(product.type)}
        </Badge>
      ),
    },
    {
      label: "Status",
      value: (
        <Status
          variant={
            status === "active"
              ? "success"
              : status === "draft"
                ? "warning"
                : "default"
          }
        >
          <StatusIndicator />
          <StatusLabel className="capitalize">
            {resolveProductEnumLabel(product.status)}
          </StatusLabel>
        </Status>
      ),
    },
    {
      label: "Visibility",
      value: (
        <Status variant={visibility !== "hidden" ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{resolveProductEnumLabel(product.visibility)}</StatusLabel>
        </Status>
      ),
    },
    {
      label: "Price",
      value: product.default_variant?.price
        ? `$${Number(product.default_variant.price).toFixed(2)}`
        : "—",
    },
    { label: "Brand", value: product.brand?.name ?? "—" },
    {
      label: "Category",
      value:
        product.primary_category?.name ??
        product.categories?.find((category) => category.is_primary)?.name ??
        product.categories?.[0]?.name ??
        "—",
    },
    {
      label: "Tags",
      value:
        product.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "Labels",
      value:
        product.labels?.length ? (
          <div className="flex flex-wrap gap-1">
            {product.labels.map((label) => (
              <Badge key={label.id} variant="outline">
                {label.name}
              </Badge>
            ))}
          </div>
        ) : (
          "—"
        ),
    },
    {
      label: "Featured",
      value: product.is_featured ? "Yes" : "No",
    },
    {
      label: "Created",
      value: product.created_at
        ? format(new Date(product.created_at), "PPP")
        : "—",
    },
    {
      label: "Related products",
      value: renderRelatedProductsGrid(product.related_products),
      className: "col-span-full",
    },
    {
      label: "Cross-sell products",
      value: renderRelatedProductsGrid(product.cross_sell_products),
      className: "col-span-full",
    },
    {
      label: "Upsell products",
      value: renderRelatedProductsGrid(product.up_sell_products),
      className: "col-span-full",
    },
  ]
}

export function ProductsViewDialog({
  open,
  onOpenChange,
  product,
}: ProductsViewDialogProps) {
  const { data: fullProduct, isLoading } = useGetProduct(
    open ? product.id : undefined
  )
  const displayProduct = fullProduct ?? product

  if (open && isLoading && !fullProduct) {
    return (
      <ModuleViewDialog
        open={open}
        onOpenChange={onOpenChange}
        title={product.name}
        description="Loading product details..."
        fields={[
          {
            label: "Loading",
            value: (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ),
            className: "col-span-full",
          },
        ]}
      />
    )
  }

  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title={displayProduct.name}
      description={displayProduct.subtitle ?? "Product details"}
      fields={getProductViewFields(displayProduct)}
    />
  )
}
