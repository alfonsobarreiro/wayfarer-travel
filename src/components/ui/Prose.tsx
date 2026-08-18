import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Prose — prose-column width primitive.
 *
 * Three sizes cover the site's only text-column widths:
 *   - tight: max-w-xl  (576px) — captions, short intros
 *   - lede:  max-w-2xl (672px) — hero copy, section ledes
 *   - wide:  max-w-3xl (768px) — body prose, article passages
 *
 * Left-aligns inside a Container by default. NEVER add `mx-auto` here —
 * prose columns must anchor to the Container's left rail, not the viewport
 * center. Ryan's "one left rail" rule: `mx-auto max-w-*` inside a
 * <Container> is the bug we're eliminating.
 *
 * Renders as <div>. If a caller wants centered text (e.g. a CTA section),
 * they can add `text-center` via className — that's presentation, not
 * alignment of the column itself.
 */
export type ProseSize = "tight" | "lede" | "wide";

const SIZE: Record<ProseSize, string> = {
  tight: "max-w-xl",
  lede:  "max-w-2xl",
  wide:  "max-w-3xl",
};

export interface ProseProps {
  children:   ReactNode;
  size?:      ProseSize;
  className?: string;
}

export function Prose({ children, size = "lede", className }: ProseProps) {
  return (
    <div className={cn(SIZE[size], className)}>
      {children}
    </div>
  );
}
