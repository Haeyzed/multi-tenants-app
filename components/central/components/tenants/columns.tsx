"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tenant, TenantStatus } from "@/types/central/tenant";
import { TenantDialog } from "./tenant-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDeleteTenant } from "@/hooks/central/use-tenant-query";
import { Guard } from "@/components/central/components/auth/guard";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";

const statusVariantMap: Record<TenantStatus, React.ComponentProps<typeof Status>["variant"]> = {
  active: "success",
  pending: "warning",
  suspended: "error",
};

export const columns: ColumnDef<Tenant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Status variant={statusVariantMap[status]}>
          <StatusIndicator />
          <StatusLabel>{status}</StatusLabel>
        </Status>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const tenant = row.original;
      const deleteTenant = useDeleteTenant();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Guard permissions="tenants.update">
              <TenantDialog tenant={tenant}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </TenantDialog>
            </Guard>
            <Guard permissions="tenants.delete">
              <ConfirmDialog
                trigger={
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete
                  </DropdownMenuItem>
                }
                title="Delete Tenant?"
                description="This action cannot be undone. This will permanently delete the tenant."
                onConfirm={() => deleteTenant.mutate(tenant.id)}
                confirmText="Delete"
                confirmVariant="outline"
              />
            </Guard>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];