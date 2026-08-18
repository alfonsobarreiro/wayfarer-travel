"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, Monitor, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/Container";

/* ── Wireframe block helper ─────────────────────────── */
function WireBlock({
  label,
  children,
  className = "",
  dark = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-5 ${
        dark
          ? "border-neutral-500 bg-neutral-800"
          : "border-neutral-300 bg-white"
      } ${className}`}
    >
      <span
        className={`absolute -top-3 left-4 px-2 text-xs font-bold uppercase tracking-widest ${
          dark ? "bg-neutral-800 text-neutral-400" : "bg-white text-neutral-400"
        }`}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Placeholder({
  w = "w-full",
  h = "h-4",
  className = "",
  dark = false,
}: {
  w?: string;
  h?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${w} ${h} rounded ${
        dark ? "bg-neutral-600" : "bg-neutral-200"
      } ${className}`}
    />
  );
}

function ImageBox({
  className = "",
  dark = false,
  label,
}: {
  className?: string;
  dark?: boolean;
  label?: string;
}) {
  return (
    <div
      className={`rounded border-2 border-dashed flex items-center justify-center ${
        dark
          ? "border-neutral-600 bg-neutral-700/50"
          : "border-neutral-300 bg-neutral-100"
      } ${className}`}
    >
      <svg
        className={`w-8 h-8 ${dark ? "text-neutral-500" : "text-neutral-300"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
        />
      </svg>
      {label && (
        <span
          className={`ml-2 text-xs font-medium ${
            dark ? "text-neutral-500" : "text-neutral-400"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

function ButtonBlock({
  w = "w-28",
  dark = false,
  label,
}: {
  w?: string;
  dark?: boolean;
  label?: string;
}) {
  return (
    <div
      className={`${w} h-9 rounded-md flex items-center justify-center text-xs font-semibold uppercase tracking-wider ${
        dark
          ? "bg-neutral-500 text-neutral-300"
          : "bg-neutral-800 text-white"
      }`}
    >
      {label || "CTA"}
    </div>
  );
}

/* ── Annotation ─────────────────────────────────────── */
function Annotation({ text, side = "right" }: { text: string; side?: "left" | "right" }) {
  return (
    <div
      className={`hidden lg:flex items-center gap-2 absolute top-1/2 -translate-y-1/2 ${
        side === "right" ? "-right-52" : "-left-52"
      }`}
    >
      {side === "left" && (
        <span className="text-xs text-brand-500 font-medium max-w-[160px] text-right">
          {text}
        </span>
      )}
      <div
        className={`w-8 h-px bg-brand-400 ${side === "left" ? "" : ""}`}
      />
      {side === "right" && (
        <span className="text-xs text-brand-500 font-medium max-w-[160px]">
          {text}
        </span>
      )}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function WireframesPage() {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const isDesktop = viewport === "desktop";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <Container className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </Link>
            <div className="h-5 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <h1
                className="text-sm font-bold text-neutral-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Homepage Wireframe
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isDesktop
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !isDesktop
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </Container>
      </div>

      {/* Wireframe canvas */}
      <Container className="py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2">
            Wayfarer Travel
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Homepage — Wireframe
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg">
            Low-fidelity layout showing information architecture, content
            hierarchy, and interaction zones. Five sections, one scroll path,
            one conversion goal.
          </p>
        </div>

        {/* Wireframe container */}
        <div
          className={`mx-auto border border-neutral-200 bg-neutral-100 rounded-xl overflow-hidden shadow-sm transition-all duration-500 ${
            isDesktop ? "max-w-[900px]" : "max-w-[375px]"
          }`}
        >
          {/* Browser chrome */}
          <div className="h-8 bg-neutral-200 flex items-center px-3 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <div className="flex-1 mx-8 h-4 rounded bg-neutral-300" />
          </div>

          <div className="bg-white">
            {/* ── Navbar ─────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
              <Placeholder w="w-24" h="h-5" />
              {isDesktop ? (
                <div className="flex gap-4">
                  <Placeholder w="w-16" h="h-3" />
                  <Placeholder w="w-16" h="h-3" />
                  <Placeholder w="w-12" h="h-3" />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <Placeholder w="w-5" h="h-0.5" />
                  <Placeholder w="w-5" h="h-0.5" />
                  <Placeholder w="w-5" h="h-0.5" />
                </div>
              )}
            </div>

            {/* ── Section 1: Hero ────────────── */}
            <div className="relative">
              <WireBlock label="Section 1 — Hero" className="m-4 !rounded-none !border-brand-300">
                <Annotation text="Full-bleed image with white gradient overlay" />
                <div
                  className={`flex ${
                    isDesktop ? "flex-row" : "flex-col"
                  } gap-6`}
                >
                  <div className={`${isDesktop ? "w-1/2" : "w-full"} space-y-4 py-6`}>
                    <Placeholder w="w-3/4" h="h-7" />
                    <Placeholder w="w-2/3" h="h-7" />
                    <Placeholder w="w-1/2" h="h-7" />
                    <div className="pt-2" />
                    <Placeholder w="w-4/5" h="h-4" />
                    <Placeholder w="w-2/3" h="h-3" />
                    <div className="pt-2 flex gap-3 items-center">
                      <ButtonBlock label="Sign Up" />
                      <Placeholder w="w-28" h="h-3" />
                    </div>
                  </div>
                  {isDesktop && (
                    <div className="w-1/2">
                      <ImageBox className="w-full h-64" />
                    </div>
                  )}
                </div>
                <div className="flex justify-center pt-4">
                  <Placeholder w="w-20" h="h-3" />
                </div>
              </WireBlock>
            </div>

            {/* ── Section 2: Carousel ────────── */}
            <div className="relative">
              <WireBlock label="Section 2 — Destinations Carousel" className="m-4 !rounded-none !border-brand-300">
                <Annotation text="Auto-scrolls left on load, pauses on hover" />
                <div className="flex items-end justify-between mb-4">
                  <div className="space-y-2">
                    <Placeholder w="w-32" h="h-5" />
                    <Placeholder w="w-48" h="h-3" />
                  </div>
                  {isDesktop && (
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs">
                        &larr;
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs">
                        &rarr;
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 overflow-hidden">
                  {Array.from({ length: isDesktop ? 4 : 2 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 space-y-2" style={{ width: isDesktop ? "22%" : "45%" }}>
                      <ImageBox className="w-full aspect-[3/4]" />
                      <Placeholder w="w-3/4" h="h-3" />
                      <Placeholder w="w-full" h="h-2" />
                    </div>
                  ))}
                  {/* Fade-out edge */}
                  <div className="flex-shrink-0 w-12 bg-gradient-to-l from-white to-transparent" />
                </div>
                <div className="flex justify-end pt-3">
                  <Placeholder w="w-32" h="h-3" />
                </div>
              </WireBlock>
            </div>

            {/* ── Section 3: Discover Teaser ── */}
            <div className="relative">
              <WireBlock
                label="Section 3 — Discover Teaser"
                className="m-4 !rounded-none !border-brand-300"
                dark
              >
                <Annotation text="Dark bg, links to /discover globe page" side="left" />
                <div
                  className={`flex ${
                    isDesktop ? "flex-row" : "flex-col"
                  } gap-6 items-center`}
                >
                  <div className={`${isDesktop ? "w-1/2" : "w-full"} space-y-3`}>
                    <Placeholder w="w-20" h="h-2" dark />
                    <Placeholder w="w-3/4" h="h-6" dark />
                    <Placeholder w="w-full" h="h-3" dark />
                    <Placeholder w="w-4/5" h="h-3" dark />
                    <div className="pt-2">
                      <ButtonBlock label="Open Globe" dark />
                    </div>
                  </div>
                  <div className={`${isDesktop ? "w-1/2" : "w-full"} flex justify-center`}>
                    <div className="w-40 h-40 rounded-full border-2 border-dashed border-neutral-500 flex items-center justify-center">
                      <span className="text-neutral-500 text-xs font-medium">3D Globe</span>
                    </div>
                  </div>
                </div>
              </WireBlock>
            </div>

            {/* ── Section 4: Why Wayfarer ──── */}
            <div className="relative">
              <WireBlock label="Section 4 — Why Wayfarer" className="m-4 !rounded-none !border-brand-300">
                <Annotation text="Hover a benefit to swap the image on the right" />
                <div className="space-y-2 mb-4">
                  <Placeholder w="w-20" h="h-2" />
                  <Placeholder w="w-48" h="h-5" />
                </div>
                <div
                  className={`flex ${
                    isDesktop ? "flex-row" : "flex-col"
                  } gap-6`}
                >
                  <div className={`${isDesktop ? "w-1/2" : "w-full"} space-y-0`}>
                    {["01 — Tailored to You", "02 — Go Deeper", "03 — Plan Smarter", "04 — Evolves With You"].map(
                      (item, i) => (
                        <div
                          key={i}
                          className={`py-4 border-t border-dashed border-neutral-200 first:border-t-0 ${
                            i === 0 ? "opacity-100" : "opacity-40"
                          }`}
                        >
                          <div className="flex gap-3">
                            <span className="text-xs font-medium text-neutral-300 w-6 flex-shrink-0">
                              {item.split(" — ")[0]}
                            </span>
                            <div className="space-y-1.5 flex-1">
                              <Placeholder w="w-3/4" h="h-3" />
                              <Placeholder w="w-full" h="h-2" />
                              <Placeholder w="w-5/6" h="h-2" />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {isDesktop && (
                    <div className="w-1/2">
                      <ImageBox className="w-full aspect-square" label="Swaps on hover" />
                    </div>
                  )}
                </div>
              </WireBlock>
            </div>

            {/* ── Section 5: CTA ─────────────── */}
            <div className="relative">
              <WireBlock
                label="Section 5 — Final CTA"
                className="m-4 !rounded-none !border-brand-300"
                dark
              >
                <Annotation text="Parallax background, single conversion action" side="left" />
                <div className="py-8 flex flex-col items-center text-center space-y-3">
                  <Placeholder w="w-32" h="h-2" dark />
                  <Placeholder w={isDesktop ? "w-72" : "w-48"} h="h-6" dark />
                  <Placeholder w={isDesktop ? "w-56" : "w-40"} h="h-6" dark />
                  <div className="pt-1" />
                  <Placeholder w="w-64" h="h-3" dark />
                  <Placeholder w="w-48" h="h-3" dark />
                  <div className="pt-3">
                    <ButtonBlock label="Get Started" dark w="w-36" />
                  </div>
                </div>
              </WireBlock>
            </div>

            {/* ── Footer ─────────────────────── */}
            <div className="px-5 py-6 border-t border-neutral-100">
              <div
                className={`flex ${
                  isDesktop ? "flex-row justify-between" : "flex-col gap-4"
                }`}
              >
                <Placeholder w="w-24" h="h-4" />
                <div className="flex gap-4">
                  <Placeholder w="w-16" h="h-3" />
                  <Placeholder w="w-16" h="h-3" />
                  <Placeholder w="w-12" h="h-3" />
                </div>
                <Placeholder w="w-40" h="h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-10 max-w-[900px] mx-auto">
          <h3
            className="text-sm font-bold text-neutral-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded bg-neutral-200" />
              <span className="text-neutral-600">Text / heading placeholder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded border-2 border-dashed border-neutral-300 bg-neutral-100" />
              <span className="text-neutral-600">Image placeholder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded bg-neutral-800" />
              <span className="text-neutral-600">CTA button</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded border-2 border-dashed border-brand-300" />
              <span className="text-neutral-600">Section boundary</span>
            </div>
          </div>
        </div>

        {/* Design notes */}
        <div className="mt-10 max-w-[900px] mx-auto bg-white border border-neutral-200 rounded-lg p-6">
          <h3
            className="text-sm font-bold text-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Design Decisions
          </h3>
          <div className="space-y-3 text-sm text-neutral-600">
            <p>
              <strong className="text-neutral-800">Single scroll path.</strong>{" "}
              Every section drives toward one goal — get the user exploring
              destinations. No sidebar navigation, no competing CTAs.
            </p>
            <p>
              <strong className="text-neutral-800">Progressive disclosure.</strong>{" "}
              Hero establishes the value prop. Carousel provides social proof
              (real destinations). Discover teaser introduces the interactive
              globe. Benefits section handles objections. Final CTA converts.
            </p>
            <p>
              <strong className="text-neutral-800">Alternating light / dark sections.</strong>{" "}
              Creates natural visual breaks without needing explicit dividers.
              Dark sections (Discover, CTA) signal a shift in content type.
            </p>
            <p>
              <strong className="text-neutral-800">Mobile-first collapse.</strong>{" "}
              Two-column layouts stack vertically. Carousel shows 2 cards
              instead of 4. Globe illustration drops below copy. No content is
              hidden — just reordered.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
