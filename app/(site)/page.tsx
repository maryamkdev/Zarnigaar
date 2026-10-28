import { Hero } from "@/components/home/hero";
import { ProductRow } from "@/components/home/product-row";
import { EditorialGrid } from "@/components/home/editorial-grid";
import { SeasonalFavorites } from "@/components/home/seasonal-favorites";
import { getProductsByCategory } from "@/data/products";
import { getActiveDeals } from "@/data/deals";

export default async function HomePage() {
  const [scarves, articles, deals] = await Promise.all([
    getProductsByCategory("scarves", 12),
    getProductsByCategory("clothing", 48),
    getActiveDeals(),
  ]);

  return (
    <>
      <Hero />
      <ProductRow id="scarves" title="Scarves" products={scarves} viewAllHref="/scarves" />
      <div className="border-y border-border bg-beige/25">
        <ProductRow id="our-articles" title="Our Articles" products={articles} viewAllHref="/women" />
      </div>
      <EditorialGrid deals={deals} />
      <SeasonalFavorites />
    </>
  );
}
