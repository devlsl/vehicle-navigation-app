import { icon } from "leaflet";

export const vehicleIcon = icon({
  iconUrl: `${import.meta.env.VITE_STATIC_URL}/vehicle.png`,
  iconSize: [36.4, 26],
  className: "animated-movements",
  tooltipAnchor: [0, -13],
});
