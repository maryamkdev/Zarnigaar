export const HOMEPAGE_SECTIONS = {
  hero: { label: "Hero image", description: "The collection photograph at the top of the home page.", defaultEnabled: true },
  scarves: { label: "Scarves product row", description: "Published products from the Scarves category. Empty rows stay hidden.", defaultEnabled: true },
  our_articles: { label: "Our Articles product row", description: "Published products from the Women category. Empty rows stay hidden.", defaultEnabled: true },
  scarves_promotion: { label: "Scarves promotion tile", description: "Optional placeholder graphic linking to Scarves. Hidden by default.", defaultEnabled: false },
  clothing_promotion: { label: "Ready to Wear promotion tile", description: "Optional placeholder graphic linking to Women. Hidden by default.", defaultEnabled: false },
  accessories_promotion: { label: "Accessories promotion tile", description: "Optional placeholder graphic linking to Accessories. Hidden by default.", defaultEnabled: false },
  deals: { label: "Deal banners", description: "Active deals with uploaded images. Manage the content in Deals.", defaultEnabled: true },
} as const;

export type HomepageSectionId = keyof typeof HOMEPAGE_SECTIONS;
export type HomepageVisibility = Record<HomepageSectionId, boolean>;
export const HOMEPAGE_SECTION_IDS = Object.keys(HOMEPAGE_SECTIONS) as HomepageSectionId[];

export function isHomepageSectionId(value: unknown): value is HomepageSectionId {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(HOMEPAGE_SECTIONS, value);
}

export function resolveHomepageVisibility(rows: readonly { section_id: string; enabled: boolean }[] | null): HomepageVisibility {
  const visibility = Object.fromEntries(HOMEPAGE_SECTION_IDS.map(id => [id, HOMEPAGE_SECTIONS[id].defaultEnabled])) as HomepageVisibility;
  for (const row of rows ?? []) {
    if (isHomepageSectionId(row.section_id) && typeof row.enabled === "boolean") visibility[row.section_id] = row.enabled;
  }
  return visibility;
}
