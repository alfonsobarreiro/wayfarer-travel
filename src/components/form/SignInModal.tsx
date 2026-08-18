"use client";

/**
 * SignInModal
 * ─────────────────────────────────────────────────────────────────────────
 * UI shell for returning-user sign-in. Matches the visual language of
 * SignUpModal so the auth pair reads as one system, but is intentionally
 * small: email + password, "forgot password" link, switch-to-signup link.
 *
 * No real auth backend wired up; this is a concept project. A note in the
 * footer makes that legible.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowRight, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signInSchema = z.object({
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type SignInValues = z.infer<typeof signInSchema>;

interface SignInModalProps {
  open:    boolean;
  onClose: () => void;
  // Optional handler for "Create an account" — caller wires this to SignUpModal.
  onSwitchToSignUp?: () => void;
}

export function SignInModal({ open, onClose, onSwitchToSignUp }: SignInModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState, reset } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(_values: SignInValues) {
    // Concept project: simulate auth success.
    setSubmitted(true);
  }

  function handleClose() {
    setSubmitted(false);
    reset();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[55] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-label="Sign in"
            className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.96, opacity: 0, y: 10 }}
            animate={{ scale: 1,    opacity: 1, y: 0 }}
            exit={{    scale: 0.96, opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-brand-600" />
                </div>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Welcome back
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  You&apos;re signed in. In a real product, this would open your
                  saved trips and personalized recommendations.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 rounded-lg bg-bg-primary text-white text-sm font-semibold hover:bg-bg-primary-hover transition-colors"
                >
                  Continue
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Sign in
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Welcome back. Pick up where you left off.
                </p>

                {/* Email */}
                <label className="block text-xs font-medium text-neutral-600 mb-2">
                  Email
                </label>
                <div className="relative mb-4">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full pl-12 pr-3 py-3 rounded-lg border border-neutral-200 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
                {formState.errors.email && (
                  <p className="text-xs text-text-danger -mt-3 mb-3">
                    {formState.errors.email.message}
                  </p>
                )}

                {/* Password */}
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-neutral-600">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      // Concept project: stub for future flow
                    }}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative mb-4">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="At least 6 characters"
                    {...register("password")}
                    className="w-full pl-12 pr-3 py-3 rounded-lg border border-neutral-200 text-sm placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
                {formState.errors.password && (
                  <p className="text-xs text-text-danger -mt-3 mb-3">
                    {formState.errors.password.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-bg-primary text-white text-sm font-semibold hover:bg-bg-primary-hover transition-colors"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </button>

                {onSwitchToSignUp && (
                  <p className="mt-6 text-center text-sm text-neutral-600">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSwitchToSignUp();
                      }}
                      className="font-medium text-brand-700 hover:text-brand-800"
                    >
                      Create an account
                    </button>
                  </p>
                )}

                <p className="mt-6 text-center text-xs text-neutral-400">
                  Concept project. No real authentication.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
