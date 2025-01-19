import { getVehicles } from "../../../shared/api/endpoints/getVehicles";
import { ObjectDto } from "../../../shared/api/schemas/object";
import { useLoading } from "../../../shared/hooks/useLoading";
import { useSocketInstance } from "../../../shared/modules/socket/context/useSocketInstance";

export const useObjectVehiclesQuery = (objectId: ObjectDto["id"]) => {
  const socket = useSocketInstance();

  const { data: response, status } = useLoading(() => getVehicles(socket));

  return status === "success"
    ? {
        status,
        vehicles: response.data.vehicles.filter((v) => v.objectId === objectId),
      }
    : { status, vehicles: null };
};
