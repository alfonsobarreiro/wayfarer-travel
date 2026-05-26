// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Kbd · Dark" (node 8279:24)
 * → inline kbd inside the dark search pill
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8279-24',
  {
    example: () => (
      <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-white/80 border border-white/20">
        ⌘K
      </kbd>
    ),
  }
)
