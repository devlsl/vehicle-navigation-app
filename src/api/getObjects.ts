import { objectDtoSchema } from "../schemas/object";
import { z } from "zod";
import { successResponseSchema } from "../utils/createResponseSchema";
import { SocketEmmiter } from "./common/SocketEmmiter";

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
