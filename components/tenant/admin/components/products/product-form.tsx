"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toastApiSuccess } from "@/lib/toast-api"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { handleFormApiError } from "@/lib/form-api-errors"
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/tenant/use-product-query"
import {
  getDefaultProductFormValues,
  mapProductToFormValues,
  type StoreProductFormValues,
  storeProductSchema,
  VARIANT_PRODUCT_TYPES,
} from "@/schemas/tenant/product-schema"
import { type Product, resolveProductEnumValue } from "@/types/tenant/product"
import { ProductBasicSection } from "./sections/product-basic-section"
import { ProductPricingSection } from "./sections/product-pricing-section"
import { ProductInventorySection } from "./sections/product-inventory-section"
import { ProductOrganizationSection } from "./sections/product-organization-section"
import { ProductPublishingSection } from "./sections/product-publishing-section"
import { ProductMediaSection } from "./sections/product-media-section"
import { ProductVideosSection } from "./sections/product-videos-section"
import { ProductShippingSection } from "./sections/product-shipping-section"
import { ProductDocumentsSection } from "./sections/product-documents-section"
import { ProductSeoSection } from "./sections/product-seo-section"
import { ProductAttributesSection } from "./sections/product-attributes-section"
import { ProductOptionsSection } from "./sections/product-options-section"
import { ProductVariantsSection } from "./sections/product-variants-section"
import { ProductSuppliersSection } from "./sections/product-suppliers-section"
import { ProductRelatedSection } from "./sections/product-related-section"
import { ProductDownloadsSection } from "./sections/product-downloads-section"
import { ProductBundleSection } from "./sections/product-bundle-section"
import { ProductServiceSection } from "./sections/product-service-section"
import { ProductSubscriptionSection } from "./sections/product-subscription-section"
import { slugify } from "./sections/product-form-shared"

type ProductFormProps = {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isUpdate = !!product
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isSubmitting = createProduct.isPending || updateProduct.isPending
  const [slugManual, setSlugManual] = React.useState(false)
  const stayOnPageRef = React.useRef(false)

  const form = useForm<StoreProductFormValues>({
    resolver: zodResolver(
      storeProductSchema
    ) as Resolver<StoreProductFormValues>,
    defaultValues: getDefaultProductFormValues(),
  })

  React.useEffect(() => {
    if (!product) return

    form.reset(mapProductToFormValues(product))
    setSlugManual(true)
  }, [product, form])

  const nameValue = form.watch("name")
  const productType = form.watch("type")
  const resolvedProductType = resolveProductEnumValue(productType, "simple")
  const isVariableProduct =
    isUpdate && !!product && VARIANT_PRODUCT_TYPES.includes(productType)
  React.useEffect(() => {
    if (isUpdate || slugManual || !nameValue) return
    form.setValue("slug", slugify(nameValue), { shouldDirty: true })
  }, [nameValue, isUpdate, slugManual, form])

  const onSubmit = (data: StoreProductFormValues) => {
    const stayOnPage = stayOnPageRef.current
    stayOnPageRef.current = false

    if (isUpdate && product) {
      updateProduct.mutate(
        { id: product.id, product: data },
        {
          onSuccess: (result) => {
            toastApiSuccess(result.message, "Product updated successfully")
            if (!stayOnPage) {
              router.push("/admin/products")
            }
          },
          onError: (error) => {
            handleFormApiError(error, form.setError, "Failed to update product")
          },
        }
      )
    } else {
      createProduct.mutate(data, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Product created successfully")
          if (stayOnPage) {
            router.push(`/admin/products/${result.data.id}/edit`)
            return
          }
          router.push("/admin/products")
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create product")
        },
      })
    }
  }

  const submitAndContinue = () => {
    stayOnPageRef.current = true
    form.handleSubmit(onSubmit)()
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
              Configure catalog details, default variant, inventory, and media.
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
                ? "Update product"
                : "Create product"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            onClick={submitAndContinue}
          >
            {isSubmitting && <Spinner />}
            {isUpdate ? "Update and continue" : "Save and continue"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <ProductBasicSection
            form={form}
            slugManual={slugManual}
            onSlugManualChange={setSlugManual}
          />
          {isVariableProduct && product ? (
            <>
              <ProductOptionsSection product={product} />
              <ProductVariantsSection product={product} />
            </>
          ) : (
            <>
              <ProductPricingSection form={form} />
              <ProductInventorySection form={form} product={product} />
              <ProductShippingSection form={form} product={product} />
            </>
          )}
          {isUpdate && product && <ProductSuppliersSection product={product} />}
          {isUpdate && product && <ProductRelatedSection product={product} />}
          {isUpdate && product && resolvedProductType === "digital" && (
            <ProductDownloadsSection
              key={`downloads-${product.id}-${product.updated_at ?? ""}`}
              product={product}
            />
          )}
          {isUpdate && product && resolvedProductType === "bundle" && (
            <ProductBundleSection
              key={`bundle-${product.id}-${product.updated_at ?? ""}`}
              product={product}
            />
          )}
          {isUpdate && product && resolvedProductType === "service" && (
            <ProductServiceSection
              key={`service-${product.id}-${product.updated_at ?? ""}`}
              product={product}
            />
          )}
          {isUpdate && product && resolvedProductType === "subscription" && (
            <ProductSubscriptionSection
              key={`subscription-${product.id}-${product.updated_at ?? ""}`}
              product={product}
            />
          )}
          <ProductAttributesSection form={form} />
          <ProductMediaSection form={form} product={product} />
          <ProductVideosSection form={form} />
          {isUpdate && product && <ProductDocumentsSection product={product} />}
          <ProductSeoSection form={form} />
        </div>

        <div className="space-y-6">
          <ProductPublishingSection form={form} />
          <ProductOrganizationSection form={form} />
        </div>
      </div>
    </form>
  )
}
