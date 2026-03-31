"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SignUpModal } from "@/components/form/SignUpModal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/60">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="14" cy="14" r="13" stroke="#8b5e3c" strokeWidth="2" />
              <path
                d="M7 14C7 14 10 8 14 8C18 8 21 14 21 14C21 14 18 20 14 20C10 20 7 14 7 14Z"
                stroke="#8b5e3c"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="14" cy="14" r="2.5" fill="#8b5e3c" />
            </svg>
            <span className="text-neutral-900">Wayfarer</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/destinations"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Top Spots
            </Link>
            <Link
              href="/discover"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              Plan
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSignUpOpen(true)}
              className="hidden md:inline-flex text-sm font-medium text-brand-700 hover:text-brand-800 transition-colors"
            >
              Sign Up
            </button>
            <button
              aria-label="Menu"
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-neutral-600" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-4 space-y-3">
            <Link
              href="/destinations"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Top Spots
            </Link>
            <Link
              href="/discover"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className="block text-sm font-medium text-neutral-700"
              onClick={() => setMobileOpen(false)}
            >
              Plan
            </Link>
            <button
              onClick={() => {
                setSignUpOpen(true);
                setMobileOpen(false);
              }}
              className="block text-sm font-medium text-brand-700"
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      <SignUpModal open={signUpOpen} onClose={() => setSignUpOpen(false)} />
    </>
  );
}
