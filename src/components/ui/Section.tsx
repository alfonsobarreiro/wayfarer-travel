import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Section — vertical rhythm primitive.
 *
 * Two variants define the site's only section-level vertical scale:
 *   - content: py-20 md:py-28  (default; ordinary page sections)
 *   - hero:    py-32 md:py-44  (top-of-page marquee sections)
 *
 * The `bg` prop is a semantic role hook that will map to surface tokens
 * once they land in Bundle 2. For now it is a passthrough — pass any
 * `bg-*` utility via `className` and it will merge after the base rhythm.
 * Kept in the API surface now so call-sites can stabilize on it early.
 *
 * Renders as <section>. Container/Prose live INSIDE Section, never around
 * it — Section owns vertical padding, Container owns horizontal gutter.
 */
export type SectionVariant = "content" | "hero";
export type SectionBg      = "ground" | "raised" | "inverse";

const VARIANT: Record<SectionVariant, string> = {
  content: "py-20 md:py-28",
  hero:    "py-32 md:py-44",
};

// bg is currently a placeholder mapping. Real surface tokens land in
// Bundle 2; until then, ignore this and rely on `className` for bg-*.
// Kept in the type so call-sites can start using the prop today.
const BG: Record<SectionBg, string> = {
  ground:  "",
  raised:  "",
  inverse: "",
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
