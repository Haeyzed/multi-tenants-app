import { type UseFormReturn } from "react-hook-form"
import {
  type ProductConditionValue,
  type ProductTypeValue,
  type ProductVisibilityValue,
} from "@/types/tenant/product"
import { type StoreProductFormValues } from "@/schemas/tenant/product-schema"

export type ProductFormSectionProps = {
  form: UseFormReturn<StoreProductFormValues>
}

export type Option<T extends string = string> = { label: string; value: T }

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-sm text-destructive">{message}</p>
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export const productTypeOptions: Option<ProductTypeValue>[] = [
  { label: "Simple", value: "simple" },
  { label: "Variable", value: "variable" },
  { label: "Bundle", value: "bundle" },
  { label: "Digital", value: "digital" },
  { label: "Service", value: "service" },
  { label: "Subscription", value: "subscription" },
  { label: "Gift Card", value: "gift_card" },
  { label: "Configurable", value: "configurable" },
]

export const productVisibilityOptions: Option<ProductVisibilityValue>[] = [
  { label: "Visible", value: "visible" },
  { label: "Hidden", value: "hidden" },
  { label: "Catalog Only", value: "catalog" },
  { label: "Search Only", value: "search" },
]

export const productConditionOptions: Option<ProductConditionValue>[] = [
  { label: "New", value: "new" },
  { label: "Refurbished", value: "refurbished" },
  { label: "Used", value: "used" },
  { label: "Open Box", value: "open_box" },
  { label: "Damaged", value: "damaged" },
]

export const statusOptions: Option<StoreProductFormValues["status"]>[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
]
