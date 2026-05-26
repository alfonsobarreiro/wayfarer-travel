// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Eyebrow · Dark" (node 8279:50)
 * → src/app/page.tsx (Interactive eyebrow on Discover teaser)
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8279-50',
  {
    example: () => (
      <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">
        Interactive
      </p>
    ),
  }
)
