import { z } from "zod";

export const StrainSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
    z.array(z.boolean()),
    z.null(),
    // Allow nested objects like genetics and grow_info
    z.record(z.unknown()),
  ])
);

export const StrainArraySchema = z.array(StrainSchema);

export type Strain = z.infer<typeof StrainSchema>;
