import { ObjectDto } from "../../shared/api/schemas/object.ts";
import { useSocketInstance } from "../../shared/modules/socket/context/useSocketInstance.ts";
import { useLoading } from "../../shared/hooks/useLoading.ts";
import { useParams } from "react-router";
import { NotFoundPage } from "../NotFoundPage.tsx/index.tsx";
import { LoadingPage } from "../LoadingPage.tsx";
import { ObjectItemPageLayout } from "./Layout";
import { getVehicles } from "../../shared/api/endpoints/getVehicles.ts";
import { getObjectById } from "../../shared/api/endpoints/getObjectById.ts";

const useObjectVehiclesQuery = (objectId: ObjectDto["id"]) => {
  const socket = useSocketInstance();

  const { data: response, status } = useLoading(() => getVehicles(socket));

  return status === "success"
    ? {
        status,
        vehicles: response.data.vehicles.filter((v) => v.objectId === objectId),
      }
    : { status, vehicles: null };
};

const useObjectItemQuery = (objectId: ObjectDto["id"]) => {
  const socket = useSocketInstance();
  const { data: response, status } = useLoading(
    () => getObjectById(socket, { id: objectId }),
    [objectId]
  );

  if (status !== "success") return { status, object: null };

  return response.status === 200
    ? {
        status,
        object: response.data.object,
      }
    : { status: "error" as const, object: null };
};

export const ObjectItemPage = () => {
  const id = Number(useParams().id);

  if (Number.isNaN(id)) return <NotFoundPage entityName="Object" />;

  const vehiclesQuery = useObjectVehiclesQuery(id);
  const objectQuery = useObjectItemQuery(id);

  if (objectQuery.status === "success" && vehiclesQuery.status === "success") {
    return (
      <ObjectItemPageLayout
        objectItem={objectQuery.object}
        vehicles={vehiclesQuery.vehicles}
      />
    );
  }
  if (objectQuery.status === "loading" || vehiclesQuery.status === "loading") {
    return <LoadingPage />;
  }

  return null;
};
