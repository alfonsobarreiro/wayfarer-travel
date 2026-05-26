// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Button · Outline" (node 8277:58)
 * → inline Tailwind pattern at src/app/planner/page.tsx:395 (Print button)
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8277-58',
  {
    example: () => (
      <button
        type="button"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Print itinerary
      </button>
    ),
  }
)
