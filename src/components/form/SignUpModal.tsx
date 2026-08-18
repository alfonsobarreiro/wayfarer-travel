"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Check, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ── Schema per step ─────────────────────────────────── */
const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
});

const step2Schema = z.object({
  travelStyle: z.string().min(1, "Pick a travel style"),
  budget: z.string().min(1, "Pick a budget range"),
  groupSize: z.string().min(1, "Pick a group size"),
});

const step3Schema = z.object({
  interests: z.array(z.string()).min(1, "Pick at least one interest"),
});

const step4Schema = z.object({
  destinations: z.array(z.string()).min(1, "Pick at least one destination"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;
type Step4 = z.infer<typeof step4Schema>;

const travelStyles = ["Solo Explorer", "Couple Getaway", "Family Adventure", "Group Travel"];
// Numeric per-day USD ranges instead of subjective labels.
// The value is what gets stored; range/label are for the UI.
const budgets: { value: string; range: string; note: string }[] = [
  { value: "budget",   range: "$50–100",  note: "per day" },
  { value: "mid",      range: "$100–250", note: "per day" },
  { value: "premium",  range: "$250–500", note: "per day" },
  { value: "no-limit", range: "$500+",    note: "per day" },
];
const groupSizes = ["Just Me", "2 People", "3–5 People", "6+ People"];
const interests = [
  "Beaches & Islands",
  "Mountains & Hiking",
  "City Culture",
  "Food & Culinary",
  "History & Heritage",
  "Wildlife & Nature",
  "Adventure Sports",
  "Wellness & Spa",
];
const topDestinations = [
  "Bhutan",
  "Greenland",
  "Tokyo",
  "Patagonia",
  "Marrakech",
  "New Zealand",
];

const bgImages = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=60",
  "https://images.unsplash.com/photo-1469521669194-babb45599def?w=800&q=60",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=60",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=60",
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=60",
];

/* ── Component ───────────────────────────────────────── */
interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);

  /* Step 1 */
  const form1 = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: { firstName: "", lastName: "", email: "" },
  });

  /* Step 2 */
  const form2 = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: { travelStyle: "", budget: "", groupSize: "" },
  });

  /* Step 3 */
  const form3 = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues: { interests: [] },
  });

  /* Step 4 */
  const form4 = useForm<Step4>({
    resolver: zodResolver(step4Schema),
    defaultValues: { destinations: [] },
  });

  const totalSteps = 5;

  async function handleNext() {
    let valid = false;
    if (step === 0) valid = await form1.trigger();
    if (step === 1) valid = await form2.trigger();
    if (step === 2) valid = await form3.trigger();
    if (step === 3) valid = await form4.trigger();
    if (step === 4) valid = true; // Review step — no validation needed

    if (valid && step < totalSteps - 1) setStep(step + 1);
    if (valid && step === totalSteps - 1) {
      setComplete(true);
    }
  }

  function jumpToStep(target: number) {
    setStep(target);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleClose() {
    setStep(0);
    setComplete(false);
    form1.reset();
    form2.reset();
    form3.reset();
    form4.reset();
    onClose();
  }

  function toggleInterest(value: string) {
    const current = form3.getValues("interests") || [];
    if (current.includes(value)) {
      form3.setValue("interests", current.filter((v) => v !== value), { shouldValidate: true });
    } else {
      form3.setValue("interests", [...current, value], { shouldValidate: true });
    }
  }

  function toggleDestination(value: string) {
    const current = form4.getValues("destinations") || [];
    if (current.includes(value)) {
      form4.setValue("destinations", current.filter((v) => v !== value), { shouldValidate: true });
    } else {
      form4.setValue("destinations", [...current, value], { shouldValidate: true });
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all";
  const errorClass = "text-xs text-text-danger mt-1";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Left — Image */}
            <div className="hidden md:block w-2/5 relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={step}
                  src={bgImages[step]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                  Step {step + 1} of {totalSteps}
                </p>
                <p className="text-white text-sm font-medium">
                  {step === 0 && "Let's get to know you"}
                  {step === 1 && "Your travel style"}
                  {step === 2 && "What excites you?"}
                  {step === 3 && "Dream destinations"}
                  {step === 4 && "Almost there!"}
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>

              {/* Progress */}
              <div className="flex gap-2 mb-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= step ? "bg-brand-600" : "bg-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-400 mb-4 md:hidden">
                Step {step + 1} of {totalSteps}
              </p>

              {!complete ? (
                <>
                  {/* Step Title */}
                  <div className="mb-6">
                    <h2
                      className="text-xl font-bold text-neutral-900 mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step === 0 && "Create Your Account"}
                      {step === 1 && "How Do You Travel?"}
                      {step === 2 && "What Are Your Interests?"}
                      {step === 3 && "Where Do You Want to Go?"}
                      {step === 4 && "Review Your Profile"}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {step === 0 && "Start your journey with Wayfarer."}
                      {step === 1 && "Help us tailor recommendations for you."}
                      {step === 2 && "Select all that apply."}
                      {step === 3 && "Pick destinations that call to you."}
                      {step === 4 && "Make sure everything looks right."}
                    </p>
                  </div>

                  {/* Form Steps */}
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Step 1: Account */}
                        {step === 0 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                  First Name
                                </label>
                                <input
                                  {...form1.register("firstName")}
                                  className={inputClass}
                                  placeholder="John"
                                />
                                {form1.formState.errors.firstName && (
                                  <p className={errorClass}>
                                    {form1.formState.errors.firstName.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                  Last Name
                                </label>
                                <input
                                  {...form1.register("lastName")}
                                  className={inputClass}
                                  placeholder="Doe"
                                />
                                {form1.formState.errors.lastName && (
                                  <p className={errorClass}>
                                    {form1.formState.errors.lastName.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                Email Address
                              </label>
                              <input
                                {...form1.register("email")}
                                type="email"
                                className={inputClass}
                                placeholder="john@example.com"
                              />
                              {form1.formState.errors.email && (
                                <p className={errorClass}>
                                  {form1.formState.errors.email.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step 2: Travel Style */}
                        {step === 1 && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                Travel Style
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {travelStyles.map((style) => (
                                  <button
                                    key={style}
                                    type="button"
                                    onClick={() =>
                                      form2.setValue("travelStyle", style, {
                                        shouldValidate: true,
                                      })
                                    }
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                      form2.watch("travelStyle") === style
                                        ? "border-brand-600 bg-brand-50 text-brand-800"
                                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                    }`}
                                  >
                                    {style}
                                  </button>
                                ))}
                              </div>
                              {form2.formState.errors.travelStyle && (
                                <p className={errorClass}>
                                  {form2.formState.errors.travelStyle.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                Budget Range
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {budgets.map((b) => {
                                  const active = form2.watch("budget") === b.value;
                                  return (
                                    <button
                                      key={b.value}
                                      type="button"
                                      onClick={() =>
                                        form2.setValue("budget", b.value, {
                                          shouldValidate: true,
                                        })
                                      }
                                      className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                                        active
                                          ? "border-brand-600 bg-brand-50 text-brand-800"
                                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                                      }`}
                                    >
                                      <span className="block tabular-nums">{b.range}</span>
                                      <span className={`block text-xs font-normal mt-0.5 ${active ? "text-brand-700" : "text-neutral-500"}`}>
                                        {b.note}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              {form2.formState.errors.budget && (
                                <p className={errorClass}>
                                  {form2.formState.errors.budget.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                Group Size
                              </label>
                              <div className="grid grid-cols-2 gap-3">
                                {groupSizes.map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() =>
                                      form2.setValue("groupSize", size, {
                                        shouldValidate: true,
                                      })
                                    }
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                                      form2.watch("groupSize") === size
                                        ? "border-brand-600 bg-brand-50 text-brand-800"
                                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                    }`}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                              {form2.formState.errors.groupSize && (
                                <p className={errorClass}>
                                  {form2.formState.errors.groupSize.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Interests */}
                        {step === 2 && (
                          <div>
                            <div className="grid grid-cols-2 gap-3">
                              {interests.map((interest) => {
                                const selected = (
                                  form3.watch("interests") || []
                                ).includes(interest);
                                return (
                                  <button
                                    key={interest}
                                    type="button"
                                    onClick={() => toggleInterest(interest)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                                      selected
                                        ? "border-brand-600 bg-brand-50 text-brand-800"
                                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                    }`}
                                  >
                                    {selected && (
                                      <Check className="w-3.5 h-3.5 inline mr-1.5" />
                                    )}
                                    {interest}
                                  </button>
                                );
                              })}
                            </div>
                            {form3.formState.errors.interests && (
                              <p className={errorClass + " mt-2"}>
                                {form3.formState.errors.interests.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Step 4: Destinations */}
                        {step === 3 && (
                          <div>
                            <div className="grid grid-cols-2 gap-3">
                              {topDestinations.map((dest) => {
                                const selected = (
                                  form4.watch("destinations") || []
                                ).includes(dest);
                                return (
                                  <button
                                    key={dest}
                                    type="button"
                                    onClick={() => toggleDestination(dest)}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                                      selected
                                        ? "border-brand-600 bg-brand-50 text-brand-800"
                                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                    }`}
                                  >
                                    {selected && (
                                      <Check className="w-3.5 h-3.5 inline mr-1.5" />
                                    )}
                                    {dest}
                                  </button>
                                );
                              })}
                            </div>
                            {form4.formState.errors.destinations && (
                              <p className={errorClass + " mt-2"}>
                                {form4.formState.errors.destinations.message}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Step 5: Review */}
                        {step === 4 && (
                          <div className="space-y-4">
                            {/* Account */}
                            <div className="rounded-lg border border-neutral-200 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                  Account
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => jumpToStep(0)}
                                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </button>
                              </div>
                              <p className="text-sm text-neutral-800">
                                {form1.getValues("firstName")}{" "}
                                {form1.getValues("lastName")}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {form1.getValues("email")}
                              </p>
                            </div>

                            {/* Travel Preferences */}
                            <div className="rounded-lg border border-neutral-200 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                  Travel Preferences
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => jumpToStep(1)}
                                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200">
                                  {form2.getValues("travelStyle") || "—"}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                                  {(() => {
                                    const v = form2.getValues("budget");
                                    const match = budgets.find((b) => b.value === v);
                                    return match ? `${match.range} / day` : "—";
                                  })()}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">
                                  {form2.getValues("groupSize") || "—"}
                                </span>
                              </div>
                            </div>

                            {/* Interests */}
                            <div className="rounded-lg border border-neutral-200 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                  Interests
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => jumpToStep(2)}
                                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {(form3.getValues("interests") || []).map(
                                  (interest) => (
                                    <span
                                      key={interest}
                                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      {interest}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Destinations */}
                            <div className="rounded-lg border border-neutral-200 p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                  Dream Destinations
                                </h3>
                                <button
                                  type="button"
                                  onClick={() => jumpToStep(3)}
                                  className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {(form4.getValues("destinations") || []).map(
                                  (dest) => (
                                    <span
                                      key={dest}
                                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-800 border border-brand-200"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      {dest}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
                    <button
                      onClick={handleBack}
                      disabled={step === 0}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        step === 0
                          ? "text-neutral-300 cursor-not-allowed"
                          : "text-neutral-600 hover:text-neutral-800"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
                    >
                      {step === totalSteps - 1 ? "Confirm & Join" : "Continue"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* ── Success ──────────────────────────── */
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center text-center py-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-bg-success-muted flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-text-success" />
                  </div>
                  <h2
                    className="text-2xl font-bold text-neutral-900 mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Welcome to Wayfarer!
                  </h2>
                  <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                    Your personalized travel adventure is ready. Explore
                    destinations tailored just for you.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
                  >
                    Start Exploring
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
