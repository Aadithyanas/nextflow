"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";

type AuthMode = "login" | "register";

interface AuthPanelProps {
  onSubmit: (input: {
    mode: AuthMode;
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export function AuthPanel({ onSubmit }: AuthPanelProps) {
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ mode, name, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-4 font-sans">
      
      {/* The floating card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex w-full max-w-[900px] overflow-hidden rounded-[24px] bg-[#111113] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/5 min-h-[500px]"
      >
        
        {/* Left Side: Auth Form */}
        <div className="flex w-full flex-col justify-center px-10 py-12 md:w-[45%]">
          
          <div className="mx-auto w-full max-w-[320px]">
            <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-white leading-tight">
              {mode === "register" ? "Sign up to nextflow" : "Welcome back"}
            </h2>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {mode === "register" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative overflow-hidden"
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <UserIcon className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-500 focus:bg-black"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <EnvelopeIcon className="h-5 w-5 text-white/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-500 focus:bg-black"
                />
              </div>

              <div className="relative">
                 <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-3.5 px-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-500 focus:bg-black"
                 />
              </div>

              {error && (
                <div className="mt-1 text-center text-xs font-medium text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full justify-center rounded-xl bg-blue-600/20 py-3.5 text-sm font-bold text-blue-400 transition active:bg-blue-600/40 disabled:opacity-50"
              >
                {isSubmitting ? "Loading..." : "Continue"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">




            +







































































              {mode === "register" ? "Already have an account? " : "New to Nextflow? "}
              <button onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(null); }} type="button" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                 {mode === "register" ? "Sign in" : "Sign up"}
              </button>
            </div>

            <div className="mt-8 text-center text-xs text-white/30">
              <p>By continuing, you agree to Nextflow's</p>
              <p>
                <a href="#" className="font-semibold text-white/50 hover:underline">Terms of Use</a> &{" "}
                <a href="#" className="font-semibold text-white/50 hover:underline">Privacy Policy</a> .
              </p>
            </div>

          </div>
        </div>

        {/* Right Side: Image wrapper */}
        <div className="hidden md:block md:w-[55%] relative select-none">
           <img 
              src="/landing/auth-bg.png" 
              alt="Majestic Landscape" 
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out" 
              draggable={false}
           />
           {/* Subtle gradient overlay to smoothly blend with the dark left side */}
           <div className="absolute inset-0 bg-gradient-to-r from-[#111113] via-transparent to-transparent w-24 z-10" />
        </div>

      </motion.div>
    </div>
  );
}
