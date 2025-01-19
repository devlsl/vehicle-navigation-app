import { Rectangle } from "react-leaflet";
import { LatLngBounds, LatLngLiteral } from "leaflet";
import { memo } from "react";

type Props = {
  bounds: LatLngBounds;
  name: string;
  onAddRoutePoint: (point: LatLngLiteral) => void;
};

export const ObjectBoundary = memo(({ bounds, onAddRoutePoint }: Props) => (
  <Rectangle
    bounds={bounds}
    eventHandlers={{
      click: (e) => onAddRoutePoint(e.latlng),
    }}
  />
));
