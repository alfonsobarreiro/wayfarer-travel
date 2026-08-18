/**
 * cn — minimal className concatenator.
 * Filters falsy values and joins with a space. No dependency, no dedupe,
 * order preserved so later strings can override earlier ones with the
 * standard Tailwind precedence pattern (base → user className).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
