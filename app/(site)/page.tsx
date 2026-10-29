import { Hero } from "@/components/home/hero";
import { ProductRow } from "@/components/home/product-row";
import { EditorialGrid } from "@/components/home/editorial-grid";
import { getProductsByCategory } from "@/data/products";
import { getActiveDeals } from "@/data/deals";
import { getHomepageSections } from "@/data/homepage-sections";

export default async function HomePage() {
  const { visibility } = await getHomepageSections();
  const [scarves, articles, deals] = await Promise.all([
    visibility.scarves ? getProductsByCategory("scarves", 12) : Promise.resolve([]),
    visibility.our_articles ? getProductsByCategory("clothing", 48) : Promise.resolve([]),
    visibility.deals ? getActiveDeals() : Promise.resolve([]),
  ]);

  return (
    <>
      {visibility.hero && <Hero />}
      {visibility.scarves && scarves.length > 0 && <ProductRow id="scarves" title="Scarves" products={scarves} viewAllHref="/scarves" />}
      {visibility.our_articles && articles.length > 0 && (
        <div className="border-y border-border bg-beige/25">
          <ProductRow id="our-articles" title="Our Articles" products={articles} viewAllHref="/women" />
        </div>
      )}
      <EditorialGrid deals={deals} visibility={visibility} />
    </>
  );
}
