"use client"

import { format } from "date-fns"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { type Warehouse } from "@/types/tenant/warehouse"

type WarehousesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouse: Warehouse
  onViewMap?: () => void
}

function getWarehouseViewFields(warehouse: Warehouse): ModuleViewField[] {
  return [
    { label: "Name", value: warehouse.name },
    { label: "Code", value: warehouse.code },
    {
      label: "Description",
      value: warehouse.description || "—",
      className: "sm:col-span-2",
    },
    { label: "Address Line 1", value: warehouse.address_line_1 || "—" },
    { label: "Address Line 2", value: warehouse.address_line_2 || "—" },
    { label: "City", value: warehouse.city || "—" },
    { label: "State", value: warehouse.state || "—" },
    { label: "Postal Code", value: warehouse.postal_code || "—" },
    { label: "Country", value: warehouse.country || "—" },
    { label: "Phone", value: warehouse.phone || "—" },
    { label: "Email", value: warehouse.email || "—" },
    { label: "Manager", value: warehouse.manager_name || "—" },
    { label: "Latitude", value: warehouse.latitude ?? "—" },
    { label: "Longitude", value: warehouse.longitude ?? "—" },
    {
      label: "Status",
      value: warehouse.is_active ? "Active" : "Inactive",
    },
    {
      label: "Primary",
      value: warehouse.is_primary ? (
        <Badge variant="secondary">Primary</Badge>
      ) : (
        "No"
      ),
    },
    { label: "Zones", value: String(warehouse.zones_count ?? 0) },
    { label: "Locations", value: String(warehouse.locations_count ?? 0) },
    { label: "Sort Order", value: String(warehouse.sort_order ?? 0) },
    {
      label: "Created",
      value: warehouse.created_at
        ? format(new Date(warehouse.created_at), "PPP")
        : "—",
    },
  ]
}

export function WarehousesViewDialog({
  open,
  onOpenChange,
  warehouse,
  onViewMap,
}: WarehousesViewDialogProps) {
  const latitude = warehouse.latitude ? Number(warehouse.latitude) : null
  const longitude = warehouse.longitude ? Number(warehouse.longitude) : null
  const hasMapCoordinates =
    latitude !== null &&
    !Number.isNaN(latitude) &&
    longitude !== null &&
    !Number.isNaN(longitude)

  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Warehouse Details"
      description={`Viewing warehouse #${warehouse.id}`}
      fields={getWarehouseViewFields(warehouse)}
      footer={
        hasMapCoordinates && onViewMap ? (
          <Button type="button" variant="outline" onClick={onViewMap}>
            <MapPin className="mr-2 h-4 w-4" />
            View on Map
          </Button>
        ) : undefined
      }
    />
  )
}
