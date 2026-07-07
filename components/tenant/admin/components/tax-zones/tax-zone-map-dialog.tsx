"use client"

import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Button } from "@/components/ui/button"
import { TaxZoneMapPreview } from "./tax-zone-map-preview"

type TaxZoneMapDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  latitude: number
  longitude: number
  radiusKm?: number | null
  title?: string
  description?: string
}

export function TaxZoneMapDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  radiusKm,
  title = "Zone Map",
  description = "Geographic location for this tax zone.",
}: TaxZoneMapDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            {description}
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <TaxZoneMapPreview
          latitude={latitude}
          longitude={longitude}
          radiusKm={radiusKm}
        />

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
