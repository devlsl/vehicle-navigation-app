import { SocketEmmiter } from "../../modules/socket/utils/SocketEmmiter";
import { Point } from "../schemas/point";
import { VehicleDto } from "../schemas/vehicle";

type Payload = {
  id: VehicleDto["id"];
  path: Point[];
};

export const startNavigate =
  SocketEmmiter("start_navigate").createWithPayload<Payload>();
