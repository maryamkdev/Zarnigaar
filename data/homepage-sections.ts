import "server-only";
import { createClient } from "@/lib/supabase/server";
import { HOMEPAGE_SECTION_IDS, resolveHomepageVisibility } from "@/lib/homepage-sections";

export async function getHomepageSections() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homepage_sections").select("section_id, enabled");
  // Safe defaults keep unused placeholder tiles hidden before migration or during an outage.
  const rows = error ? null : data;
  return {
    visibility: resolveHomepageVisibility(rows),
    configured: !error && HOMEPAGE_SECTION_IDS.every(id => rows?.some(row => row.section_id === id)),
  };
}
