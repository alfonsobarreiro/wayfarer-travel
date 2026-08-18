import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="bg-bg-surface-inverse text-neutral-200">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand — Wayfarer wordmark + tagline. Medium 500 ceiling on the
              display line; 15px on-scale body. */}
          <div>
            <h3
              className="text-white text-[1.25rem] font-medium mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Wayfarer
            </h3>
            <p className="text-[0.9375rem] text-neutral-300 max-w-xs">
              A travel discovery platform for curious explorers. Authentic
              destinations matched to how you travel.
            </p>
          </div>

          {/* Explore — column labels are mixed-case Medium 500, not
              uppercase+tracking-wider (all-caps reserved for buttons per DS). */}
          <div>
            <h4 className="text-white text-[0.9375rem] font-medium mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-[0.9375rem]">
              <li>
                <Link href="/destinations" className="hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Explore the Globe
                </Link>
              </li>
              <li>
                <Link href="/planner" className="hover:text-white transition-colors">
                  Trip Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Behind the Project */}
          <div>
            <h4 className="text-white text-[0.9375rem] font-medium mb-4">
              Behind the Project
            </h4>
            <ul className="space-y-2 text-[0.9375rem]">
              <li>
                <a
                  href="https://www.barreiro.com/work/wayfarer"
                  className="hover:text-white transition-colors"
                >
                  Read the Case Study
                </a>
              </li>
              <li>
                <a
                  href="https://www.barreiro.com"
                  className="hover:text-white transition-colors"
                >
                  More Work by Alfonso Barreiro
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/alfonso-barreiro/"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Alfonso Barreiro. Concept project, not a real product.
          </p>
          <p className="text-xs text-neutral-500">
            Built with Next.js, Mapbox, and Framer Motion.
          </p>
        </div>
      </Container>
    </footer>
  );
}
