import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import type { Deal } from "@/types/catalog";
import type { HomepageVisibility } from "@/lib/homepage-sections";

function PromoTile({
  seed,
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  dark,
  className,
}: {
  seed: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={ctaHref}
      className={`group relative block h-full min-h-[280px] overflow-hidden ${className ?? ""}`}
    >
      <PlaceholderImage seed={seed} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
      <div className={`absolute inset-0 ${dark ? "bg-ink/45" : "bg-gradient-to-t from-ink/55 via-ink/10 to-transparent"}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-7">
        {eyebrow && <p className="text-[11px] font-medium tracking-[0.2em] text-cream/80">{eyebrow}</p>}
        <h3 className="mt-1 font-heading text-2xl text-cream sm:text-3xl">{title}</h3>
        <p className="mt-2 max-w-xs text-sm text-cream/85">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cream underline-offset-4 group-hover:underline">
          {ctaLabel} <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </span>
      </div>
    </Link>
  );
}

export function EditorialGrid({ deals, visibility }: { deals: Deal[]; visibility: HomepageVisibility }) {
  const tiles = [
    { sectionId: "scarves_promotion", seed: "premium-scarves", title: "Premium Scarves", description: "Add a touch of sophistication to every look.", ctaLabel: "Shop Scarves", ctaHref: "/scarves" },
    { sectionId: "clothing_promotion", seed: "ready-to-wear", title: "Ready to Wear", description: "Comfort meets elegance in every piece.", ctaLabel: "Shop Now", ctaHref: "/women" },
    { sectionId: "accessories_promotion", seed: "accessories", title: "Accessories", description: "The finishing touch to your style.", ctaLabel: "Shop Accessories", ctaHref: "/accessories" },
  ] as const;
  const visibleTiles = tiles.filter(tile => visibility[tile.sectionId]);
  const visibleDeals = visibility.deals ? deals.filter(deal => deal.imageUrl.trim().length > 0) : [];
  if (visibleTiles.length === 0 && visibleDeals.length === 0) return null;

  return (
    <div className="container-page space-y-4 py-12 sm:py-16">
      {visibleTiles.length > 0 && (
        <section aria-label="Featured categories" className={`grid gap-4 ${visibleTiles.length === 3 ? "lg:grid-cols-3" : visibleTiles.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {visibleTiles.map(({ sectionId, ...tile }, index) => (
            <Reveal key={sectionId} delay={index * 0.05} className="h-full">
              <PromoTile {...tile} className="min-h-[340px]" />
            </Reveal>
          ))}
        </section>
      )}
      {visibleDeals.length > 0 && (
        <section aria-label="Deal banners" className="space-y-4">
          {visibleDeals.map(deal => (
            <Reveal key={deal.id}>
              <div className="relative flex min-h-[180px] items-center overflow-hidden bg-ink">
                {/* Admin media URLs may include images outside the optimizer's configured domains. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deal.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                <div className="relative flex w-full flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-heading text-2xl text-cream sm:text-3xl">{deal.title}</h3>
                    <p className="mt-2 max-w-sm text-sm text-cream/80">{deal.description}</p>
                  </div>
                  <Button nativeButton={false} variant="secondary" size="lg" className="rounded-none px-7" render={<Link href={deal.ctaHref}>{deal.ctaLabel}</Link>} />
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      )}
    </div>
  );
}
