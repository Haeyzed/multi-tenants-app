"use client"

import { useRef } from "react"
import MapProvider from "@/lib/mapbox/provider"
import MapControls from "@/components/map/map-controls"
import MapStyles from "@/components/map/map-styles"

type TaxZoneMapPreviewProps = {
  latitude: number
  longitude: number
  radiusKm?: number | null
}

export function TaxZoneMapPreview({
  latitude,
  longitude,
}: TaxZoneMapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Preview of the zone location on the map.
      </p>
      <div
        ref={mapContainerRef}
        className="relative h-[360px] w-full overflow-hidden rounded-md border"
      />
      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude,
          latitude,
          zoom: 10,
        }}
      >
        <MapControls />
        <MapStyles />
      </MapProvider>
    </div>
  )
}
