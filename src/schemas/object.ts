import { z } from "zod";
import { pointSchema } from "./point";

export const objectDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  boundary: pointSchema.array(),
});

export type ObjectDto = z.infer<typeof objectDtoSchema>;
