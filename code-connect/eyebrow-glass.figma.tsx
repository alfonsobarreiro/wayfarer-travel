// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Eyebrow · Glass" (node 8279:56)
 * → src/app/destinations/[slug]/page.tsx — used over photographic backgrounds
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8279-56',
  {
    example: () => (
      <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
        20+ destinations
      </p>
    ),
  }
)
