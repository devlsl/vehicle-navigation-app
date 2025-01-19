import { getObjectById } from "../../../shared/api/endpoints/getObjectById";
import { ObjectDto } from "../../../shared/api/schemas/object";
import { useLoading } from "../../../shared/hooks/useLoading";
import { useSocketInstance } from "../../../shared/modules/socket/context/useSocketInstance";

export const useObjectItemQuery = (objectId: ObjectDto["id"]) => {
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
