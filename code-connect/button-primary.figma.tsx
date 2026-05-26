// @ts-nocheck — Code Connect pattern doc; not built into production
import figma from '@figma/code-connect'

/**
 * Maps Figma "Button · Primary" component set (node 8277:38)
 * → inline Tailwind pattern at src/app/page.tsx:165 (hero Sign Up CTA)
 * → also used at src/components/Footer.tsx and src/app/destinations/[slug]/page.tsx
 *
 * The button is not extracted as a React component; the className lives inline.
 * The example below mirrors the exact pattern that ships.
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8277-38',
  {
    example: () => (
      <button
        type="button"
        className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20"
      >
        Sign Up!
      </button>
    ),
  }
)
