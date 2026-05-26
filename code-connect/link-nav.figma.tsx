// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Link · Nav" (node 8278:25)
 * → inline Tailwind pattern in src/components/Navbar.tsx
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8278-25',
  {
    example: () => (
      <a
        href="/destinations"
        className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
      >
        Top Spots
      </a>
    ),
  }
)
