import { z } from "zod";

export const vehicleDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  objectId: z.number(),
});

export type VehicleDto = z.infer<typeof vehicleDtoSchema>;
