"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plan } from "@/types/central/plan";
import { PlanDialog } from "./plan-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeletePlan } from "@/hooks/central/use-plan-query";
import { Guard } from "@/components/central/components/auth/guard";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

export const columns: ColumnDef<Plan>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Slug" />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Price" />,
    cell: ({ row }) => {
      const price = parseFloat(row.original.price);
      return `$${price.toFixed(2)} ${row.original.currency}`;
    },
  },
  {
    accessorKey: "interval",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Interval" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.interval}</span>
    ),
  },
  {
    accessorKey: "limits",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Limits" />,
    cell: ({ row }) => {
      const limits = row.original.limits;
      if (Array.isArray(limits)) {
        return limits.length > 0 ? limits.join(", ") : "—";
      }
      if (limits && typeof limits === "object") {
        return Object.entries(limits)
          .map(([key, val]) => `${key}: ${val ?? "unlimited"}`)
          .join(", ");
      }
      return "—";
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <Status variant={isActive ? "success" : "default"}>
          <StatusIndicator />
          <StatusLabel>{isActive ? "Active" : "Inactive"}</StatusLabel>
        </Status>
      );
    },
  },
  {
    accessorKey: "is_featured",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Featured" />,
    cell: ({ row }) => (row.original.is_featured ? "Yes" : "No"),
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Order" />,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created" />,
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: function Cell({ row }) {
      const plan = row.original;
      const deletePlan = useDeletePlan();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }/>
          <DropdownMenuContent align="end">
            <Guard permissions="plans.update">
              <PlanDialog plan={plan}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </PlanDialog>
            </Guard>
            <Guard permissions="plans.delete">
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete
                  </DropdownMenuItem>
                }
                title="Delete Plan?"
                description={`This will permanently delete "${plan.name}". This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={() => deletePlan.mutate(plan.id)}
              />
            </Guard>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];