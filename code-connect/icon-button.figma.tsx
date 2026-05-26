// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "IconButton" (node 8277:95)
 * → inline Tailwind pattern at src/app/page.tsx:208 (carousel arrows)
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8277-95',
  {
    example: () => (
      <button
        type="button"
        aria-label="Scroll left"
        className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
      >
        {/* Lucide ChevronLeft, w-5 h-5 text-neutral-600 */}
      </button>
    ),
  }
)
