"use client"

import * as React from "react"
import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { Archive, CheckCircle2, FileEdit, Star, Text } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { MediaThumbnail } from "@/components/tenant/admin/components/shared/media-thumbnail"
import { type Product } from "@/types/tenant/product"
import { DataTableRowActions } from "./data-table-row-actions"

const statusVariant: Record<
  Product["status"],
  React.ComponentProps<typeof Status>["variant"]
> = {
  active: "success",
  draft: "warning",
  archived: "default",
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
            {row.original.sku}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Status variant={statusVariant[status] ?? "default"}>
          <StatusIndicator />
          <StatusLabel className="capitalize">{status}</StatusLabel>
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
    accessorFn: (row) => row.category?.name ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Category" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.category?.name ?? "—"}
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
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Price" />
    ),
    cell: ({ row }) => {
      const price = Number(row.original.selling_price ?? row.original.price)
      return <span>${price.toFixed(2)}</span>
    },
  },
  {
    id: "stock",
    accessorFn: (row) => row.inventory?.quantity ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label="Stock" />
    ),
    cell: ({ row }) => {
      if (!row.original.track_inventory) {
        return <span className="text-muted-foreground">Not tracked</span>
      }
      const qty = row.original.inventory?.available_quantity
        ?? row.original.inventory?.quantity
        ?? 0
      return (
        <span className={row.original.inventory?.is_low_stock ? "text-amber-600" : ""}>
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
