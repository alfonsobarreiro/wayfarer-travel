// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Link · Arrow" (node 8278:42)
 * → src/app/page.tsx:279 "View all destinations"
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8278-42',
  {
    example: () => (
      <a
        href="/destinations"
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
      >
        View all destinations
        {/* ArrowRight w-4 h-4 */}
      </a>
    ),
  }
)
