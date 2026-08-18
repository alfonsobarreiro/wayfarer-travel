"use client";

/**
 * Trip Planner
 * ─────────────────────────────────────────────────────────────────────────
 * The trip planner is built around three primitives — the architecture the
 * case study commits to:
 *
 *   1. SAVED LOCATIONS   — wishlist. No time commitment.
 *   2. SEGMENTS          — destinations with a flexible duration ("3 days
 *                          in Tokyo, sometime in spring"). The default mode
 *                          of planning, so dates the user hasn't committed
 *                          to don't have to exist yet.
 *   3. DAYS              — committed, dated activity slots. A segment can
 *                          be "expanded to days" once the trip is being
 *                          finalized; until then, days don't exist.
 *
 * The planner surfaces geographic logic between segments (distance + a
 * suggested travel mode) and groups activities by category. End-state is
 * Export (print → PDF) and Share (link with itinerary in query string).
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { DestinationImage } from "@/components/DestinationImage";
import {
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Plane,
  Search,
  Bookmark,
  CalendarRange,
  Plane as PlaneIcon,
  TrainFront,
  Car,
  Share2,
  Printer,
  Check,
  Info,
  ChevronDown,
  ChevronRight,
  Sun,
  Utensils,
  Mountain,
  Landmark,
  Camera,
  Moon,
} from "lucide-react";
import { allDestinations as destinations, type Destination } from "@/data/destinations";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

/* ── Types ──────────────────────────────────────────────────── */

type ActivityCategory =
  | "sightseeing"
  | "food"
  | "adventure"
  | "culture"
  | "nature"
  | "rest";

interface Activity {
  id:       string;
  label:    string;
  category: ActivityCategory;
}

interface Segment {
  id:          string;
  destination: Destination;
  duration:    number;          // days
  when:        string;          // "Spring 2026" or "Mar 15–25" or "Flexible"
  activities:  Activity[];
}

interface SavedLocation {
  id:          string;
  destination: Destination;
  note:        string;
}

/* ── Activity defaults + category metadata ─────────────────── */

const CATEGORY_META: Record<ActivityCategory, { label: string; icon: typeof Sun; tone: string }> = {
  sightseeing: { label: "Sightseeing", icon: Camera,   tone: "bg-bg-chip text-text-chip border-border-chip-subtle" },
  food:        { label: "Food",        icon: Utensils, tone: "bg-accent-50 text-accent-800 border-accent-100" },
  adventure:   { label: "Adventure",   icon: Mountain, tone: "bg-sage-50 text-sage-800 border-sage-100" },
  culture:     { label: "Culture",     icon: Landmark, tone: "bg-bg-chip text-text-chip border-border-chip-subtle" },
  nature:      { label: "Nature",      icon: Sun,      tone: "bg-sage-50 text-sage-800 border-sage-100" },
  rest:        { label: "Rest",        icon: Moon,     tone: "bg-neutral-100 text-neutral-700 border-neutral-200" },
};

const CATEGORY_ORDER: ActivityCategory[] = ["sightseeing", "food", "culture", "adventure", "nature", "rest"];

// Per-destination starter activities, categorized. Falls back to a generic set.
const STARTER: Record<string, Activity[]> = {
  bhutan: [
    { id: "b1", label: "Tiger's Nest Monastery hike",  category: "adventure"   },
    { id: "b2", label: "Punakha Dzong",                category: "culture"     },
    { id: "b3", label: "Local Tsechu festival",        category: "culture"     },
    { id: "b4", label: "Phobjikha Valley nature walk", category: "nature"      },
  ],
  greenland: [
    { id: "g1", label: "Ilulissat Icefjord boat tour", category: "nature"      },
    { id: "g2", label: "Dog sledding",                 category: "adventure"   },
    { id: "g3", label: "Northern Lights viewing",      category: "sightseeing" },
  ],
  tokyo: [
    { id: "t1", label: "Senso-ji Temple",              category: "culture"     },
    { id: "t2", label: "Shibuya Crossing walk",        category: "sightseeing" },
    { id: "t3", label: "Tsukiji Market food tour",     category: "food"        },
    { id: "t4", label: "TeamLab Borderless",           category: "culture"     },
  ],
  patagonia: [
    { id: "p1", label: "Torres del Paine W Trek",      category: "adventure"   },
    { id: "p2", label: "Perito Moreno Glacier",        category: "nature"      },
    { id: "p3", label: "Horseback ride on the pampas", category: "adventure"   },
  ],
  marrakech: [
    { id: "m1", label: "Medina walking tour",          category: "culture"     },
    { id: "m2", label: "Majorelle Garden",             category: "sightseeing" },
    { id: "m3", label: "Atlas Mountains day trip",     category: "nature"      },
    { id: "m4", label: "Tagine dinner in the souk",    category: "food"        },
  ],
  "new-zealand": [
    { id: "n1", label: "Milford Sound cruise",         category: "nature"      },
    { id: "n2", label: "Tongariro Alpine Crossing",    category: "adventure"   },
    { id: "n3", label: "Queenstown bungee jump",       category: "adventure"   },
  ],
};

function starterFor(slug: string): Activity[] {
  return (
    STARTER[slug]?.slice() ?? [
      { id: `${slug}-a1`, label: "Top attractions tour",   category: "sightseeing" },
      { id: `${slug}-a2`, label: "Local food experience",  category: "food"        },
    ]
  );
}

/* ── Geographic logic (great-circle + mode heuristic) ───────── */

function haversineKm(a: Destination["coordinates"], b: Destination["coordinates"]): number {
  const R = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

interface TravelLink {
  km:   number;
  hours: number;
  mode: "flight" | "train" | "drive" | "local";
  label: string;
}

function travelBetween(a: Destination, b: Destination): TravelLink {
  const km = haversineKm(a.coordinates, b.coordinates);
  if (km > 800 || a.continent !== b.continent) {
    // Flight: ~800 km/h cruise, +1.5h for airport overhead.
    return { km, hours: km / 800 + 1.5, mode: "flight", label: "Flight" };
  }
  if (km > 250) {
    return { km, hours: km / 90, mode: "train", label: "Train or drive" };
  }
  if (km > 60) {
    return { km, hours: km / 70, mode: "drive", label: "Drive" };
  }
  return { km, hours: km / 40, mode: "local", label: "Local transit" };
}

function formatHours(h: number): string {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const whole = Math.floor(h);
  const mins  = Math.round((h - whole) * 60);
  if (mins === 0) return `${whole}h`;
  return `${whole}h ${mins}m`;
}

function formatKm(km: number): string {
  if (km < 10)   return `${km.toFixed(1)} km`;
  if (km < 1000) return `${Math.round(km)} km`;
  return `${(km / 1000).toFixed(1)}k km`;
}

/* ── Helpers ────────────────────────────────────────────────── */

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ─────────────────────────────────────────────────────────────
   Trip Planner Page
   ───────────────────────────────────────────────────────────── */

export default function PlannerPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [saved, setSaved]       = useState<SavedLocation[]>([]);
  const [pickerOpen, setPickerOpen]       = useState(false);
  const [pickerMode, setPickerMode]       = useState<"segment" | "saved">("segment");
  const [pickerQuery, setPickerQuery]     = useState("");
  const [savedOpen, setSavedOpen]         = useState(true);
  const [shareToast, setShareToast]       = useState(false);

  /* — Computed totals — */
  const totalDays    = segments.reduce((sum, s) => sum + s.duration, 0);
  const uniqueDests  = new Set(segments.map((s) => s.destination.slug)).size;
  const savedCount   = saved.length;

  /* — Segment mutations — */
  const addSegment = useCallback((dest: Destination) => {
    setSegments((prev) => [
      ...prev,
      {
        id:          uid("seg"),
        destination: dest,
        duration:    3,
        when:        "Flexible",
        activities:  starterFor(dest.slug).slice(0, 3),
      },
    ]);
    setPickerOpen(false);
    setPickerQuery("");
  }, []);

  const removeSegment = useCallback((id: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSegment = useCallback(<K extends keyof Segment>(id: string, key: K, value: Segment[K]) => {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }, []);

  const promoteToSegment = useCallback((savedId: string) => {
    const item = saved.find((s) => s.id === savedId);
    if (!item) return;
    addSegment(item.destination);
    setSaved((prev) => prev.filter((s) => s.id !== savedId));
  }, [saved, addSegment]);

  /* — Saved mutations — */
  const addSaved = useCallback((dest: Destination) => {
    setSaved((prev) => {
      if (prev.some((s) => s.destination.slug === dest.slug)) return prev;
      return [...prev, { id: uid("sav"), destination: dest, note: "" }];
    });
    setPickerOpen(false);
    setPickerQuery("");
  }, []);

  const removeSaved = useCallback((id: string) => {
    setSaved((prev) => prev.filter((s) => s.id !== id));
  }, []);

  /* — Activity mutations — */
  const addActivity = useCallback((segId: string, category: ActivityCategory) => {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === segId
          ? {
              ...s,
              activities: [...s.activities, { id: uid("act"), label: "New activity", category }],
            }
          : s,
      ),
    );
  }, []);

  const updateActivityLabel = useCallback((segId: string, actId: string, label: string) => {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === segId
          ? { ...s, activities: s.activities.map((a) => (a.id === actId ? { ...a, label } : a)) }
          : s,
      ),
    );
  }, []);

  const removeActivity = useCallback((segId: string, actId: string) => {
    setSegments((prev) =>
      prev.map((s) =>
        s.id === segId ? { ...s, activities: s.activities.filter((a) => a.id !== actId) } : s,
      ),
    );
  }, []);

  /* — Travel logic between segments — */
  const travelLinks = useMemo(() => {
    const out: (TravelLink | null)[] = [];
    for (let i = 0; i < segments.length - 1; i++) {
      out.push(travelBetween(segments[i].destination, segments[i + 1].destination));
    }
    return out;
  }, [segments]);

  /* — End-state: share + print — */
  const buildShareUrl = useCallback(() => {
    const data = segments.map((s) => `${s.destination.slug}:${s.duration}`).join(",");
    const url  = new URL(window.location.href);
    url.searchParams.set("trip", data);
    return url.toString();
  }, [segments]);

  const handleShare = useCallback(async () => {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }, [buildShareUrl]);

  const handlePrint = useCallback(() => window.print(), []);

  /* — Hydrate from share-link query param (one-shot on mount) — */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trip   = params.get("trip");
    if (!trip) return;
    const restored: Segment[] = [];
    for (const tok of trip.split(",")) {
      const [slug, durStr] = tok.split(":");
      const dest = destinations.find((d) => d.slug === slug);
      const dur  = parseInt(durStr ?? "3", 10);
      if (dest && !isNaN(dur) && dur > 0) {
        restored.push({
          id:          uid("seg"),
          destination: dest,
          duration:    Math.min(dur, 30),
          when:        "Flexible",
          activities:  starterFor(slug).slice(0, 3),
        });
      }
    }
    if (restored.length) setSegments(restored);
  }, []);

  /* — Filtered picker results — */
  const filteredPicker = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter((d) =>
      [d.name, d.country, d.continent, d.tagline, ...d.categories]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [pickerQuery]);

  /* ── Render ───────────────────────────────────────────────── */

  return (
    <div className="pt-16 min-h-screen bg-bg-surface-ground print:bg-white">
      {/* ── Hero — full-bleed image, matches destinations + discover pattern */}
      <section className="relative h-[62vh] min-h-[460px] print:hidden">
        <DestinationImage
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=80"
          fallbackSrc="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1800&q=80"
          alt="Wayfarer trip planner — airplane wing at golden hour"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-12 w-full">
            <motion.h1
              className="text-[2.5rem] md:text-[3.75rem] font-medium text-white mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
            >
              Trip Planner
            </motion.h1>
            <motion.p
              className="text-neutral-100 text-[1.0625rem] max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            >
              Save destinations you&apos;re curious about, add segments with
              flexible durations, and commit to dates when you&apos;re ready.
            </motion.p>
          </Container>
        </div>
      </section>

      {/* ── Print header (only visible in print mode; the hero is display-only) */}
      <div className="hidden print:block px-6 pt-4 pb-2">
        <h1
          className="text-[2.5rem] font-medium text-neutral-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Trip Planner
        </h1>
      </div>

      {/* ── How planning works — three primitives, always visible so the model
             isn't hidden behind a toggle. */}
      <Section variant="compact" className="bg-white border-b border-neutral-200 print:hidden">
        <Container>
          <h2 className="text-[0.9375rem] font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-link-strong" />
            How the three primitives work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <PrimitiveCard
              icon={Bookmark}
              title="Saved Location"
              body="A wishlist entry. No duration. No dates. Useful when you&rsquo;re curious but not committing."
            />
            <PrimitiveCard
              icon={CalendarRange}
              title="Segment"
              body="A destination with a flexible duration (e.g. 3 days, Spring 2026). The default planning unit so you don&rsquo;t have to invent dates."
            />
            <PrimitiveCard
              icon={Plane}
              title="Day"
              body="A committed, dated activity slot. Only appears once you finalize. Lives inside a segment when you&rsquo;re ready."
            />
          </div>
        </Container>
      </Section>

      {/* ── Body ──────────────────────────────────────────── */}
      <Section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* ── Trip outline (segments) ─────────────────── */}
        <div>
          {segments.length === 0 ? (
            <EmptyState
              onAdd={() => {
                setPickerMode("segment");
                setPickerOpen(true);
              }}
            />
          ) : (
            <>
              <Reorder.Group
                axis="y"
                values={segments}
                onReorder={setSegments}
                className="space-y-3"
              >
                {segments.map((seg, i) => (
                  <div key={seg.id}>
                    <SegmentCard
                      segment={seg}
                      index={i}
                      onRemove={() => removeSegment(seg.id)}
                      onUpdate={(key, value) => updateSegment(seg.id, key, value)}
                      onAddActivity={(cat) => addActivity(seg.id, cat)}
                      onUpdateActivity={(actId, label) => updateActivityLabel(seg.id, actId, label)}
                      onRemoveActivity={(actId) => removeActivity(seg.id, actId)}
                    />
                    {/* Travel link to next segment */}
                    {i < segments.length - 1 && travelLinks[i] && (
                      <TravelLinkRow link={travelLinks[i]!} />
                    )}
                  </div>
                ))}
              </Reorder.Group>

              <button
                onClick={() => {
                  setPickerMode("segment");
                  setPickerOpen(true);
                }}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-600 font-medium text-[0.9375rem] hover:border-border-focus-subtle hover:text-link-strong hover:bg-white transition-colors print:hidden"
              >
                <Plus className="w-4 h-4" />
                Add another segment
              </button>

              {/* End-state actions — moved down out of the header so the hero
                  carries only H1 + deck. Export + Share sit here where they
                  actually apply: once you have segments to hand off. */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2 print:hidden">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-[0.9375rem] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 text-[0.9375rem] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Saved Locations rail ────────────────────── */}
        <aside className="print:hidden space-y-4">
          {/* Stats — moved here from the header so the hero can stay clean.
              Sits above Saved as a small at-a-glance summary. */}
          <div className="bg-white rounded-lg border border-neutral-200 p-4 grid grid-cols-3 gap-3">
            <Stat label="Segments"  value={segments.length} />
            <Stat label="Days"      value={totalDays} />
            <Stat label="Saved"     value={savedCount} />
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 sticky top-24">
            <button
              type="button"
              onClick={() => setSavedOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-600" />
                <span className="text-[0.9375rem] font-medium text-neutral-900">Saved</span>
                <span className="text-xs text-neutral-500">{savedCount}</span>
              </div>
              {savedOpen ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
            </button>
            <AnimatePresence initial={false}>
              {savedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{    height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3">
                    {saved.length === 0 ? (
                      <p className="text-xs text-neutral-500 mb-3">
                        Bookmark destinations you&apos;re curious about but not
                        ready to commit. Promote them to a segment when the trip
                        firms up.
                      </p>
                    ) : (
                      <ul className="space-y-2 mb-3">
                        {saved.map((item) => (
                          <li
                            key={item.id}
                            className="group flex items-center gap-2 p-2 rounded-md hover:bg-neutral-50"
                          >
                            <div className="relative w-9 h-9 rounded overflow-hidden flex-shrink-0">
                              <DestinationImage
                                src={item.destination.image}
                                fallbackSrc={item.destination.gallery[0]}
                                alt={item.destination.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-neutral-900 truncate">
                                {item.destination.name}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {item.destination.country}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => promoteToSegment(item.id)}
                                aria-label="Promote to segment"
                                title="Promote to segment"
                                className="text-xs font-medium text-link-strong hover:text-link-hover"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => removeSaved(item.id)}
                                aria-label="Remove"
                                className="text-neutral-400 hover:text-text-danger"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => {
                        setPickerMode("saved");
                        setPickerOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-md border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Save a destination
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
          </div>
        </Container>
      </Section>

      {/* ── Picker modal ─────────────────────────────────── */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setPickerOpen(false)}
            />
            <motion.div
              className="relative z-10 bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{    scale: 0.96, opacity: 0 }}
            >
              <h2
                className="text-xl font-medium mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {pickerMode === "segment" ? "Add a segment" : "Save a destination"}
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                {pickerMode === "segment"
                  ? "A flexible stop with a duration. Dates optional."
                  : "Bookmark without committing to a duration."}
              </p>

              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 focus-within:border-border-focus-subtle focus-within:bg-white transition-colors">
                <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Filter by name, country, or interest"
                  className="flex-1 bg-transparent outline-none text-[0.9375rem] placeholder:text-neutral-400"
                  autoFocus
                />
                {pickerQuery && (
                  <button
                    type="button"
                    onClick={() => setPickerQuery("")}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filteredPicker.length === 0 ? (
                <p className="py-12 text-center text-[0.9375rem] text-neutral-500">
                  No destinations match &ldquo;{pickerQuery}&rdquo;.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto">
                  {filteredPicker.map((dest) => (
                    <button
                      key={dest.slug}
                      onClick={() => (pickerMode === "segment" ? addSegment(dest) : addSaved(dest))}
                      className="group relative rounded-lg overflow-hidden aspect-[3/2] text-left"
                    >
                      <DestinationImage
                        src={dest.image}
                        fallbackSrc={dest.gallery[0]}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors" />
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <p className="text-white font-medium text-[0.9375rem]">
                          {dest.name}
                        </p>
                        <p className="text-white/70 text-xs">{dest.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setPickerOpen(false)}
                className="w-full mt-4 py-3 rounded-lg border border-neutral-200 text-[0.9375rem] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: 12 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-full bg-neutral-900 text-white text-[0.9375rem] font-medium shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Link copied.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Subcomponents ──────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[1.75rem] font-medium text-link-strong tabular-nums">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function PrimitiveCard({ icon: Icon, title, body }: { icon: typeof Sun; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-brand-600" />
        <h3 className="text-xs font-medium text-neutral-900">{title}</h3>
      </div>
      <p className="text-xs text-neutral-600">{body}</p>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-neutral-300">
      <Plane className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
      <h2
        className="text-xl font-medium text-neutral-700 mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        No segments yet
      </h2>
      <p className="text-[0.9375rem] text-neutral-500 mb-6 max-w-sm mx-auto">
        Start by adding a segment. You can always change the duration later, or
        save destinations to the sidebar without committing.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-primary text-white font-medium text-[0.9375rem] hover:bg-bg-primary-hover transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add your first segment
      </button>
    </div>
  );
}

function TravelLinkRow({ link }: { link: TravelLink }) {
  const Icon =
    link.mode === "flight" ? PlaneIcon :
    link.mode === "train"  ? TrainFront :
    link.mode === "drive"  ? Car        : MapPin;
  return (
    <div className="flex items-center gap-3 my-2 pl-12 print:pl-6">
      <span className="w-px flex-shrink-0 h-4 bg-neutral-300" aria-hidden />
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600">
        <Icon className="w-3.5 h-3.5" />
        <span>{link.label}</span>
        <span className="text-neutral-400">·</span>
        <span className="tabular-nums">{formatKm(link.km)}</span>
        <span className="text-neutral-400">·</span>
        <span className="tabular-nums">{formatHours(link.hours)}</span>
      </div>
      <span className="w-px flex-shrink-0 h-4 bg-neutral-300" aria-hidden />
    </div>
  );
}

function SegmentCard({
  segment, index,
  onRemove, onUpdate, onAddActivity, onUpdateActivity, onRemoveActivity,
}: {
  segment:          Segment;
  index:            number;
  onRemove:         () => void;
  onUpdate:         <K extends keyof Segment>(key: K, value: Segment[K]) => void;
  onAddActivity:    (cat: ActivityCategory) => void;
  onUpdateActivity: (actId: string, label: string) => void;
  onRemoveActivity: (actId: string) => void;
}) {
  const [showActivityMenu, setShowActivityMenu] = useState(false);

  // Group activities by category for display
  const grouped = useMemo(() => {
    const map: Record<ActivityCategory, Activity[]> = {
      sightseeing: [], food: [], adventure: [], culture: [], nature: [], rest: [],
    };
    for (const a of segment.activities) map[a.category].push(a);
    return map;
  }, [segment.activities]);

  const presentCategories = CATEGORY_ORDER.filter((c) => grouped[c].length > 0);

  return (
    <Reorder.Item
      value={segment}
      className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden print:shadow-none print:border-neutral-300"
    >
      <div className="p-6">
        <div className="flex items-start gap-3">
          {/* Drag handle */}
          <div className="mt-1 cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 transition-colors print:hidden">
            <GripVertical className="w-5 h-5" />
          </div>

          {/* Index marker — replaces "Day N" with "Segment N" framing */}
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-100 text-link-strong flex items-center justify-center text-xs font-medium tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Thumbnail */}
          <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <DestinationImage
              src={segment.destination.image}
              fallbackSrc={segment.destination.gallery[0]}
              alt={segment.destination.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          {/* Headline + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/destinations/${segment.destination.slug}`}
                  className="inline-block group"
                >
                  <h3
                    className="text-xl font-medium text-neutral-900 group-hover:text-link-strong transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {segment.destination.name}
                  </h3>
                </Link>
                <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {segment.destination.country}
                </p>
              </div>
              <button
                onClick={onRemove}
                aria-label="Remove segment"
                className="p-2 rounded-md text-neutral-400 hover:text-text-danger hover:bg-bg-danger-muted transition-colors print:hidden"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Flexible duration + when */}
            <div className="mt-3 flex flex-wrap items-center gap-2 print:gap-3">
              <label className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-chip border border-border-chip-subtle text-xs font-medium text-text-chip">
                <CalendarRange className="w-3.5 h-3.5" />
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={segment.duration}
                  onChange={(e) =>
                    onUpdate("duration", Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))
                  }
                  className="w-9 bg-transparent outline-none text-center tabular-nums"
                  aria-label="Duration in days"
                />
                <span>day{segment.duration !== 1 ? "s" : ""}</span>
              </label>
              <label className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700">
                <span className="text-neutral-500">When:</span>
                <input
                  type="text"
                  value={segment.when}
                  onChange={(e) => onUpdate("when", e.target.value)}
                  placeholder="Flexible"
                  className="w-32 bg-transparent outline-none placeholder:text-neutral-400"
                  aria-label="When"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Activities grouped by category */}
        <div className="mt-6 pl-12 print:pl-6 space-y-3">
          {presentCategories.map((cat) => (
            <div key={cat}>
              <CategoryHeader category={cat} />
              <ul className="mt-2 space-y-2">
                <AnimatePresence>
                  {grouped[cat].map((a) => (
                    <motion.li
                      key={a.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{    opacity: 0, height: 0 }}
                      className="flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 flex-shrink-0" />
                      <input
                        value={a.label}
                        onChange={(e) => onUpdateActivity(a.id, e.target.value)}
                        className="flex-1 text-[0.9375rem] text-neutral-800 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-border-focus-subtle outline-none py-1 transition-colors"
                      />
                      <button
                        onClick={() => onRemoveActivity(a.id)}
                        aria-label="Remove activity"
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-300 hover:text-text-danger transition-all print:hidden"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          ))}

          {/* Add-activity menu */}
          <div className="relative print:hidden">
            <button
              onClick={() => setShowActivityMenu((v) => !v)}
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-link-strong transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add activity
            </button>
            <AnimatePresence>
              {showActivityMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0, y: -4 }}
                  className="absolute z-10 mt-2 bg-white rounded-lg border border-neutral-200 shadow-lg p-1 flex flex-wrap gap-1 min-w-[280px]"
                >
                  {CATEGORY_ORDER.map((c) => {
                    const meta = CATEGORY_META[c];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={c}
                        onClick={() => {
                          onAddActivity(c);
                          setShowActivityMenu(false);
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-50 text-xs font-medium text-neutral-700"
                      >
                        <Icon className="w-3.5 h-3.5 text-neutral-500" />
                        {meta.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}

function CategoryHeader({ category }: { category: ActivityCategory }) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${meta.tone}`}>
        <Icon className="w-3 h-3" />
        {meta.label}
      </span>
    </div>
  );
}
