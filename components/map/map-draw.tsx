"use client";

import DrawControl from "react-map-gl-draw";
import { useMap } from "react-map-gl";

import "react-map-gl-draw/dist/main.css";

export default function MapDraw({
  onCreate,
  onUpdate,
}: {
  onCreate: (evt: any) => void;
  onUpdate: (evt: any) => void;
}) {
  const { map } = useMap();

  if (!map) return null;

  return (
    <DrawControl
      position="top-left"
      displayControlsDefault={false}
      controls={{
        polygon: true,
        trash: true,
      }}
      onCreate={onCreate}
      onUpdate={onUpdate}
    />
  );
}