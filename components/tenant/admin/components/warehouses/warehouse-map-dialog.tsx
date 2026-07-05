"use client"

import { TaxZoneMapDialog } from "@/components/tenant/admin/components/tax-zones/tax-zone-map-dialog"

type WarehouseMapDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  latitude: number
  longitude: number
  title?: string
  description?: string
}

export function WarehouseMapDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  title = "Warehouse Map",
  description = "Geographic location for this warehouse.",
}: WarehouseMapDialogProps) {
  return (
    <TaxZoneMapDialog
      open={open}
      onOpenChange={onOpenChange}
      latitude={latitude}
      longitude={longitude}
      title={title}
      description={description}
    />
  )
}
