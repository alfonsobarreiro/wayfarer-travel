"use client";

import { useState } from "react";
import Link from "next/link";
import { DestinationImage } from "@/components/DestinationImage";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Compass, Search, MousePointerClick } from "lucide-react";

import { DestinationMap } from "@/components/map/DestinationMap";
import { useSearch } from "@/components/search/SearchContext";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
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
    <div className="pt-16 min-h-screen bg-bg-surface-inverse">
      {/* Hero */}
      <Section>
        <Container>
          <motion.h1
            className="text-4xl md:text-5xl font-medium text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Explore the Globe
          </motion.h1>
          <motion.p
            className="text-neutral-400 text-base max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          >
            Spin the globe, click any pin, and browse destinations picked
            by hand.
          </motion.p>

          {/* Search — icon + text link, matches the nav pattern; no pill,
              no placeholder, no keyboard-shortcut chip. */}
          <motion.button
            type="button"
            onClick={openSearch}
            className="mt-6 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-white/80 hover:text-white transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.18 } }}
          >
            <Search className="w-4 h-4" />
            <span>Search destinations</span>
          </motion.button>
        </Container>
      </Section>

      {/* Globe + Selected Card */}
      <section className="pb-16">
        <Container>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left — map + adjacent instructional caption */}
          <div className="lg:w-3/5 w-full">
            <DestinationMap
              onSelectDestination={setSelected}
              selectedSlug={selected?.slug}
              className="h-[550px] rounded-lg"
            />
            <p className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
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
                className="bg-bg-surface-inverse rounded-lg border border-neutral-800 overflow-hidden"
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
                  <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white/70 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {selected.country}
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-white font-bold text-xl mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-text-on-inverse-muted text-xs font-medium mb-3">
                    {selected.tagline}
                  </p>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
                    {selected.description}
                  </p>
                  <Link
                    href={`/destinations/${selected.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-text-on-inverse-link hover:text-text-on-inverse-link-hover transition-colors"
                  >
                    View full guide <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-800 p-12 text-center">
                <Compass className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">
                  Click any pin on the globe to explore a destination
                </p>
              </div>
            )}
          </div>
        </div>
        </Container>
      </section>

      {/* Hidden Gems — discovery-focused section */}
      <Section className="bg-bg-surface-inverse">
        <Container>
          <motion.h2
            className="text-3xl font-medium text-white mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Hidden Gems
          </motion.h2>
          <p className="text-neutral-400 mb-12">
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
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white/80 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.country}
                    </div>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-text-on-inverse-link transition-colors text-sm">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {dest.tagline}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-primary text-white font-medium text-sm hover:bg-bg-primary-hover transition-colors"
            >
              Browse all destinations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
