"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { DestinationImage } from "@/components/DestinationImage";
import {
  Plus,
  Trash2,
  GripVertical,
  Calendar,
  MapPin,
  Clock,
  Plane,
} from "lucide-react";
import { allDestinations as destinations, type Destination } from "@/data/destinations";

interface ItineraryDay {
  id: string;
  day: number;
  destination: Destination;
  activities: string[];
  notes: string;
}

const defaultActivities: Record<string, string[]> = {
  bhutan: ["Visit Tiger's Nest Monastery", "Explore Punakha Dzong", "Attend local Tsechu festival"],
  greenland: ["Ilulissat Icefjord boat tour", "Dog sledding excursion", "Northern Lights viewing"],
  tokyo: ["Explore Senso-ji Temple", "Shibuya Crossing & Harajuku walk", "Tsukiji Market food tour"],
  patagonia: ["Torres del Paine W Trek — Day 1", "Perito Moreno Glacier trek", "Horseback riding on pampas"],
  marrakech: ["Medina guided walking tour", "Majorelle Garden visit", "Atlas Mountains day trip"],
  "new-zealand": ["Milford Sound cruise", "Tongariro Alpine Crossing", "Queenstown bungee jump"],
};

export default function PlannerPage() {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const addDestination = useCallback(
    (dest: Destination) => {
      const newDay: ItineraryDay = {
        id: `${dest.slug}-${Date.now()}`,
        day: itinerary.length + 1,
        destination: dest,
        activities: defaultActivities[dest.slug]?.slice(0, 2) || [],
        notes: "",
      };
      setItinerary((prev) => [...prev, newDay]);
      setShowAddModal(false);
    },
    [itinerary.length]
  );

  const removeDay = useCallback((id: string) => {
    setItinerary((prev) =>
      prev
        .filter((d) => d.id !== id)
        .map((d, i) => ({ ...d, day: i + 1 }))
    );
  }, []);

  const addActivity = useCallback((dayId: string) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, "New activity..."] }
          : d
      )
    );
  }, []);

  const updateActivity = useCallback(
    (dayId: string, idx: number, value: string) => {
      setItinerary((prev) =>
        prev.map((d) =>
          d.id === dayId
            ? {
                ...d,
                activities: d.activities.map((a, i) =>
                  i === idx ? value : a
                ),
              }
            : d
        )
      );
    },
    []
  );

  const removeActivity = useCallback((dayId: string, idx: number) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((_, i) => i !== idx) }
          : d
      )
    );
  }, []);

  const updateNotes = useCallback((dayId: string, notes: string) => {
    setItinerary((prev) =>
      prev.map((d) => (d.id === dayId ? { ...d, notes } : d))
    );
  }, []);

  const totalDays = itinerary.length;
  const uniqueDestinations = new Set(itinerary.map((d) => d.destination.slug))
    .size;

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-white border-b border-neutral-200 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-neutral-900"
                style={{ fontFamily: "var(--font-heading)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Trip Planner
              </motion.h1>
              <p className="text-neutral-500 mt-1">
                Build your perfect itinerary day by day. Drag to reorder.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">{totalDays}</p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">
                  Days
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">
                  {uniqueDestinations}
                </p>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">
                  Destinations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        {itinerary.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plane className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2
              className="text-2xl font-bold text-neutral-500 mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your itinerary is empty
            </h2>
            <p className="text-neutral-500 mb-6">
              Start by adding a destination below.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Your First Stop
            </button>
          </motion.div>
        ) : (
          <>
            <Reorder.Group
              axis="y"
              values={itinerary}
              onReorder={(newOrder) =>
                setItinerary(
                  newOrder.map((item, i) => ({ ...item, day: i + 1 }))
                )
              }
              className="space-y-4"
            >
              {itinerary.map((day) => (
                <Reorder.Item
                  key={day.id}
                  value={day}
                  className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Drag handle */}
                      <div className="mt-1 cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 transition-colors">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      {/* Thumbnail */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={day.destination.image}
                          alt={day.destination.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div>
                            <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                              Day {day.day}
                            </span>
                            <h3
                              className="text-lg font-bold text-neutral-900"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {day.destination.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeDay(day.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                            aria-label="Remove day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick meta */}
                        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {day.destination.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {day.destination.bestTimeToVisit}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {day.destination.timezone}
                          </span>
                        </div>

                        {/* Activities */}
                        <div className="space-y-2 mb-3">
                          <AnimatePresence>
                            {day.activities.map((activity, idx) => (
                              <motion.div
                                key={idx}
                                className="flex items-center gap-2 group"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <div className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />
                                <input
                                  value={activity}
                                  onChange={(e) =>
                                    updateActivity(day.id, idx, e.target.value)
                                  }
                                  className="flex-1 text-sm text-neutral-700 bg-transparent border-b border-transparent hover:border-neutral-200 focus:border-brand-400 outline-none py-1 transition-colors"
                                />
                                <button
                                  onClick={() => removeActivity(day.id, idx)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-300 hover:text-red-400 transition-all"
                                  aria-label="Remove activity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          <button
                            onClick={() => addActivity(day.id)}
                            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-brand-600 transition-colors mt-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add activity
                          </button>
                        </div>

                        {/* Notes */}
                        <textarea
                          value={day.notes}
                          onChange={(e) => updateNotes(day.id, e.target.value)}
                          placeholder="Add notes for this day..."
                          className="w-full text-sm text-neutral-500 bg-neutral-50 rounded-lg p-3 border border-neutral-200 focus:border-brand-400 outline-none resize-none transition-colors"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 font-medium text-sm hover:border-brand-400 hover:text-brand-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Day
              </button>
            </div>
          </>
        )}
      </section>

      {/* Add Destination Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="relative z-10 bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Choose a Destination
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                {destinations.map((dest) => (
                  <button
                    key={dest.slug}
                    onClick={() => addDestination(dest)}
                    className="group relative rounded-lg overflow-hidden aspect-[3/2] text-left"
                  >
                    <DestinationImage
                      src={dest.image}
                      fallbackSrc={dest.gallery[0]}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-bold text-sm">
                        {dest.name}
                      </p>
                      <p className="text-white/70 text-xs">{dest.country}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full mt-4 py-2.5 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
