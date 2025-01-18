import { getObjects } from "./api/getObjects";
import { useLoading } from "./hooks/useLoading";
import { ObjectItem } from "./object-item";
import { useSocketInstance } from "./socketContext/useSocketInstance";

export const ObjectList = () => {
  const socket = useSocketInstance();
  const { data, status } = useLoading(() => getObjects(socket), []);

  if (status === "success") {
    return data.data.objects.map((item) => (
      <ObjectItem key={item.id} object={item} />
    ));
  }
  return null;
};
