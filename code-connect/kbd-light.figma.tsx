// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Kbd · Light" (node 8279:17)
 * → inline kbd inside the light search pill
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8279-17',
  {
    example: () => (
      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
        ⌘K
      </kbd>
    ),
  }
)
