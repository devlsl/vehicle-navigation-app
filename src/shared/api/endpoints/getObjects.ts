import { z } from "zod";
import { successResponseSchema } from "../../helpers/createResponseSchema";
import { objectDtoSchema } from "../schemas/object";
import { SocketEmmiter } from "../../modules/socket/utils/SocketEmmiter";

const entityName = "objects";

const responseSchema = successResponseSchema(
  200,
  z.object({
    [entityName]: objectDtoSchema.array(),
  })
);

export const getObjects = SocketEmmiter(entityName)
  .bindResponseSchema(responseSchema)
  .create();
