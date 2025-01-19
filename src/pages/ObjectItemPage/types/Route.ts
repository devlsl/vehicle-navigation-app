import { Point } from "../../../shared/api/schemas/point";
import { VehicleDto } from "../../../shared/api/schemas/vehicle";

export type Route = {
  id: string;
  path: Point[];
  vehicleId: VehicleDto["id"];
  status: "execution" | "done";
  isShown: boolean;
};
