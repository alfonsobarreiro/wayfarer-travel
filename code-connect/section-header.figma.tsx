// @ts-nocheck
import figma from '@figma/code-connect'

/**
 * Maps Figma "SectionHeader" (node 8285:27)
 * → section pattern repeated across src/app/page.tsx and other routes
 *
 * Three variants: Light (Why Wayfarer), Dark (Explore the Globe), WithArrows (Destinations).
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8285-27',
  {
    example: () => (
      <div>
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">
          Why Wayfarer
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Travel that fits your life
        </h2>
      </div>
    ),
  }
)
