"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/public/images/hero-collection.jpeg";

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  return (
    <section aria-labelledby="hero-heading" className="overflow-hidden border-b border-border">
      <div ref={imageRef} className="relative aspect-[1600/612] w-full overflow-hidden bg-beige">
        <motion.div className="absolute inset-0 motion-reduce:transform-none"
          style={{ y: reducedMotion ? 0 : imageY }}>
          <Image src={heroImage} alt="Six outfits displayed on mannequins in a green studio setting"
            fill sizes="100vw" preload placeholder="blur" className="object-cover object-center" />
        </motion.div>
      </div>

      <div className="container-page flex flex-col gap-6 py-8 sm:py-10 lg:flex-row lg:items-end lg:justify-between">
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[11px] font-medium tracking-[0.25em] text-muted-foreground">NEW COLLECTION</p>
          <h1 id="hero-heading" className="mt-3 max-w-2xl font-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
            Timeless Elegance, Everyday.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Clothing and signature scarves for your everyday wardrobe.
          </p>
        </motion.div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-4">
          <Button size="lg" className="rounded-none px-6" render={
            <Link href="/new-in" className="inline-flex items-center gap-2">
              Shop New Arrivals <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          } />
          <a href="#scarves" className="inline-flex items-center gap-2 text-xs font-medium underline-offset-4 hover:underline">
            Explore <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
