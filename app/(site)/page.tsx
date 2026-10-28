import { Hero } from "@/components/home/hero";
import { ProductRow } from "@/components/home/product-row";
import { EditorialGrid } from "@/components/home/editorial-grid";
import { SeasonalFavorites } from "@/components/home/seasonal-favorites";
import { getProductsByCategory, getCollectionProducts } from "@/data/products";
import { getActiveDeals } from "@/data/deals";

export default async function HomePage() {
  const [scarves, plainSuits, deals] = await Promise.all([
    getProductsByCategory("scarves", 12),
    getCollectionProducts("plain-suits", 12),
    getActiveDeals(),
  ]);

  return (
    <>
      <Hero />
      <ProductRow id="scarves" title="Scarves" products={scarves} viewAllHref="/scarves" />
      <div className="border-y border-border bg-beige/25">
        <ProductRow id="plain-suits" title="Plain Suits" products={plainSuits} viewAllHref="/collection/plain-suits" />
      </div>
      <EditorialGrid deals={deals} />
      <SeasonalFavorites />
    </>
  );
}
