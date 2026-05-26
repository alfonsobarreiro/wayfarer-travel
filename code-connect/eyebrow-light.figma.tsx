// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "Eyebrow · Light" (node 8279:44)
 * → src/app/page.tsx (Why Wayfarer eyebrow + others on light surfaces)
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8279-44',
  {
    example: () => (
      <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">
        Why Wayfarer
      </p>
    ),
  }
)
