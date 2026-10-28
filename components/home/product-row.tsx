"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import type { Product } from "@/types/catalog";

export function ProductRow({ id, title, products, viewAllHref }: {
  id: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();
  const [edges, setEdges] = useState({ previous: false, next: false });

  function updateEdges() {
    const track = trackRef.current;
    if (!track) return;
    const previous = track.scrollLeft > 2;
    const next = track.scrollLeft + track.clientWidth < track.scrollWidth - 2;
    setEdges((current) => current.previous === previous && current.next === next ? current : { previous, next });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, [products.length]);

  function scroll(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="container-page scroll-mt-28 py-12 sm:py-16">
      <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-5 sm:mb-9">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Explore the collection</p>
          <h2 id={`${id}-heading`} className="font-heading text-3xl sm:text-4xl">{title}</h2>
        </div>
        <div className="flex items-center gap-5">
          {viewAllHref && products.length > 0 && (
            <Link href={viewAllHref} className="text-xs font-medium underline underline-offset-4">View all {title.toLowerCase()}</Link>
          )}
          {products.length > 0 && (
            <div className="flex gap-2">
              <button type="button" aria-label={`Previous ${title.toLowerCase()}`} aria-controls={`${id}-products`}
                disabled={!edges.previous} onClick={() => scroll(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-30">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Next ${title.toLowerCase()}`} aria-controls={`${id}-products`}
                disabled={!edges.next} onClick={() => scroll(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-30">
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </Reveal>
      {products.length === 0 ? (
        <p className="border-y border-border py-12 text-center text-sm text-muted-foreground">New articles will appear here as they are added.</p>
      ) : (
        <>
          <ul ref={trackRef} id={`${id}-products`} tabIndex={0} aria-label={`${title} products`} onScroll={updateEdges}
            className="grid auto-cols-[76%] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-5 sm:auto-cols-[44%] lg:auto-cols-[calc((100%_-_3.75rem)/4)] motion-reduce:scroll-auto [scrollbar-width:thin] focus-visible:outline-2 focus-visible:outline-offset-4">
            {products.map((product, index) => (
              <li key={product.id} className="min-w-0 snap-start">
                <Reveal delay={Math.min(index * 0.04, 0.16)}><ProductCard product={product} /></Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground sm:hidden">Swipe to explore <span aria-hidden="true">&rarr;</span></p>
        </>
      )}
    </section>
  );
}
