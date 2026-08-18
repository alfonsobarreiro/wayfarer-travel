"use client";

import { use } from "react";
import Link from "next/link";
import { DestinationImage } from "@/components/DestinationImage";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Thermometer,
  Globe,
  Banknote,
  Clock,
  Lightbulb,
  Leaf,
} from "lucide-react";

// Categories that earn a sage nature chip. Kept local to this page so the
// list can drift from the /destinations index without touching that file.
const NATURE_CATEGORIES = new Set([
  "nature",
  "mountains",
  "geothermal",
  "waterfalls",
  "arctic",
  "rewilding",
  "landscape",
]);
import { getDestinationBySlug, allDestinations as destinations } from "@/data/destinations";
import { DestinationMap } from "@/components/map/DestinationMap";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { notFound } from "next/navigation";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const isNature = dest.categories.some((c) => NATURE_CATEGORIES.has(c));
  const otherDests = destinations.filter((d) => d.slug !== slug).slice(0, 3);

  const infoItems = [
    { icon: Calendar, label: "Best Time", value: dest.bestTimeToVisit },
    { icon: Thermometer, label: "Avg Temp", value: dest.avgTemperature },
    { icon: Globe, label: "Language", value: dest.language },
    { icon: Banknote, label: "Currency", value: dest.currency },
    { icon: Clock, label: "Timezone", value: dest.timezone },
  ];

  // Travel tips: split on a natural break (em dash, en dash, colon) to extract
  // a title + body. If there's no break, derive a short imperative title from
  // the leading clause so every tip carries the same visual hierarchy.
  function parseTip(tip: string): { title: string; body: string } {
    for (const sep of [" — ", " – ", ": "]) {
      const idx = tip.indexOf(sep);
      if (idx > 2 && idx < 50) {
        return {
          title: tip.slice(0, idx).trim(),
          body:  tip.slice(idx + sep.length).trim(),
        };
      }
    }
    // Heuristic title: first 3–4 words, with leading article dropped.
    const stripped = tip.replace(/^(The|A|An)\s+/i, "");
    const words = stripped.split(/\s+/);
    const titleWords = words.slice(0, Math.min(4, words.length)).join(" ");
    // Strip trailing punctuation from title
    const title = titleWords.replace(/[,.;]$/, "");
    const remainder = words.slice(4).join(" ").replace(/^[,.;]\s*/, "").trim();
    return remainder ? { title, body: remainder } : { title, body: "" };
  }

  return (
    <div className="pt-16">
      {/* Hero — uses dest.image (semantic), falls back to first gallery URL if it 404s */}
      <section className="relative h-[60vh] min-h-[400px]">
        <DestinationImage
          src={dest.image}
          fallbackSrc={dest.gallery[0]}
          alt={dest.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-12 w-full">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[0.9375rem] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Destinations
            </Link>
            {/* Nature chip is the one load-bearing eyebrow here — the
                URL, breadcrumb ("All Destinations"), and H1 already
                establish this is a destination guide, so a "Destination
                Guide" eyebrow would just echo the H1. */}
            {isNature && (
              <motion.div
                className="flex items-center gap-2 mb-4 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sage-500/25 backdrop-blur-sm text-sage-100 border border-sage-300/40 text-xs font-medium">
                  <Leaf className="w-3 h-3" />
                  Nature
                </span>
              </motion.div>
            )}
            <motion.h1
              className="text-[2.5rem] md:text-[3.75rem] font-medium text-white mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
            >
              {dest.name}
            </motion.h1>
            <motion.p
              className="text-neutral-100 text-[1.0625rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            >
              {dest.tagline}
            </motion.p>
          </Container>
        </div>
      </section>

      {/* Content */}
      <Section variant="content">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2
                className="text-[1.75rem] font-medium mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                About {dest.name}
              </h2>
              <p className="text-neutral-600 text-[1.0625rem]">
                {dest.longDescription}
              </p>
            </motion.div>

            {/* Gallery */}
            <div>
              <h2
                className="text-[1.75rem] font-medium mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Gallery
              </h2>
              {dest.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {dest.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      className="relative rounded-lg overflow-hidden aspect-[4/3] img-skeleton"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <DestinationImage
                        src={img}
                        fallbackSrc={dest.image}
                        alt={`${dest.name} ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-[0.9375rem] text-neutral-500 italic">
                  Photo gallery coming soon.
                </p>
              )}
            </div>

            {/* Highlights — info, not actions. No card chrome, no icons that
                read as buttons. Numbered list reads as reference material. */}
            <div>
              <h2
                className="text-[1.75rem] font-medium mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Highlights
              </h2>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 list-none">
                {dest.highlights.map((h, i) => (
                  <li
                    key={h}
                    className="flex items-baseline gap-3 text-neutral-800"
                  >
                    <span className="text-xs font-mono text-neutral-400 tabular-nums w-5 flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.0625rem]">{h}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Map */}
            <div>
              <h2
                className="text-[1.75rem] font-medium mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Location
              </h2>
              <DestinationMap
                selectedSlug={dest.slug}
                className="h-[350px]"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick info — Best Time is the most decision-relevant row,
                so it gets visual weight: brand swatch, larger value, heavier
                type. Supporting rows step down to a calmer hierarchy. */}
            <div className="rounded-lg border border-neutral-200 p-6">
              <h3
                className="text-xl font-medium mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Quick Info
              </h3>

              {/* Best Time — promoted row (the one load-bearing eyebrow
                  in this card; supporting rows below use sentence-case
                  labels so nothing else competes with it). */}
              <div className="-mx-6 px-6 py-4 mb-6 bg-bg-chip border-y border-border-chip-subtle">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-link-strong mt-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-link-strong mb-1">
                      Best time to visit
                    </p>
                    <p className="text-[1.0625rem] font-medium text-neutral-900">
                      {dest.bestTimeToVisit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting rows */}
              <dl className="space-y-3">
                {infoItems.slice(1).map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <dt className="text-xs font-medium text-neutral-500">
                        {item.label}
                      </dt>
                      <dd className="text-[0.9375rem] font-medium text-neutral-900">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Travel tips — each tip rendered as a titled block instead of a
                fragmented snippet. Title = leading clause or the part before a
                natural separator; body = the rest. */}
            <div className="rounded-lg border border-neutral-200 p-6">
              <h3
                className="text-xl font-medium mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {/* Cognac accent on tips reads as editorial supporting
                    voice next to navy primary chrome. */}
                <Lightbulb className="w-5 h-5 text-neutral-500" />
                Travel Tips
              </h3>
              <ul className="space-y-4">
                {dest.travelTips.map((tip, i) => {
                  const { title, body } = parseTip(tip);
                  return (
                    <li key={i} className="pl-4 border-l-2 border-border-chip">
                      <p className="text-[0.9375rem] font-medium text-neutral-900">
                        {title}
                      </p>
                      {body && (
                        <p className="text-[0.9375rem] text-neutral-600 mt-1">
                          {body}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-lg bg-bg-primary p-6">
              <h3
                className="text-xl font-medium text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Save {dest.name} for later
              </h3>
              <p className="text-[0.9375rem] text-white/80 mb-4">
                Send it to your trip planner in one click.
              </p>
              <Link
                href="/planner"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-link-strong font-medium text-[0.9375rem] hover:bg-neutral-50 transition-colors"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>

        {/* More destinations */}
        <div className="mt-20 pt-12 border-t border-neutral-200">
          <h2
            className="text-[1.75rem] font-medium mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            More Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherDests.map((d) => (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                className="group block"
              >
                <div className="relative rounded-lg overflow-hidden aspect-[3/2] mb-4">
                  <DestinationImage
                    src={d.image}
                    fallbackSrc={d.gallery[0]}
                    alt={d.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3
                  className="text-[1.25rem] font-medium text-neutral-900 mb-1 group-hover:text-link-strong transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {d.name}
                </h3>
                <p className="text-[0.9375rem] text-neutral-500">{d.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
        </Container>
      </Section>
    </div>
  );
}
