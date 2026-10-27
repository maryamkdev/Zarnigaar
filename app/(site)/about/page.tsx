import type { Metadata } from "next";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Reveal } from "@/components/shared/reveal";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <PlaceholderImage seed="about-hero" className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
          <h1 className="font-heading text-4xl text-cream sm:text-5xl">Our Story</h1>
        </div>
      </section>

      <div className="container-page max-w-3xl py-16">
        <Reveal>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Discover clothing, scarves, dupattas and accessories from Zarnigaar.
            Browse the collection and find the individual details for each article on its product page.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10" id="craftsmanship">
          <h2 className="font-heading text-2xl">Product Details</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Each article has its own description. Fabric information and care instructions
            appear when provided for that particular product.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <h2 className="font-heading text-2xl">Find Your Style</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Explore the latest arrivals or browse by category to find an article for your wardrobe.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <h2 className="font-heading text-2xl">Questions About an Article?</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If you need more information before ordering, contact us with the article name or SKU.
          </p>
        </Reveal>

        <Reveal delay={0.25} className="mt-10">
          <h2 className="font-heading text-2xl">Clothing &amp; Scarves</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Browse our clothing and scarf collections, then check each product page for available
            sizes, colors and article details.
          </p>
        </Reveal>
      </div>
    </>
  );
}
