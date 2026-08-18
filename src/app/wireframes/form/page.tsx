"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

/* ── Shared wireframe primitives ───────────────────── */
function Placeholder({
  w = "w-full",
  h = "h-4",
  className = "",
  dark = false,
}: {
  w?: string;
  h?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${w} ${h} rounded ${
        dark ? "bg-neutral-600" : "bg-neutral-200"
      } ${className}`}
    />
  );
}

function ImageBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded border-2 border-dashed flex items-center justify-center border-neutral-300 bg-neutral-100 ${className}`}
    >
      <svg
        className="w-8 h-8 text-neutral-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
        />
      </svg>
    </div>
  );
}

function InputBlock({ label, half = false }: { label: string; half?: boolean }) {
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
        {label}
      </div>
      <div className="h-8 rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50" />
    </div>
  );
}

function ChipGrid({
  items,
  columns = 2,
  activeIndex = 0,
}: {
  items: string[];
  columns?: number;
  activeIndex?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`h-9 rounded-md border-2 flex items-center justify-center text-xs font-medium transition-colors ${
            i === activeIndex
              ? "border-brand-500 bg-brand-50 text-brand-700 border-solid"
              : "border-neutral-300 border-dashed text-neutral-400"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function MultiChipGrid({
  items,
  columns = 2,
  activeIndices = [0, 2],
}: {
  items: string[];
  columns?: number;
  activeIndices?: number[];
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`h-9 rounded-md border-2 flex items-center gap-1 justify-center text-xs font-medium ${
            activeIndices.includes(i)
              ? "border-brand-500 bg-brand-50 text-brand-700 border-solid"
              : "border-neutral-300 border-dashed text-neutral-400"
          }`}
        >
          {activeIndices.includes(i) && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          )}
          {item}
        </div>
      ))}
    </div>
  );
}

/* ── Step data ─────────────────────────────────────── */
const steps = [
  {
    id: 0,
    label: "Account",
    title: "Create Your Account",
    subtitle: "Start your journey with Wayfarer.",
    caption: "Let's get to know you",
  },
  {
    id: 1,
    label: "Travel Style",
    title: "How Do You Travel?",
    subtitle: "Help us tailor recommendations for you.",
    caption: "Your travel style",
  },
  {
    id: 2,
    label: "Interests",
    title: "What Are Your Interests?",
    subtitle: "Select all that apply.",
    caption: "What excites you?",
  },
  {
    id: 3,
    label: "Destinations",
    title: "Where Do You Want to Go?",
    subtitle: "Pick destinations that call to you.",
    caption: "Dream destinations",
  },
  {
    id: 4,
    label: "Review",
    title: "Review Your Profile",
    subtitle: "Make sure everything looks right.",
    caption: "Almost there!",
  },
];

/* ── Annotation ────────────────────────────────────── */
function Annotation({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 flex-shrink-0" />
      <span className="text-xs text-brand-600 font-medium">
        {text}
      </span>
    </div>
  );
}

/* ── Review card wireframe ─────────────────────────── */
function ReviewCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border-2 border-dashed border-neutral-300 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {label}
        </span>
        <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
          Edit
        </span>
      </div>
      {children}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function FormWireframePage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-bg-surface-ground">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <Container className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/wireframes"
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Homepage wireframe
            </Link>
            <div className="h-5 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              <h1
                className="text-sm font-bold text-neutral-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Multi-Step Form Wireframe
              </h1>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 mb-2">
            Wayfarer Travel
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Multi-Step Onboarding Form
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg">
            5-step progressive disclosure form inside a modal. Collects account
            info, travel preferences, interests, dream destinations, then
            confirms with a review screen before submission.
          </p>
        </div>

        {/* Step selector */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                activeStep === s.id
                  ? "bg-bg-primary text-white"
                  : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full text-xs font-medium flex items-center justify-center ${
                  activeStep === s.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {s.id + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Wireframe modal */}
        <div className="max-w-[780px] mx-auto">
          {/* Backdrop hint */}
          <div className="bg-neutral-200/60 rounded-xl p-3">
            <div className="text-xs text-neutral-400 font-medium text-center mb-2">
              Backdrop — click to close
            </div>

            {/* Modal frame */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200">
              <div className="flex flex-col md:flex-row">
                {/* Left — Image panel */}
                <div className="hidden md:block w-2/5 bg-neutral-100 relative">
                  <ImageBox className="w-full h-full min-h-[480px] !rounded-none !border-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-none" />
                  <div className="absolute bottom-5 left-5 right-5 space-y-1">
                    <div className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Step {activeStep + 1} of {steps.length}
                    </div>
                    <div className="text-xs font-medium text-white/90">
                      {steps[activeStep].caption}
                    </div>
                  </div>

                  {/* Annotation */}
                  <div className="absolute top-4 left-4 right-4">
                    <Annotation text="Image changes per step via AnimatePresence crossfade" />
                  </div>
                </div>

                {/* Right — Form panel */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Close button */}
                  <div className="flex justify-end mb-1">
                    <div className="w-7 h-7 rounded-full border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-xs">
                      &times;
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex gap-1.5 mb-1">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= activeStep ? "bg-brand-500" : "bg-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-400 mb-4 md:hidden">
                    Step {activeStep + 1} of {steps.length}
                  </div>

                  {/* Step heading */}
                  <div className="mb-5">
                    <div className="text-sm font-medium text-neutral-800 mb-0.5">
                      {steps[activeStep].title}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {steps[activeStep].subtitle}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-h-[260px]">
                    {/* Step 1: Account */}
                    {activeStep === 0 && (
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <InputBlock label="First Name" half />
                          <InputBlock label="Last Name" half />
                        </div>
                        <InputBlock label="Email Address" />
                        <Annotation text="Zod schema validates on blur — inline error messages below each field" className="mt-3" />
                      </div>
                    )}

                    {/* Step 2: Travel Style */}
                    {activeStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Travel Style
                          </div>
                          <ChipGrid
                            items={["Solo Explorer", "Couple Getaway", "Family Adventure", "Group Travel"]}
                            activeIndex={0}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Budget Range
                          </div>
                          <ChipGrid
                            items={["Budget-Friendly", "Mid-Range", "Luxury", "No Limit"]}
                            activeIndex={1}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                            Group Size
                          </div>
                          <ChipGrid
                            items={["Just Me", "2 People", "3–5 People", "6+ People"]}
                            activeIndex={0}
                          />
                        </div>
                        <Annotation text="Single-select per group — active chip gets brand border + fill" className="mt-2" />
                      </div>
                    )}

                    {/* Step 3: Interests */}
                    {activeStep === 2 && (
                      <div className="space-y-3">
                        <MultiChipGrid
                          items={[
                            "Beaches & Islands",
                            "Mountains & Hiking",
                            "City Culture",
                            "Food & Culinary",
                            "History & Heritage",
                            "Wildlife & Nature",
                            "Adventure Sports",
                            "Wellness & Spa",
                          ]}
                          activeIndices={[0, 3, 5]}
                        />
                        <Annotation text="Multi-select — checkmark icon appears in active chips. Min 1 required." className="mt-2" />
                      </div>
                    )}

                    {/* Step 4: Destinations */}
                    {activeStep === 3 && (
                      <div className="space-y-3">
                        <MultiChipGrid
                          items={[
                            "Bhutan",
                            "Greenland",
                            "Tokyo",
                            "Patagonia",
                            "Marrakech",
                            "New Zealand",
                          ]}
                          activeIndices={[2, 4]}
                        />
                        <Annotation text="Multi-select — seeds the recommendation engine with user intent" className="mt-2" />
                      </div>
                    )}

                    {/* Step 5: Review */}
                    {activeStep === 4 && (
                      <div className="space-y-3">
                        <ReviewCard label="Account">
                          <Placeholder w="w-32" h="h-3" className="mb-1" />
                          <Placeholder w="w-40" h="h-2" />
                        </ReviewCard>
                        <ReviewCard label="Travel Preferences">
                          <div className="flex gap-1.5 flex-wrap">
                            {["Solo Explorer", "Mid-Range", "Just Me"].map((t) => (
                              <div
                                key={t}
                                className="px-2 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700"
                              >
                                {t}
                              </div>
                            ))}
                          </div>
                        </ReviewCard>
                        <ReviewCard label="Interests">
                          <div className="flex gap-1.5 flex-wrap">
                            {["Beaches & Islands", "Food & Culinary", "Wildlife & Nature"].map((t) => (
                              <div
                                key={t}
                                className="px-2 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700"
                              >
                                {t}
                              </div>
                            ))}
                          </div>
                        </ReviewCard>
                        <ReviewCard label="Dream Destinations">
                          <div className="flex gap-1.5 flex-wrap">
                            {["Tokyo", "Marrakech"].map((t) => (
                              <div
                                key={t}
                                className="px-2 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-medium text-brand-700"
                              >
                                {t}
                              </div>
                            ))}
                          </div>
                        </ReviewCard>
                        <Annotation text="Each card has Edit link → jumpToStep(n). Read-only confirmation before submit." className="mt-2" />
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-dashed border-neutral-200">
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        activeStep === 0 ? "text-neutral-300" : "text-neutral-500 cursor-pointer"
                      }`}
                      onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </div>
                    <div
                      className="flex items-center gap-1 px-5 py-2 rounded-md bg-neutral-800 text-white text-xs font-medium cursor-pointer"
                      onClick={() =>
                        activeStep < steps.length - 1
                          ? setActiveStep(activeStep + 1)
                          : setActiveStep(0)
                      }
                    >
                      {activeStep === steps.length - 1 ? "Confirm & Join" : "Continue"}
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow diagram */}
        <div className="max-w-[780px] mx-auto mt-12">
          <h3
            className="text-sm font-bold text-neutral-900 mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            User Flow
          </h3>
          <div className="flex items-center gap-0 overflow-x-auto pb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => setActiveStep(s.id)}
                  className={`w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-colors ${
                    activeStep === s.id
                      ? "border-brand-500 bg-brand-50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      activeStep === s.id ? "text-brand-600" : "text-neutral-400"
                    }`}
                  >
                    Step {s.id + 1}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      activeStep === s.id ? "text-brand-800" : "text-neutral-500"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-neutral-300 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
            <ArrowRight className="w-4 h-4 text-neutral-300 mx-1 flex-shrink-0" />
            <div className="w-24 h-20 rounded-lg border-2 border-sage-300 bg-bg-success-muted flex flex-col items-center justify-center gap-1 flex-shrink-0">
              <svg className="w-5 h-5 text-text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span className="text-xs font-medium text-text-success">Success</span>
            </div>
          </div>
        </div>

        {/* Design notes */}
        <div className="max-w-[780px] mx-auto mt-10 bg-white border border-neutral-200 rounded-lg p-6">
          <h3
            className="text-sm font-bold text-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Design Decisions
          </h3>
          <div className="space-y-3 text-sm text-neutral-600">
            <p>
              <strong className="text-neutral-800">Split-panel modal.</strong>{" "}
              Image on the left provides visual reward and contextual cue for
              each step. On mobile, the image panel hides and a text-based step
              counter replaces it — no content loss.
            </p>
            <p>
              <strong className="text-neutral-800">Progressive disclosure over long forms.</strong>{" "}
              Breaking 12+ fields across 5 steps reduces cognitive load. Each
              step has a single decision type: text input, single-select, or
              multi-select. No step mixes interaction patterns.
            </p>
            <p>
              <strong className="text-neutral-800">Review before commit.</strong>{" "}
              Step 5 shows all selections in read-only cards with inline edit
              links. Reduces commitment anxiety, catches errors, and signals
              respect for user input — a confirmation pattern the original
              brief called for.
            </p>
            <p>
              <strong className="text-neutral-800">Validation strategy.</strong>{" "}
              Zod schemas per step, validated on &ldquo;Continue&rdquo; tap.
              Inline error messages appear below the relevant field. The review
              step has no validation — it&rsquo;s read-only.
            </p>
            <p>
              <strong className="text-neutral-800">Group size as a separate field.</strong>{" "}
              The original brief combined travel style and party size. Separating
              them gives the recommendation engine cleaner signal — &ldquo;Solo
              Explorer&rdquo; is a mindset, &ldquo;Just Me&rdquo; is a headcount.
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="max-w-[780px] mx-auto mt-6 bg-white border border-neutral-200 rounded-lg p-6">
          <h3
            className="text-sm font-bold text-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Technical Implementation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              ["React Hook Form", "Per-step form instances"],
              ["Zod", "Schema validation per step"],
              ["Framer Motion", "Step transitions + modal enter/exit"],
              ["AnimatePresence", "Crossfade on image + form content"],
              ["Tailwind CSS", "Utility-first styling, brand tokens"],
              ["Next.js App Router", "Client component in modal pattern"],
            ].map(([tech, use]) => (
              <div key={tech} className="p-3 rounded-md bg-neutral-50 border border-neutral-100">
                <div className="font-medium text-neutral-800">{tech}</div>
                <div className="text-neutral-500 mt-0.5">{use}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
