// @ts-nocheck
import figma from '@figma/code-connect'
import { Ticket } from 'lucide-react'

/**
 * Maps Figma "Badge · ComingSoon" (node 8283:28)
 * → src/app/planner/page.tsx:414 — "Send to booking" disabled-with-SOON-chip pattern
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8283-28',
  {
    example: () => (
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-neutral-300 text-sm font-medium text-neutral-400 cursor-not-allowed select-none"
      >
        <Ticket className="w-4 h-4" />
        <span>Send to booking</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
          Soon
        </span>
      </button>
    ),
  }
)
