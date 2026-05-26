// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Link · Footer" (node 8278:53)
 * → src/components/Footer.tsx
 *
 * NOTE: ship-state bug — global `a { color: var(--color-text-link) }`
 * in src/app/globals.css overrides the Tailwind text-neutral-300,
 * so links render brand-500 in production.
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8278-53',
  {
    example: () => (
      <a href="/destinations" className="hover:text-white transition-colors">
        Top Spots
      </a>
    ),
  }
)
