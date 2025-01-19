import { z } from "zod";
import { vehicleDtoSchema } from "../schemas/vehicle";
import { pointSchema } from "../schemas/point";
import { SocketSubscriber } from "../../modules/socket/utils/SocketSubscriber";

const responseSchema = z.object({
  vehicleId: vehicleDtoSchema.shape.id,
  location: pointSchema,
});

export const watchByNavigation = SocketSubscriber("online")
  .bindResponseSchema(responseSchema)
  .create();
