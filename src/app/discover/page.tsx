"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DestinationImage } from "@/components/DestinationImage";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Compass, Search, MousePointerClick } from "lucide-react";
import { DestinationMap } from "@/components/map/DestinationMap";
import { useSearch } from "@/components/search/SearchContext";
import { allDestinations as destinations, type Destination } from "@/data/destinations";

// Preselect Bhutan so the globe is alive on first load and the detail card
// is populated immediately. Falls back to the first destination if Bhutan
// is ever removed from the dataset.
const initialDestination =
  destinations.find((d) => d.slug === "bhutan") ?? destinations[0];

export default function DiscoverPage() {
  const [selected, setSelected] = useState<Destination | null>(initialDestination);
  const { open: openSearch } = useSearch();

  // Curated picks — rotate a handful of hidden gems
  const hiddenGems = destinations.filter(
    (d) =>
      !["tokyo", "marrakech", "new-zealand", "patagonia", "bhutan", "greenland"].includes(
        d.slug
      )
  ).slice(0, 6);

  return (
    <div className="pt-16 min-h-screen bg-neutral-950">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Compass className="w-4 h-4" />
            Interactive Explorer
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Discover Your Next Adventure
          </motion.h1>
          <motion.p
            className="text-neutral-400 text-lg max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          >
            Spin the globe, click any pin, and explore destinations that match
            your curiosity, not an algorithm.
          </motion.p>

          {/* In-page search affordance */}
          <motion.button
            type="button"
            onClick={openSearch}
            className="mt-6 inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm text-white/90 transition-colors min-w-[280px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
          >
            <Search className="w-4 h-4 text-white/70" />
            <span className="flex-1 text-left">Search a country, region, or interest</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-white/80 border border-white/20">
              ⌘K
            </kbd>
          </motion.button>
        </div>
      </section>

      {/* Globe + Selected Card */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left — map + adjacent instructional caption */}
          <div className="lg:w-3/5 w-full">
            <DestinationMap
              onSelectDestination={setSelected}
              selectedSlug={selected?.slug}
              className="h-[550px] rounded-lg"
            />
            <p className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
              <MousePointerClick className="w-3.5 h-3.5" />
              Drag to spin. Click any pin to switch destinations.
            </p>
          </div>

          {/* Right — selected destination */}
          <div className="lg:w-2/5 lg:sticky lg:top-28">
            {selected ? (
              <motion.div
                key={selected.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
              >
                <div className="relative aspect-[16/9]">
                  <DestinationImage
                    src={selected.image}
                    fallbackSrc={selected.gallery[0]}
                    alt={selected.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-1.5 text-white/70 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {selected.country}
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    className="text-white font-bold text-xl mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-brand-400 text-xs font-medium mb-3">
                    {selected.tagline}
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {selected.description}
                  </p>
                  <Link
                    href={`/destinations/${selected.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    View full guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-10 text-center">
                <Compass className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">
                  Click any pin on the globe to explore a destination
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hidden Gems — discovery-focused section */}
      <section className="bg-neutral-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hidden Gems
          </motion.h2>
          <p className="text-neutral-500 mb-10">
            Off-the-beaten-path destinations most travelers overlook.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiddenGems.map((dest, i) => (
              <motion.div
                key={dest.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group block"
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[3/2] mb-3">
                    <DestinationImage
                      src={dest.image}
                      fallbackSrc={dest.gallery[0]}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/80 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.country}
                    </div>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors text-sm">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {dest.tagline}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              Browse all destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
