// components/location-marker.tsx

import { MapPin } from "lucide-react"

import { LocationFeature } from "@/lib/mapbox/utils"
import Marker from "./map/map-marker"

interface LocationMarkerProps {
  location: LocationFeature
  onHover: (data: LocationFeature) => void
}

export function LocationMarker({ location, onHover }: LocationMarkerProps) {
  return (
    <Marker
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      data={location}
      onHover={({ data }) => {
        onHover(data)
      }}
    >
      <div className="flex size-8 transform cursor-pointer items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition-all duration-200 hover:scale-110">
        <MapPin className="size-4.5 stroke-[2.5px]" />
      </div>
    </Marker>
  )
}
