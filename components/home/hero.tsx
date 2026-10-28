"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import heroImage from "@/public/images/hero-collection.jpeg";

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);

  return (
    <section aria-label="Zarnigaar collection" className="overflow-hidden border-b border-border">
      <div ref={imageRef} className="relative aspect-[1600/612] w-full overflow-hidden bg-beige">
        <motion.div className="absolute inset-0 motion-reduce:transform-none"
          style={{ y: reducedMotion ? 0 : imageY }}>
          <Image src={heroImage} alt="Six outfits displayed on mannequins in a green studio setting"
            fill sizes="100vw" preload placeholder="blur" className="object-cover object-center" />
        </motion.div>
      </div>
    </section>
  );
}
