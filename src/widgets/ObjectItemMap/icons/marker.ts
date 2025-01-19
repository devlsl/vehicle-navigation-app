import { icon } from "leaflet";

export const markerIcon = icon({
  iconUrl: `${import.meta.env.VITE_STATIC_URL}/marker.png`,
  iconSize: [20, 26.25],
  iconAnchor: [10, 26.25],
  tooltipAnchor: [0, -26.25],
});
