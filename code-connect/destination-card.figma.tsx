// @ts-nocheck
import figma from '@figma/code-connect'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

/**
 * Maps Figma "DestinationCard" (node 8283:102)
 * → src/app/page.tsx:243 — homepage destinations carousel
 *
 * Live data: 87 destinations from src/data/destinations.ts (merged from
 * destinations + destinations-extra + destinations-extra2).
 */

figma.connect(
  'https://www.figma.com/design/glE8OOm7wbnBsEqD0L4YWz/Wayfarer-Travel?node-id=8283-102',
  {
    example: () => (
      <Link href="/destinations/tokyo" className="group block">
        <div className="relative overflow-hidden rounded-md aspect-[3/4] mb-4 img-skeleton">
          {/* DestinationImage with src + fallbackSrc, fill, object-cover group-hover:scale-105 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Japan
            </p>
            <h3 className="text-white text-xl font-bold">Tokyo</h3>
          </div>
        </div>
        <p className="text-sm text-neutral-500 line-clamp-2 group-hover:text-neutral-700 transition-colors">
          Where tradition meets tomorrow
        </p>
      </Link>
    ),
  }
)
