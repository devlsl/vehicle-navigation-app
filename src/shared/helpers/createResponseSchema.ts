import { z } from "zod";

export const successResponseSchema = <C extends number, D extends z.ZodTypeAny>(
  stutusCode: C,
  dataSchema: D
) =>
  z.object({
    status: z.literal(stutusCode),
    data: dataSchema,
  });

export const failedResponseSchema = <C extends number, M extends string>(
  stutusCode: C,
  message: M
) =>
  z.object({
    status: z.literal(stutusCode),
    message: z.literal(message),
  });
