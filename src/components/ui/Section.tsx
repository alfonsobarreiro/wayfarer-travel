import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Section — vertical rhythm primitive.
 *
 * Three variants define the site's section-level vertical scale:
 *   - content: py-16 md:py-24  (default; DS constraint-list rhythm)
 *   - hero:    py-32 md:py-44  (top-of-page marquee sections)
 *   - compact: py-8  md:py-10  (dense app surfaces like the planner header)
 *
 * The `bg` prop routes to the surface tokens in globals.css so callsites
 * express intent (`bg="inverse"`) rather than reaching for the raw
 * `bg-bg-surface-*` utility. `inverse` also flips text to white so the
 * next component doesn't have to remember.
 *
 * Renders as <section>. Container/Prose live INSIDE Section, never around
 * it — Section owns vertical padding, Container owns horizontal gutter.
 */
export type SectionVariant = "content" | "hero" | "compact";
export type SectionBg      = "ground" | "raised" | "inverse";

const VARIANT: Record<SectionVariant, string> = {
  content: "py-16 md:py-24",
  hero:    "py-32 md:py-44",
  compact: "py-8  md:py-10",
};

const BG: Record<SectionBg, string> = {
  ground:  "bg-bg-surface-ground",
  raised:  "bg-bg-surface-raised",
  inverse: "bg-bg-surface-inverse text-white",
};

export interface SectionProps {
  children:   ReactNode;
  variant?:   SectionVariant;
  bg?:        SectionBg;
  className?: string;
}

export function Section({
  children,
  variant   = "content",
  bg,
  className,
}: SectionProps) {
  return (
    <section
      className={cn(VARIANT[variant], bg && BG[bg], className)}
    >
      {children}
    </section>
  );
}
