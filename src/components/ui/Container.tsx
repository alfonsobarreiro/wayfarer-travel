import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Container — the single source of horizontal gutter.
 *
 * Owns `max-w-7xl mx-auto px-6`. Every page uses this so gutter width is
 * defined in one place. Additional utilities passed via `className` merge
 * AFTER the base classes so callers can override selectively (e.g. add
 * vertical margin or z-index without redefining the width).
 *
 * Callers must NOT re-apply `mx-auto` or a second `max-w-*` to children
 * that already sit inside a Container — that's the "one left rail" rule
 * (prose columns left-align inside the Container, they don't re-center).
 * For prose column widths, use <Prose size="…"> as a child instead.
 */
export interface ContainerProps {
  children:   ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-6", className)}>
      {children}
    </div>
  );
}
