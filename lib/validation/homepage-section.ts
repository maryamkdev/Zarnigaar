import { z } from "zod";
import { HOMEPAGE_SECTION_IDS } from "../homepage-sections";

export const sectionVisibilitySchema = z.object({
  sectionId: z.enum(HOMEPAGE_SECTION_IDS),
  enabled: z.boolean(),
}).strict();

export type SectionVisibilityInput = z.infer<typeof sectionVisibilitySchema>;
