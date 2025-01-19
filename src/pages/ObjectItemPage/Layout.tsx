import { latLngBounds, LatLngLiteral } from "leaflet";
import { useEffect, useState } from "react";
import { ObjectDto } from "../../shared/api/schemas/object";
import { VehicleDto } from "../../shared/api/schemas/vehicle";
import { useSocketInstance } from "../../shared/modules/socket/context/useSocketInstance";
import { Button } from "../../shared/uikit/Button";
import { VehicleList } from "./VehicleList";
import { Point } from "../../shared/api/schemas/point";
import styled from "styled-components";
import { generateId } from "../../shared/helpers/generateId";
import { watchByNavigation } from "../../shared/api/endpoints/watchByNavigation";
import { startNavigate } from "../../shared/api/endpoints/startNavigate";
import { ObjectItemMap } from "../../widgets/ObjectItemMap";
import { PageTitle } from "../../shared/uikit/PageTitle";
import { container } from "../../shared/styled/container";
import { rounded } from "../../shared/styled/rounded";
import { RouteList } from "./RouteList";
import { Route } from "./types/Route";
import { TextLink } from "../../shared/uikit/TextLink";
import toast from "react-hot-toast";

const Wrapper = styled.div`
  ${container}
  padding-top: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MapWrapper = styled.div`
  display: flex;
  min-height: 400px;
  height: 100%;
  max-height: 600px;
  overflow: hidden;
  border: 4px solid var(--line-color);
  ${rounded("m")}
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

type Props = {
  objectItem: ObjectDto;
  vehicles: VehicleDto[];
};

export const ObjectItemPageLayout = ({ objectItem, vehicles }: Props) => {
  const objectBounds = latLngBounds(objectItem.boundary);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoute, setEditingRoute] = useState<
    { id: string; latlng: Point }[]
  >([]);
  const [vehiclesPositions, setVehiclesPositions] = useState<
    Record<VehicleDto["id"], Point | undefined>
  >({});
  const [selectedVehicle, setSelectedVehicle] = useState<
    VehicleDto["id"] | null
  >(null);

  const [routes, setRoutes] = useState<Route[]>([]);
  const socket = useSocketInstance();

  const [vehiclesStatus, setVehicleStatus] = useState<
    Record<VehicleDto["id"], "onRoute" | "idle" | undefined>
  >({});

  const handleRevicedNavigationData = ({
    location,
    vehicleId,
  }: Parameters<Parameters<typeof watchByNavigation>[1]>[0]) => {
    setVehiclesPositions((prev) => ({
      ...prev,
      [vehicleId]: location,
    }));

    setRoutes((prev) => {
      const completedRouteIndex = prev.findIndex((r) => {
        const lastPoint = r.path.slice(-1)[0];
        return (
          r.vehicleId === vehicleId &&
          r.status === "execution" &&
          lastPoint.lat === location.lat &&
          lastPoint.lng === location.lng
        );
      });

      setVehicleStatus((prev) =>
        completedRouteIndex !== -1 ? { ...prev, [vehicleId]: "idle" } : prev
      );

      return prev.map((r, i) =>
        i === completedRouteIndex ? { ...r, status: "done" } : r
      );
    });
  };

  const handleClickStartNavigateButton = async () => {
    const isOutOfBoundary = editingRoute.reduce((acc, point) => {
      if (acc) return true;
      return !objectBounds.contains(point.latlng);
    }, false);
    if (
      selectedVehicle !== null &&
      vehiclesStatus[selectedVehicle] === "onRoute"
    ) {
      return toast.error("Техника выполняет другой маршрут");
    }
    if (isOutOfBoundary) {
      return toast.error("Некоторые точки маршрута выходят за область");
    }
    if (editingRoute.length < 2) {
      return toast.error("Нужно установить как минимум две точки для маршрута");
    }
    if (selectedVehicle === null) {
      return toast.error("Выбирите технику, которая будет выполнять маршрут");
    }
    await startNavigate(socket, {
      id: selectedVehicle,
      path: editingRoute.map((p) => p.latlng),
    });

    setRoutes((prev) =>
      prev.concat({
        id: generateId(),
        vehicleId: selectedVehicle,
        path: editingRoute.map((p) => p.latlng),
        status: "execution",
        isShown: true,
      })
    );
    setVehicleStatus((prev) => ({ ...prev, [selectedVehicle]: "onRoute" }));

    watchByNavigation(socket, handleRevicedNavigationData);

    setEditingRoute([]);
    setIsEditing(false);
    setSelectedVehicle(null);
  };

  const getVehicleStatus = (id: VehicleDto["id"]) =>
    vehiclesStatus[id] ?? "idle";

  useEffect(() => {
    !isEditing && setEditingRoute([]);
  }, [isEditing]);

  return (
    <Wrapper>
      <TextLink to="/objects">{"Назад"}</TextLink>
      <PageTitle>
        {"Объект "}
        {objectItem.name}
      </PageTitle>
      <MapWrapper>
        <ObjectItemMap
          objectBoundary={{ bounds: objectBounds, name: objectItem.name }}
          onAddRoutePoint={(point) =>
            isEditing &&
            setEditingRoute((prev) =>
              prev.concat({ latlng: point, id: generateId() })
            )
          }
          editingRoute={editingRoute}
          onDeleteRoutePoint={(index) =>
            setEditingRoute((prev) => prev.filter((_, i) => i !== index))
          }
          onDragRoutePoint={(point, index) =>
            setEditingRoute((prev) =>
              prev.map((p, i) => (i === index ? { ...p, latlng: point } : p))
            )
          }
          routes={routes.filter((r) => r.isShown)}
          vehicals={
            vehicles
              .map((v) => ({ ...v, location: vehiclesPositions[v.id] }))
              .filter((v) => v.location !== undefined) as Array<
              VehicleDto & { location: LatLngLiteral }
            >
          }
        />
      </MapWrapper>
      <ControlsWrapper>
        <Button disabled={!isEditing} onClick={handleClickStartNavigateButton}>
          Запустить маршрут
        </Button>
        <Button onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? "Сбросить маршрут" : "Построить маршрут"}
        </Button>
      </ControlsWrapper>
      <VehicleList
        onSelectVehicle={(id) =>
          setSelectedVehicle((prev) => (prev === id ? null : id))
        }
        selectedVehicle={selectedVehicle}
        vehicles={vehicles.map((v) => ({
          ...v,
          status: getVehicleStatus(v.id),
        }))}
      />
      {routes.length > 0 && (
        <RouteList
          routes={routes}
          onToggleIsShownRoute={(id) =>
            setRoutes((prev) =>
              prev.map((r) => (r.id === id ? { ...r, isShown: !r.isShown } : r))
            )
          }
        />
      )}
    </Wrapper>
  );
};
