"use client";

import { use } from "react";
import Image from "next/image";
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
  MapPin,
  Lightbulb,
  Star,
  BadgeCheck,
} from "lucide-react";
import { getDestinationBySlug, allDestinations as destinations } from "@/data/destinations";
import { DestinationMap } from "@/components/map/DestinationMap";
import { notFound } from "next/navigation";

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();

  const otherDests = destinations.filter((d) => d.slug !== slug).slice(0, 3);

  const infoItems = [
    { icon: Calendar, label: "Best Time", value: dest.bestTimeToVisit },
    { icon: Thermometer, label: "Avg Temp", value: dest.avgTemperature },
    { icon: Globe, label: "Language", value: dest.language },
    { icon: Banknote, label: "Currency", value: dest.currency },
    { icon: Clock, label: "Timezone", value: dest.timezone },
  ];

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
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Destinations
            </Link>
            <motion.div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              Curated Experience
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
            >
              {dest.name}
            </motion.h1>
            <motion.p
              className="text-lg text-white/80 flex items-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            >
              <MapPin className="w-4 h-4" />
              {dest.country} &middot; {dest.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                About {dest.name}
              </h2>
              <p className="text-neutral-600 leading-relaxed text-base">
                {dest.longDescription}
              </p>
            </motion.div>

            {/* Gallery */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
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
                <p className="text-sm text-neutral-500 italic">
                  Photo gallery coming soon.
                </p>
              )}
            </div>

            {/* Highlights */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dest.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-3 p-3 rounded-lg bg-brand-50 border border-brand-100"
                  >
                    <Star className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-neutral-700">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
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
            {/* Quick info */}
            <div className="rounded-lg border border-neutral-200 p-6">
              <h3
                className="text-lg font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Quick Info
              </h3>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        {item.label}
                      </p>
                      <p className="text-sm text-neutral-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel tips */}
            <div className="rounded-lg border border-neutral-200 p-6">
              <h3
                className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Lightbulb className="w-5 h-5 text-brand-600" />
                Travel Tips
              </h3>
              <ul className="space-y-3">
                {dest.travelTips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-sm text-neutral-600 leading-relaxed pl-4 border-l-2 border-brand-200"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-lg bg-brand-600 p-6 text-center">
              <h3
                className="text-lg font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready to Go?
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Add {dest.name} to your trip planner.
              </p>
              <Link
                href="/planner"
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-white text-brand-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>

        {/* More destinations */}
        <div className="mt-20 pt-12 border-t border-neutral-200">
          <h2
            className="text-2xl font-bold mb-8"
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
                <div className="relative rounded-lg overflow-hidden aspect-[3/2] mb-3">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-bold text-neutral-900 group-hover:text-brand-700 transition-colors">
                  {d.name}
                </h3>
                <p className="text-sm text-neutral-500">{d.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
