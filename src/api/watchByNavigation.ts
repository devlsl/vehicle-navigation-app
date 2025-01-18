import { z } from "zod";
import { SocketSubscriber } from "./common/SocketSubscriber";
import { vehicleDtoSchema } from "../schemas/vehicle";
import { pointSchema } from "../schemas/point";

const responseSchema = z.object({
  vehicleId: vehicleDtoSchema.shape.id,
  location: pointSchema,
});

export const watchByNavigation = SocketSubscriber("online")
  .bindResponseSchema(responseSchema)
  .create();
