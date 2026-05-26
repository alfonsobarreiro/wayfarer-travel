// @ts-nocheck
import figma from '@figma/code-connect'
import { BadgeCheck } from 'lucide-react'

/**
 * Maps Figma "Badge · Glass" (node 8283:18)
 * → src/app/destinations/[slug]/page.tsx — "Curated Experience" badge
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8283-18',
  {
    example: () => (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mb-4">
        <BadgeCheck className="w-3.5 h-3.5" />
        Curated Experience
      </div>
    ),
  }
)
