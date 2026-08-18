"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { DestinationImage } from "@/components/DestinationImage";
import { motion } from "framer-motion";
import {
  MapPin,
  Compass,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SignUpModal } from "@/components/form/SignUpModal";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { allDestinations as destinations } from "@/data/destinations";

const benefits = [
  {
    icon: MapPin,
    number: "01",
    title: "Tailored to You",
    description:
      "Destinations matched to your travel style, budget, and interests. Tell us how you travel and we'll show you where.",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
  },
  {
    icon: Compass,
    number: "02",
    title: "Go Deeper",
    description:
      "Local markets over tourist traps. Hidden trails over crowded viewpoints. We surface the places that don't make the first page of search results.",
    image:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    icon: BookOpen,
    number: "03",
    title: "Plan Smarter",
    description:
      "Weather patterns, visa requirements, local customs, budget breakdowns. Everything you'd spend hours researching, organized in one place.",
    image:
      "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Evolves With You",
    description:
      "The more you explore, the sharper your recommendations get. Every save updates your travel profile.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  // Auto-scroll carousel — slow continuous scroll, pause on hover
  const autoScroll = useCallback(() => {
    if (!carouselRef.current || isHoveringCarousel) return;
    const el = carouselRef.current;
    // If we've scrolled to the end, reset to start
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 1;
    }
  }, [isHoveringCarousel]);

  useEffect(() => {
    const id = setInterval(autoScroll, 30); // ~33fps, 1px per tick = slow drift
    return () => clearInterval(id);
  }, [autoScroll]);

  function scrollCarousel(direction: "left" | "right") {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.offsetWidth * 0.7;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────── */}
      <Section variant="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <DestinationImage
            src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1600&q=80"
            fallbackSrc="https://images.unsplash.com/photo-1469521669194-babb45599def?w=1600&q=80"
            alt="Tropical coastline"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 75%, transparent 100%)",
            }}
          />
        </div>

        <Container className="relative z-10 pt-32 pb-20 w-full">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-medium tracking-tight text-neutral-900 mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
              variants={fadeUp}
              custom={0}
            >
              Discover
              <br />
              Unforgettable
              <br />
              New Destinations
            </motion.h1>

            <motion.p
              className="text-base text-neutral-600 mb-8 max-w-md"
              variants={fadeUp}
              custom={1}
            >
              Tell us your travel style, budget, and interests. We&apos;ll
              match you to destinations, plan segments, and hold the whole
              itinerary together.
            </motion.p>

            <motion.div variants={fadeUp} custom={2}>
              {/* One primary action per screen. Nav is ghost so hero owns the primary.
                  Medium 500 weight ceiling per constraint list; text-[0.9375rem] = 15px on-scale. */}
              <button
                onClick={() => setSignUpOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-bg-primary text-white font-medium text-[0.9375rem] hover:bg-bg-primary-hover transition-colors shadow-primary"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </Section>

      {/* ── Destinations Carousel ──────────────────── */}
      <Section className="bg-white">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.h2
                className="text-3xl font-medium tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Destinations
              </motion.h2>
              <p className="text-neutral-500 mt-2">
                {destinations.length} destinations across 7 continents. Swipe
                to browse.
              </p>
            </div>

            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </Container>

        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-4 px-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHoveringCarousel(true)}
          onMouseLeave={() => setIsHoveringCarousel(false)}
        >
          {destinations.slice(0, 7).map((dest, i) => (
            <motion.div
              key={dest.slug}
              className="flex-shrink-0"
              style={{ width: "clamp(280px, 35vw, 420px)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/destinations/${dest.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-md aspect-[3/4] mb-4 img-skeleton">
                  <DestinationImage
                    src={dest.image}
                    fallbackSrc={dest.gallery[0]}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dest.country}
                    </p>
                    <h3
                      className="text-white text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {dest.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-2 group-hover:text-neutral-700 transition-colors">
                  {dest.tagline}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <Container className="mt-8 flex justify-end">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-medium text-link hover:text-link-strong transition-colors"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </Section>

      {/* ── Discover Teaser ──────────────────────── */}
      <Section bg="inverse">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="md:w-1/2">
              <motion.h2
                className="text-3xl font-medium text-white tracking-tight mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Explore the Globe
              </motion.h2>
              <p className="text-neutral-400 mb-8 max-w-md">
                Spin a 3D globe, click any pin, and browse destinations picked
                by hand. {destinations.length}+ places, all in your hands.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-primary text-white font-medium text-sm hover:bg-bg-primary-hover transition-colors"
              >
                Open the Globe
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden">
                <DestinationImage
                  src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80"
                  fallbackSrc="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
                  alt="Globe showing travel destinations"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-neutral-900/20" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-sm font-medium">
                    Spin the globe to explore.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ── Why Wayfarer — split layout with hover image ── */}
      <Section bg="ground">
        <Container>
          <div className="mb-16">
            <motion.h2
              className="text-3xl font-medium text-neutral-900 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Travel that fits your life
            </motion.h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left — benefits list */}
            <div className="lg:w-1/2 space-y-0">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  className={`group cursor-pointer py-8 border-t border-neutral-200 first:border-t-0 first:pt-0 last:pb-0 transition-opacity duration-300 ${
                    hoveredBenefit === i ? "opacity-100" : "lg:opacity-50 lg:hover:opacity-100"
                  }`}
                  onMouseEnter={() => setHoveredBenefit(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div className="flex gap-6">
                    {/* Number */}
                    <span
                      className={`text-2xl md:text-3xl font-medium transition-colors duration-300 flex-shrink-0 w-12 ${
                        hoveredBenefit === i ? "text-brand-500" : "text-neutral-200"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {benefit.number}
                    </span>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <benefit.icon className={`w-5 h-5 transition-colors duration-300 ${
                          hoveredBenefit === i ? "text-brand-600" : "text-neutral-500"
                        }`} />
                        <h3
                          className="text-xl md:text-xl font-bold text-neutral-900"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {benefit.title}
                        </h3>
                      </div>
                      <p className="text-neutral-500 text-sm md:text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right — hover-responsive image */}
            <div className="lg:w-1/2 w-full">
              <div className="relative aspect-square rounded-md overflow-hidden lg:sticky lg:top-28">
                {benefits.map((benefit, i) => (
                  <DestinationImage
                    key={i}
                    src={benefit.image}
                    fallbackSrc={benefits[(i + 1) % benefits.length].image}
                    alt={benefit.title}
                    fill
                    className={`object-cover transition-opacity duration-500 ${
                      hoveredBenefit === i ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                {/* Subtle overlay with active benefit title (the number
                    already appears at size-3xl in the list, so the callout
                    only carries the title). */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="text-white text-xl font-medium"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {benefits[hoveredBenefit].title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── CTA — Parallax ─────────────────────────── */}
      <Section variant="hero" className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469521669194-babb45599def?w=1600&q=80')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Container aligns the section's outer gutter with the rest of the
            homepage; the inner `max-w-3xl mx-auto text-center` is the centered
            CTA column intent (a page-wide centered stack, distinct from the
            "one left rail" prose pattern). */}
        <Container className="relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-medium text-white mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Personalized picks.
            <br />
            Interactive planning.
          </motion.h2>
          <motion.p
            className="text-[1.0625rem] text-white/90 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            All free to start. Sign up and get destination picks matched to
            your travel style within a minute.
          </motion.p>
          <motion.button
            onClick={() => setSignUpOpen(true)}
            className="inline-flex items-center justify-center px-12 py-4 rounded-lg bg-bg-primary text-white font-medium text-base hover:bg-bg-primary-hover transition-colors shadow-primary-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get Started Free
          </motion.button>
          </div>
        </Container>
      </Section>

      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} />
    </>
  );
}
