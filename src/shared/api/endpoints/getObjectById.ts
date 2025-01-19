import { z } from "zod";
import { ObjectDto, objectDtoSchema } from "../schemas/object";
import {
  failedResponseSchema,
  successResponseSchema,
} from "../../helpers/createResponseSchema";
import { SocketEmmiter } from "../../modules/socket/utils/SocketEmmiter";

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
