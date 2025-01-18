import { ObjectDto, objectDtoSchema } from "../schemas/object";
import { z } from "zod";
import {
  failedResponseSchema,
  successResponseSchema,
} from "../utils/createResponseSchema";
import { SocketEmmiter } from "./common/SocketEmmiter";

const entityName = "object";

type Payload = Pick<ObjectDto, "id">;

const repsonseSchema = z.union([
  successResponseSchema(
    200,
    z.object({
      [entityName]: objectDtoSchema,
    })
  ),
  failedResponseSchema(404, "object does not exist"),
]);

export const getObjectById = SocketEmmiter("object")
  .bindResponseSchema(repsonseSchema)
  .createWithPayload<Payload>();
