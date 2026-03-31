import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3
              className="text-white text-lg font-bold mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Wayfarer
            </h3>
            <p className="text-sm leading-relaxed text-neutral-400">
              A travel discovery platform for curious explorers. Find
              authentic destinations matched to how you actually travel.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Top Spots
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-white transition-colors">
                  Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              Project
            </h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Wayfarer is a concept project designed by Alfonso Barreiro.
              Built with Next.js, Mapbox, and Framer Motion.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} Alfonso Barreiro. Concept project — not a real product.
          </p>
          <p className="text-xs text-neutral-500">
            Designed with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
