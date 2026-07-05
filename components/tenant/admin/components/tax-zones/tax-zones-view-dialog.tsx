"use client"

import { format } from "date-fns"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ModuleViewDialog,
  type ModuleViewField,
} from "@/components/tenant/admin/components/shared/module-view-dialog"
import { Badge } from "@/components/ui/badge"
import { type TaxZone } from "@/types/tenant/tax-zone"

type TaxZonesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  taxZone: TaxZone
  onViewMap?: () => void
}

function getTaxZoneViewFields(taxZone: TaxZone): ModuleViewField[] {
  return [
    { label: "Name", value: taxZone.name },
    { label: "Country", value: taxZone.country_code || "All countries" },
    { label: "State", value: taxZone.state || "—" },
    { label: "City", value: taxZone.city || "—" },
    { label: "Postal Code", value: taxZone.postal_code || "—" },
    {
      label: "Postal Pattern",
      value: taxZone.postal_code_pattern || "—",
    },
    { label: "Latitude", value: taxZone.latitude || "—" },
    { label: "Longitude", value: taxZone.longitude || "—" },
    { label: "Radius (km)", value: taxZone.radius_km || "—" },
    {
      label: "Status",
      value: taxZone.is_active ? "Active" : "Inactive",
    },
    {
      label: "Default",
      value: taxZone.is_default ? (
        <Badge variant="secondary">Default</Badge>
      ) : (
        "No"
      ),
    },
    { label: "Rates", value: String(taxZone.rates_count ?? 0) },
    { label: "Sort order", value: String(taxZone.sort_order ?? 0) },
    {
      label: "Created",
      value: taxZone.created_at
        ? format(new Date(taxZone.created_at), "PPP")
        : "—",
    },
  ]
}

export function TaxZonesViewDialog({
  open,
  onOpenChange,
  taxZone,
  onViewMap,
}: TaxZonesViewDialogProps) {
  const latitude = taxZone.latitude ? Number(taxZone.latitude) : null
  const longitude = taxZone.longitude ? Number(taxZone.longitude) : null
  const hasMapCoordinates =
    latitude !== null &&
    !Number.isNaN(latitude) &&
    longitude !== null &&
    !Number.isNaN(longitude)

  return (
    <ModuleViewDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Tax Zone Details"
      description={`Viewing tax zone #${taxZone.id}`}
      fields={getTaxZoneViewFields(taxZone)}
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
