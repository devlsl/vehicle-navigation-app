import styled from "styled-components";
import { Link, useParams } from "react-router";
import { useLoading } from "./hooks/useLoading";
import { getObjectById } from "./api/getObjectById";
import { useSocketInstance } from "./socketContext/useSocketInstance";
import { useEffect, useMemo, useRef, useState } from "react";
import { ObjectDto } from "./schemas/object";
import {
  latLngBounds,
  LatLngExpression,
  Layer,
  LeafletMouseEvent,
  Map,
  Marker,
  marker,
  Polyline,
  polyline,
  rectangle,
} from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { Point } from "./schemas/point";
import { VehicleDto } from "./schemas/vehicle";
import { watchByNavigation } from "./api/watchByNavigation";
import { getVehicles } from "./api/getVehicles";
import { startNavigate } from "./api/startNavigate";

function isPointInRectangle(rectPoints: [Point, Point], point: Point): boolean {
  const [point1, point2] = rectPoints;

  const [latMin, latMax] =
    point1.lat < point2.lat
      ? [point1.lat, point2.lat]
      : [point2.lat, point1.lat];
  const [lngMin, lngMax] =
    point1.lng < point2.lng
      ? [point1.lng, point2.lng]
      : [point2.lng, point1.lng];

  return (
    point.lat >= latMin &&
    point.lat <= latMax &&
    point.lng >= lngMin &&
    point.lng <= lngMax
  );
}

const Wrapper = styled.div`
  border: 1px solid aqua;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ObjectItemPageView = ({ id }: { id: number }) => {
  const socket = useSocketInstance();
  const { data, status } = useLoading(
    () => getObjectById(socket, { id }),
    [id]
  );

  if (status === "success") {
    if (data.status === 404) {
      return <div>object does not found</div>;
    }
    return (
      <Wrapper>
        <Link to={"/objects"}>{"Назад"}</Link>
        <div>{data.data.object.name}</div>
        <MapView objectItem={data.data.object} />
      </Wrapper>
    );
  }
  return null;
};

export const ObjectItemPage = () => {
  const id = Number(useParams().id);

  if (typeof id === "number") {
    return <ObjectItemPageView id={id} />;
  }
  return null;
};

const MapViewWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MapWrapper = styled(MapContainer)`
  border: 1px solid black;
  width: 100%;
  height: 100%;
`;

export const renderMap = (setMap: (map: Map) => void) => (
  <MapWrapper ref={setMap} scrollWheelZoom attributionControl={false}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  </MapWrapper>
);

export const useMapView = (
  renderer: (setMap: (map: Map) => void) => JSX.Element
) => {
  const [map, setMap] = useState<Map | null>(null);

  const mapView = useMemo(() => renderer(setMap), []);

  return {
    mapView,
    map,
  };
};

const MapView = ({ objectItem }: { objectItem: ObjectDto }) => {
  const { map, mapView } = useMapView(renderMap);

  return (
    <MapViewWrapper>
      {map && <MapControls map={map} objectItem={objectItem} />}
      {mapView}
    </MapViewWrapper>
  );
};

// const calcCenter = (a: number, b: number) => {
//   const [min, max] = a < b ? [a, b] : [b, a];
//   return max - (max - min) / 2;
// };

// const calcCenterTwoDirection = (
//   a: [y: number, x: number],
//   b: [y: number, x: number]
// ): [number, number] => [calcCenter(a[0], b[0]), calcCenter(a[1], b[1])];

const MapControls = ({
  map,
  objectItem,
}: {
  map: Map;
  objectItem: ObjectDto;
}) => {
  const boundary = useRef(latLngBounds(objectItem.boundary));

  useEffect(() => {
    const [first, second] = objectItem.boundary;

    map.fitBounds([
      [first.lat, first.lng],
      [second.lat, second.lng],
    ]);

    const rectangleView = rectangle([
      [first.lat, first.lng],
      [second.lat, second.lng],
    ]);

    const handleClick = (e: LeafletMouseEvent) => {
      isEditingRef.current && addFigure(e.latlng);
    };
    rectangleView.on("click", handleClick);

    rectangleView.addTo(map);

    return () => {
      rectangleView.off("click", handleClick);
    };
  }, []);

  const isEditingRef = useRef(false);

  const socket = useSocketInstance();
  const { data: vehicles, status } = useLoading(() => getVehicles(socket));
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  const points = useRef<Marker[]>([]);
  const lines = useRef<Polyline[]>([]);

  const addFigure = (target: { lat: number; lng: number }) => {
    const markerView = marker(target, {
      draggable: true,
    });

    markerView.bindTooltip(points.current.length === 0 ? "Начало" : "Конец", {
      direction: "top",
      offset: [-14, -12],
    });

    points.current.slice(1, points.current.length).forEach((point, i) => {
      point.setTooltipContent(`№${i + 1}`);
    });

    markerView.on("click", () => {
      const index = points.current.findIndex((figure) => figure === markerView);

      if (index === 0 && points.current.length !== 1) {
        lines.current[0].remove();
        lines.current = lines.current.filter((_, i) => i !== 0);
        points.current[0].remove();
        points.current = points.current.filter((_, i) => i !== 0);
      } else if (index === 0) {
        points.current[0].remove();
        points.current = points.current.filter((_, i) => i !== 0);
      } else if (index === points.current.length - 1) {
        lines.current[index - 1].remove();
        lines.current = lines.current.filter((_, i) => i !== index - 1);
        points.current[index].remove();
        points.current = points.current.filter((_, i) => i !== index);
      } else {
        lines.current[index].remove();
        lines.current = lines.current.filter((_, i) => i !== index);

        const prevLine = lines.current[index - 1];
        const first = prevLine.getLatLngs()[0] as LatLngExpression;
        prevLine.setLatLngs([first, points.current[index + 1].getLatLng()]);

        points.current[index].remove();
        points.current = points.current.filter((_, i) => i !== index);
      }

      points.current.forEach((point, i, arr) => {
        if (i === 0) {
          console.log({ i, arr });
          point.setTooltipContent("Начало");
        } else if (i === arr.length - 1) {
          console.log({ i, arr });
          point.setTooltipContent("Конец");
        } else {
          console.log({ i, arr });
          point.setTooltipContent(`№${i}`);
        }
      });
    });

    markerView.on("drag", () => {
      const index = points.current.findIndex((figure) => figure === markerView);

      if (index === 0) {
        const startPoint = points.current[0].getLatLng();
        const nextLine = lines.current[0];
        const endPoint = nextLine.getLatLngs()[1] as LatLngExpression;
        nextLine.setLatLngs([startPoint, endPoint]);
      } else if (index === points.current.length - 1) {
        const endPoint = points.current[index].getLatLng();
        const prevLine = lines.current[index - 1];
        const startPoint = prevLine.getLatLngs()[0] as LatLngExpression;
        prevLine.setLatLngs([startPoint, endPoint]);
      } else {
        const targetPoint = markerView.getLatLng();

        const prevLine = lines.current[index - 1];

        prevLine.setLatLngs([
          prevLine.getLatLngs()[0] as LatLngExpression,
          targetPoint,
        ]);

        const nextLine = lines.current[index];

        nextLine.setLatLngs([
          targetPoint,
          nextLine.getLatLngs()[1] as LatLngExpression,
        ]);
      }
    });

    if (points.current.length > 0) {
      const lineView = polyline(
        [points.current.slice(-1)[0].getLatLng(), target],
        {
          color: "red", // Цвет линии
          weight: 3, // Толщина линии
        }
      );

      lineView.addTo(map);
      lines.current.push(lineView);
    }

    // Добавить круг на карту
    points.current.push(markerView);
    markerView.addTo(map);
  };

  const deleteFigures = () => {
    points.current.forEach((layer) => layer.remove());
    points.current = [];
    lines.current.forEach((line) => line.remove());
    lines.current = [];
  };

  useEffect(() => {
    !isEditing && deleteFigures();
  }, [isEditing]);

  const [selectedVihicle, setSelectedVehicle] = useState<
    VehicleDto["id"] | null
  >(null);

  const vehickleMap = useRef<
    Record<
      VehicleDto["id"],
      { marker: Marker; isExecuting: boolean } | undefined
    >
  >({});

  const handleRevicedNavigationData = (
    data: Parameters<Parameters<typeof watchByNavigation>[1]>[0]
  ) => {
    const vehicle = vehickleMap.current[data.vehicleId];
    console.log({ vehicle });
    if (vehicle !== undefined) {
      vehicle.marker.setLatLng(data.location);

      // добавить проверку на то что маршрут закончился (создать список маршрутов и отобразить выполняемые и законченные марщшруты)
    } else {
      const markerView = marker(data.location);

      markerView.bindTooltip(
        vehicles?.data.vehicles.find((el) => el.id === data.vehicleId)?.name ??
          "",
        {
          direction: "top",
          offset: [-14, -12],
        }
      );

      vehickleMap.current[data.vehicleId] = {
        isExecuting: true,
        marker: markerView,
      };
      markerView.addTo(map);
    }
  };

  return (
    <div>
      <VehiclesList>
        {status === "success" &&
          vehicles.data.vehicles
            .filter((el) => el.objectId === objectItem.id)
            .map((el) => (
              <VehicleItem key={el.id} $isSelected={selectedVihicle === el.id}>
                <p>
                  {vehickleMap.current[el.id]?.isExecuting ?? false
                    ? "В пути"
                    : "На стоянке"}
                </p>
                <button
                  onClick={() =>
                    setSelectedVehicle((prev) =>
                      prev === el.id ? null : el.id
                    )
                  }
                >
                  {"["}
                  {selectedVihicle === el.id ? "✔" : ""}
                  {"]"}
                </button>
                <div>{el.name}</div>
              </VehicleItem>
            ))}
      </VehiclesList>
      <Button
        disabled={!isEditing}
        onClick={async () => {
          const isOutOfBoundary = points.current.reduce((acc, point) => {
            if (acc) return true;
            return !boundary.current.contains(point.getLatLng());
          }, false);
          if (isOutOfBoundary) {
            return alert("Некоторые точки маршрута выходят за область");
          }
          if (points.current.length < 2) {
            return alert("Нужно установить как минимум две точки для маршрута");
          }
          if (selectedVihicle === null) {
            return alert("Выбирите технику, которая будет выполнять маршрут");
          }
          await startNavigate(socket, {
            id: selectedVihicle,
            path: points.current.map((point) => point.getLatLng()),
          });
          watchByNavigation(socket, handleRevicedNavigationData);

          deleteFigures();
          setIsEditing(false);
        }}
      >
        Запустить маршрут
      </Button>
      <Button onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? "Сбросить маршрут" : "Построить маршрут"}
      </Button>
    </div>
  );
};

const VehicleItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "blue" : "black")};
`;
const VehiclesList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border: 1px solid red;
`;

const Button = styled.button`
  padding: 2px 6px;
  border: 1px solid black;
  border-radius: 4px;
`;
