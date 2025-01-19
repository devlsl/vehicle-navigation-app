import { latLng, LatLngBounds } from "leaflet";

export const getTopCenterByBounds = (bounds: LatLngBounds) => {
  const northEast = bounds.getNorthEast(); // Северо-восточная точка
  const northWest = bounds.getNorthWest(); // Северо-западная точка

  const topCenterLat = northEast.lat; // Широта верхней точки (одинакова для обеих)
  const topCenterLng = (northEast.lng + northWest.lng) / 2; // Средняя долгота

  return latLng(topCenterLat, topCenterLng); // Возвращаем как объект LatLng
};
