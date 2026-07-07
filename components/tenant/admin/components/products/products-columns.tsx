"use client"

import * as React from "react"
import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { Archive, CheckCircle2, Eye, EyeOff, FileEdit, Star, Text } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { Badge } from "@/components/ui/badge"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import {
  type Product,
  type ProductStatus,
  resolveProductEnumLabel,
  resolveProductEnumValue,
} from "@/types/tenant/product"
import { DataTableRowActions } from "./data-table-row-actions"

const statusVariant: Record<
  ProductStatus,
  React.ComponentProps<typeof Status>["variant"]
> = {
  active: "success",
  draft: "warning",
  archived: "default",
}

const TYPE_OPTIONS = [
  { label: "Simple", value: "simple" },
  { label: "Variable", value: "variable" },
  { label: "Bundle", value: "bundle" },
  { label: "Digital", value: "digital" },
  { label: "Service", value: "service" },
  { label: "Subscription", value: "subscription" },
  { label: "Gift Card", value: "gift_card" },
  { label: "Configurable", value: "configurable" },
]

const VISIBILITY_OPTIONS = [
  { label: "Visible", value: "visible", icon: Eye },
  { label: "Hidden", value: "hidden", icon: EyeOff },
  { label: "Catalog Only", value: "catalog", icon: Eye },
  { label: "Search Only", value: "search", icon: Eye },
]

function getDefaultVariantInventory(product: Product) {
  return (
    product.default_variant?.inventories?.[0] ??
    product.default_variant?.inventory ??
    null
  )
}

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          (table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Product" />
    ),
    meta: {
      label: "Product",
      placeholder: "Search products...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <MediaThumbnail
          media={row.original.primary_image_media}
          alt={row.original.name}
          size="sm"
          zoomable={false}
        />
        <div className="min-w-0">
          <Link
            href={`/admin/products/${row.original.id}/edit`}
            className="block truncate font-medium hover:underline"
          >
            {row.original.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.default_variant?.sku ?? "—"}
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "type",
    accessorFn: (row) => resolveProductEnumValue(row.type, "simple"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {resolveProductEnumLabel(row.original.type)}
      </Badge>
    ),
    meta: {
      label: "Type",
      variant: "multiSelect",
      options: TYPE_OPTIONS,
    },
    enableColumnFilter: true,
  },
  {
    id: "visibility",
    accessorFn: (row) => resolveProductEnumValue(row.visibility, "visible"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Visibility" />
    ),
    cell: ({ row }) => {
      const visibility = resolveProductEnumValue(
        row.original.visibility,
        "visible"
      )
      const isVisible = visibility !== "hidden"
      return (
        <Status variant={isVisible ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{resolveProductEnumLabel(row.original.visibility)}</StatusLabel>
        </Status>
      )
    },
    meta: {
      label: "Visibility",
      variant: "multiSelect",
      options: VISIBILITY_OPTIONS,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorFn: (row) => resolveProductEnumValue(row.status, "draft"),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const status = resolveProductEnumValue(row.original.status, "draft")
      return (
        <Status variant={statusVariant[status] ?? "default"}>
          <StatusIndicator />
          <StatusLabel className="capitalize">
            {resolveProductEnumLabel(row.original.status)}
          </StatusLabel>
        </Status>
      )
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "active", icon: CheckCircle2 },
        { label: "Draft", value: "draft", icon: FileEdit },
        { label: "Archived", value: "archived", icon: Archive },
      ],
    },
    enableColumnFilter: true,
  },
  {
    id: "category",
    accessorFn: (row) =>
      row.primary_category?.name ??
      row.categories?.find((category) => category.is_primary)?.name ??
      row.categories?.[0]?.name ??
      "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Category" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.primary_category?.name ??
          row.original.categories?.find((category) => category.is_primary)
            ?.name ??
          row.original.categories?.[0]?.name ??
          "—"}
      </span>
    ),
  },
  {
    id: "brand",
    accessorFn: (row) => row.brand?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Brand" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.brand?.name ?? "—"}
      </span>
    ),
  },
  {
    id: "price",
    accessorFn: (row) => row.default_variant?.price ?? "0",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Price" />
    ),
    cell: ({ row }) => {
      const price = Number(row.original.default_variant?.price ?? 0)
      return <span>${price.toFixed(2)}</span>
    },
  },
  {
    id: "stock",
    accessorFn: (row) => getDefaultVariantInventory(row)?.quantity ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Stock" />
    ),
    cell: ({ row }) => {
      if (!row.original.track_inventory) {
        return <span className="text-muted-foreground">Not tracked</span>
      }
      const inventory = getDefaultVariantInventory(row.original)
      const qty = inventory?.available_quantity ?? inventory?.quantity ?? 0
      return (
        <span className={inventory?.is_low_stock ? "text-amber-600" : ""}>
          {qty}
        </span>
      )
    },
  },
  {
    accessorKey: "is_featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Featured" />
    ),
    cell: ({ row }) =>
      row.original.is_featured ? (
        <Star className="size-4 fill-amber-400 text-amber-400" />
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Created" />
    ),
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: 32,
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
]
