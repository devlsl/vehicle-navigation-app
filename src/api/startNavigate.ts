import { Point } from "../schemas/point";
import { VehicleDto } from "../schemas/vehicle";
import { SocketEmmiter } from "./common/SocketEmmiter";

type Payload = {
  id: VehicleDto["id"];
  path: Point[];
};

export const startNavigate =
  SocketEmmiter("start_navigate").createWithPayload<Payload>();
