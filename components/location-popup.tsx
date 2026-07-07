// components/location-popup.tsx

import { iconMap, LocationFeature } from "@/lib/mapbox/utils"
import { cn } from "@/lib/utils"
import {
  ExternalLink,
  LocateIcon,
  MapPin,
  Navigation,
  Star,
} from "lucide-react"

import { Button } from "./ui/button"
import Popup from "./map/map-popup"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

type LocationPopupProps = {
  location: LocationFeature
  onClose?: () => void
}
export function LocationPopup({ location, onClose }: LocationPopupProps) {
  if (!location) return null

  const { properties, geometry } = location

  const name = properties?.name || "Unknown Location"
  const address = properties?.full_address || properties?.address || ""
  const categories = properties?.poi_category || []
  const brand = properties?.brand?.[0] || ""
  const status = properties?.operational_status || ""
  const maki = properties?.maki || ""

  const lat = geometry?.coordinates?.[1] || properties?.coordinates?.latitude
  const lng = geometry?.coordinates?.[0] || properties?.coordinates?.longitude

  const getIcon = () => {
    const allKeys = [maki, ...(categories || [])]

    for (const key of allKeys) {
      const lower = key?.toLowerCase()
      if (iconMap[lower]) return iconMap[lower]
    }

    return <LocateIcon className="h-5 w-5" />
  }

  return (
    <Popup
      latitude={lat}
      longitude={lng}
      onClose={onClose}
      offset={15}
      closeButton={true}
      closeOnClick={false}
      className="location-popup"
      focusAfterOpen={false}
    >
      <div className="w-[300px] sm:w-[350px]">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-full bg-rose-500/10 p-2">
            {getIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h3 className="truncate text-base font-medium">{name}</h3>
              {status && (
                <Badge
                  variant={status === "active" ? "outline" : "secondary"}
                  className={cn(
                    "text-xs",
                    status === "active" ? "border-green-500 text-green-600" : ""
                  )}
                >
                  {status === "active" ? "Open" : status}
                </Badge>
              )}
            </div>
            {brand && brand !== name && (
              <p className="text-sm font-medium text-muted-foreground">
                {brand}
              </p>
            )}
            {address && (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                <MapPin className="mr-1 inline h-3 w-3 opacity-70" />
                {address}
              </p>
            )}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-3 flex max-w-full flex-wrap gap-1">
            {categories.slice(0, 3).map((category, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="max-w-[100px] truncate text-xs capitalize"
              >
                {category}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{categories.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <Separator className="my-3" />

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                "_blank"
              )
            }}
          >
            <Navigation className="mr-1.5 h-4 w-4" />
            Directions
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
            onClick={() => {
              console.log("Saved location:", location)
            }}
          >
            <Star className="mr-1.5 h-4 w-4" />
            Save
          </Button>

          {properties?.external_ids?.website && (
            <Button
              variant="outline"
              size="sm"
              className="col-span-2 mt-1 flex items-center justify-center"
              onClick={() => {
                window.open(properties.external_ids?.website, "_blank")
              }}
            >
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Visit Website
            </Button>
          )}
        </div>

        <div className="mt-3 border-t pt-2 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="max-w-[170px] truncate">
              ID: {properties?.mapbox_id?.substring(0, 8)}...
            </span>
            <span className="text-right">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </Popup>
  )
}
