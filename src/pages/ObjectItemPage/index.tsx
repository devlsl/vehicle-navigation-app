import { useParams } from "react-router";
import { NotFoundPage } from "../NotFoundPage.tsx/index.tsx";
import { LoadingPage } from "../LoadingPage.tsx";
import { ObjectItemPageLayout } from "./Layout";
import { useObjectVehiclesQuery } from "./hooks/useObjectVehiclesQuery.ts";
import { useObjectItemQuery } from "./hooks/useObjectItemQuery.ts";

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
