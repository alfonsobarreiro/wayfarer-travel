import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button — one-and-only interactive control primitive.
 *
 * Variants:
 *   - primary   — brand-filled, the page's main action. One per zone.
 *   - secondary — outlined, supporting action next to a primary.
 *   - ghost     — no chrome, tertiary/inline.
 *
 * Sizes control padding + font-size only. Weight is fixed:
 *   Semibold-600 is the button exception to the site-wide Medium-500
 *   ceiling — buttons need the extra weight to sit as decisive marks.
 *
 * Tracking is -0.01em on all variants to match Space Grotesk display
 * behavior. Focus ring is a 2px brand-500 ring with 2px offset — the
 * same rule the global :focus-visible baseline uses, restated on the
 * button so :focus-visible works even when the global rule is overridden.
 *
 * Uses ramp tokens (bg-brand-500 etc.) today. Bundle 2 will re-token to
 * semantic role names (bg-interactive-primary) once those exist.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize    = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-700 active:bg-brand-600 " +
    "disabled:bg-neutral-200 disabled:text-neutral-400",
  secondary:
    "bg-transparent text-brand-700 border border-brand-500 " +
    "hover:bg-brand-50 active:bg-brand-100 " +
    "disabled:border-neutral-200 disabled:text-neutral-400",
  ghost:
    "bg-transparent text-brand-700 " +
    "hover:bg-brand-50 active:bg-brand-100 " +
    "disabled:text-neutral-400",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "px-3   py-1.5 text-xs   rounded-md gap-1.5",
  md: "px-5   py-2.5 text-sm   rounded-lg gap-2",
  lg: "px-7   py-3.5 text-base rounded-lg gap-2",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?:    ButtonSize;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        // Layout + typography — buttons are always inline-flex marks
        "inline-flex items-center justify-center whitespace-nowrap select-none",
        "font-semibold tracking-[-0.01em] transition-colors",
        // Focus ring — 2px brand-500 with 2px offset. Restated for parity
        // with the global :focus-visible baseline in globals.css.
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        // Disabled — cursor + no interaction
        "disabled:cursor-not-allowed",
        SIZE[size],
        VARIANT[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
