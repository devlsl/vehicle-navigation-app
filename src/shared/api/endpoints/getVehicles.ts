import { z } from "zod";
import { successResponseSchema } from "../../helpers/createResponseSchema";
import { vehicleDtoSchema } from "../schemas/vehicle";
import { SocketEmmiter } from "../../modules/socket/utils/SocketEmmiter";

const entityName = "vehicles";

const responseSchema = successResponseSchema(
  200,
  z.object({
    [entityName]: vehicleDtoSchema.array(),
  })
);

export const getVehicles = SocketEmmiter(entityName)
  .bindResponseSchema(responseSchema)
  .create();
