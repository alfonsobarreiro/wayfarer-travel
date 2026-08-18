"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DestinationImage } from "@/components/DestinationImage";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Globe, SlidersHorizontal, Search, Leaf } from "lucide-react";
import { DestinationMap } from "@/components/map/DestinationMap";
import { useSearch } from "@/components/search/SearchContext";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  allDestinations as destinations,
  type Destination,
} from "@/data/destinations";

// Preselect Bhutan so the map is alive on first load.
const initialDestination =
  destinations.find((d) => d.slug === "bhutan") ?? destinations[0];

// Nature-themed categories flag destinations that earn a sage "Nature" pill.
// Sage is the secondary brand color and its explicit UI role in Wayfarer is
// this tag family + success states — so it stays legible as a signal.
const NATURE_CATEGORIES = new Set([
  "nature",
  "mountains",
  "geothermal",
  "waterfalls",
  "arctic",
  "rewilding",
  "landscape",
]);

function isNatureDest(cats: string[]): boolean {
  return cats.some((c) => NATURE_CATEGORIES.has(c));
}

const continents = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

export default function DestinationsPage() {
  const [selected, setSelected] = useState<Destination | null>(initialDestination);
  const [activeContinent, setActiveContinent] = useState("All");
  const { open: openSearch } = useSearch();

  const filtered = useMemo(() => {
    if (activeContinent === "All") return destinations;
    return destinations.filter((d) => d.continent === activeContinent);
  }, [activeContinent]);

  // Count per continent for badge display
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: destinations.length };
    for (const d of destinations) {
      map[d.continent] = (map[d.continent] || 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <Section className="bg-bg-surface-inverse text-white">
        <Container>
          {/* Editorial eyebrow — cognac accent is Wayfarer's Guide-page
              signature; used sparingly (one per zone). */}
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-300 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Curated Selection
          </motion.p>
          <motion.h1
            className="text-4xl md:text-5xl font-medium mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
          >
            Top Spots
          </motion.h1>
          <motion.p
            className="text-neutral-400 text-base max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          >
            {destinations.length} curated destinations across{" "}
            {Object.keys(counts).length - 1} continents. Filter by region or
            click any pin on the globe.
          </motion.p>

          {/* In-page search affordance (opens the global overlay) */}
          <motion.button
            type="button"
            onClick={openSearch}
            className="mt-6 inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm text-white/90 transition-colors min-w-[280px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
          >
            <Search className="w-4 h-4 text-white/70" />
            <span className="flex-1 text-left">Search a country, region, or interest</span>
            <kbd className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/15 text-white/80 border border-white/20">
              ⌘K
            </kbd>
          </motion.button>
        </Container>
      </Section>

      {/* Map */}
      <section className="-mt-8 relative z-10">
        <Container>
          <DestinationMap
            onSelectDestination={setSelected}
            selectedSlug={selected?.slug}
            className="h-[500px] shadow-xl"
          />
        </Container>
      </section>

      {/* Selected destination quick card */}
      <AnimatePresence>
        {selected && (
          <motion.section
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={selected.slug}
          >
            <Container>
            <div className="bg-white rounded-lg border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm">
              <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 img-skeleton">
                <DestinationImage
                  src={selected.image}
                  fallbackSrc={selected.gallery[0]}
                  alt={selected.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 192px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold text-neutral-900 mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {selected.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-brand-600 font-medium">
                    {selected.tagline}
                  </p>
                  {isNatureDest(selected.categories) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-success-muted text-text-success border border-sage-300 text-[11px] font-medium">
                      <Leaf className="w-3 h-3" />
                      Nature
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 mb-4">
                  {selected.description}
                </p>
                <Link
                  href={`/destinations/${selected.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
                >
                  View full guide <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Filter + Grid */}
      <Section>
        <Container>
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              All Destinations
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
              {activeContinent !== "All" ? ` in ${activeContinent}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 mr-1" />
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setActiveContinent(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeContinent === c
                    ? "bg-bg-primary text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {c}
                {counts[c] ? (
                  <span className="ml-1 opacity-60">{counts[c]}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.35 }}
              >
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group block"
                  onMouseEnter={() => setSelected(dest)}
                >
                  <div className="relative rounded-lg overflow-hidden aspect-[3/2] mb-4 img-skeleton">
                    <DestinationImage
                      src={dest.image}
                      fallbackSrc={dest.gallery[0]}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {dest.country}
                      </span>
                    </div>
                    {isNatureDest(dest.categories) && (
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-success-muted text-text-success border border-sage-300 text-xs font-medium">
                        <Leaf className="w-3 h-3" />
                        Nature
                      </div>
                    )}
                  </div>
                  <h3
                    className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-brand-700 transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {dest.name}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {dest.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Globe className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">
              No destinations found for {activeContinent}. Try another region.
            </p>
          </div>
        )}
        </Container>
      </Section>
    </div>
  );
}
