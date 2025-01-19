import styled from "styled-components";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { LatLngBounds, LatLngLiteral, LeafletMouseEvent } from "leaflet";
import { ObjectBoundary } from "./ObjectBoundary";
import { VehicleDto } from "../../shared/api/schemas/vehicle";
import { markerIcon } from "./icons/marker";
import { vehicleIcon } from "./icons/vehicle";

const MapWrapper = styled(MapContainer)`
  border: 1px solid var(--line-color);
  width: 100%;
  height: 100%;
`;

type Props = {
  objectBoundary: { bounds: LatLngBounds; name: string };
  onAddRoutePoint: (point: LatLngLiteral) => void;
  onDragRoutePoint: (point: LatLngLiteral, index: number) => void;
  onDeleteRoutePoint: (index: number) => void;
  editingRoute: { id: string; latlng: LatLngLiteral }[];
  routes: {
    id: string;
    path: LatLngLiteral[];
    status: "execution" | "done";
  }[];
  vehicals: (VehicleDto & { location: LatLngLiteral })[];
};

export const ObjectItemMap = ({
  objectBoundary: { bounds, name },
  editingRoute,
  onAddRoutePoint,
  onDeleteRoutePoint,
  onDragRoutePoint,
  routes,
  vehicals,
}: Props) => {
  return (
    <MapWrapper bounds={bounds} scrollWheelZoom attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ObjectBoundary
        bounds={bounds}
        name={name}
        onAddRoutePoint={onAddRoutePoint}
      />
      {editingRoute.map((p, i) => (
        <Marker
          key={p.id}
          position={p.latlng}
          icon={markerIcon}
          draggable
          eventHandlers={{
            drag: (e) => onDragRoutePoint((e as LeafletMouseEvent).latlng, i),
            click: () => onDeleteRoutePoint(i),
          }}
        >
          <Tooltip direction="top">
            {i === 0 ? "Начало" : i === editingRoute.length - 1 ? "Конец" : i}
          </Tooltip>
        </Marker>
      ))}
      {vehicals.map((v) => (
        <Marker key={v.id} position={v.location} icon={vehicleIcon}>
          <Tooltip direction="top">{v.name}</Tooltip>
        </Marker>
      ))}
      <Polyline
        positions={editingRoute.map((p) => p.latlng)}
        pathOptions={{ color: "red", weight: 2 }}
      />
      {routes.map((r) => (
        <Polyline
          key={r.id}
          positions={r.path}
          pathOptions={{
            color: r.status === "done" ? "green" : "yellow",
            weight: 2,
          }}
        />
      ))}
    </MapWrapper>
  );
};
