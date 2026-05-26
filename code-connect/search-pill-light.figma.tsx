// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "SearchPill · Light" (node 8278:94)
 * → src/components/Navbar.tsx:64
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8278-94',
  {
    example: () => (
      <button
        type="button"
        aria-label="Search destinations"
        className="hidden md:inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-neutral-200 text-sm text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors min-w-[200px]"
      >
        {/* Search icon w-4 h-4 */}
        <span className="flex-1 text-left">Search destinations</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
          ⌘K
        </kbd>
      </button>
    ),
  }
)
