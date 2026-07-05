import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogClose,
} from "@/components/ui/responsive-dialog";
import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapControls from "@/components/map/map-controls";
import MapSearch from "@/components/map/map-search";

interface TaxZoneMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates?: { longitude: number; latitude: number };
}

export function TaxZoneMapDialog({
  open,
  onOpenChange,
  coordinates = { longitude: -122.4194, latitude: 37.7749 },
}: TaxZoneMapDialogProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-4xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Tax Zone Map</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Viewing the tax zone area.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div
          id="map-container"
          ref={mapContainerRef}
          className="relative h-[400px] w-full"
        />
        <MapProvider
          mapContainerRef={mapContainerRef}
          initialViewState={{
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
            zoom: 10,
          }}
        >
          <MapSearch />
          <MapControls />
          <MapStyles />
        </MapProvider>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={
            <Button type="button" variant="outline">
              Close
            </Button>
          }>
          </ResponsiveDialogClose>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}