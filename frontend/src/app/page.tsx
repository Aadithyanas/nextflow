"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AuthPanel } from "@/components/auth-panel";
import { BuilderShell } from "@/components/workflow/builder-shell";
import { api } from "@/lib/api";
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  StoredUser,
} from "@/lib/storage";
import { LandingPage } from "@/components/landing-page";

/** Full-screen skeleton shown during auth-state hydration */
function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col gap-3 bg-mesh px-4 py-4 md:px-5">
      {/* Topbar skeleton */}
      <div className="skeleton h-16 w-full rounded-[26px]" />
      {/* Canvas + sidebar */}
      <div className="grid flex-1 gap-3 xl:grid-cols-[240px_minmax(0,1fr)]" style={{ minHeight: 520 }}>
        <div className="skeleton rounded-[30px]" />
        <div className="skeleton rounded-[28px]" />
      </div>
      {/* Execution panel */}
      <div className="skeleton h-52 rounded-[28px]" />
    </div>
  );
}

export default function HomePage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // undefined = still loading; null = not logged in; string = authenticated
  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    setToken(storedToken ?? null);
    setUser(storedUser);
  }, []);

  async function handleAuth(input: {
    mode: "login" | "register";
    name: string;
    email: string;
    password: string;
  }) {
    const response =
      input.mode === "register"
        ? await api.register({
            name: input.name,
            email: input.email,
            password: input.password,
          })
        : await api.login({
            email: input.email,
            password: input.password,
          });

    setStoredAuth(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
    setShowAuth(false);
    toast.success(
      input.mode === "register" ? "Workspace created!" : "Welcome back!"
    );
  }

  // Still hydrating — show skeleton to avoid flicker
  if (token === undefined) {
    return <LoadingSkeleton />;
  }

  // Not authenticated
  if (!token || !user) {
    if (showAuth) {
      return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0B]">
           {/* Dark backdrop matching landing page seamlessly */}
           <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
           {/* Back button */}
           <button 
             onClick={() => setShowAuth(false)}
             className="absolute left-6 top-6 z-50 flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition"
           >
             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
               <polyline points="15 18 9 12 15 6" />
             </svg>
             Back
           </button>
           <AuthPanel onSubmit={handleAuth} />
        </div>
      );
    }
    return <LandingPage onLoginClick={() => setShowAuth(true)} />;
  }

  // Authenticated — show builder
  return <BuilderShell token={token} user={user} />;
}
