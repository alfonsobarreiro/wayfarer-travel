// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "SearchPill · Dark" (node 8278:117)
 * → src/app/destinations/page.tsx:75 (over-image hero)
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8278-117',
  {
    example: () => (
      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-sm text-white/90 transition-colors min-w-[280px]"
      >
        {/* Search icon w-4 h-4 text-white/70 */}
        <span className="flex-1 text-left">Search a country, region, or interest</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-white/80 border border-white/20">
          ⌘K
        </kbd>
      </button>
    ),
  }
)
