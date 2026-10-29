"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { sectionVisibilitySchema, type SectionVisibilityInput } from "@/lib/validation/homepage-section";

export async function setHomepageSectionVisibility(input: SectionVisibilityInput) {
  const { supabase } = await requireAdmin();
  const parsed = sectionVisibilitySchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Choose a valid section and visibility." };
  const { data, error } = await supabase.from("homepage_sections")
    .update({ enabled: parsed.data.enabled }).eq("section_id", parsed.data.sectionId)
    .select("section_id, enabled").maybeSingle();
  if (error || !data) return { ok: false, message: "Could not save section visibility. Check the website section setup and try again." };
  revalidatePath("/");
  revalidatePath("/admin/sections");
  return { ok: true, message: data.enabled ? "Section shown." : "Section hidden." };
}
