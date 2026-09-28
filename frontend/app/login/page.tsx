"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import SparkleField from "@/components/ui/SparkleField";
import ThemeToggle from "@/components/theme/ThemeToggle";

const DEMO_EMAIL = "doctor@pearlsmile.dental";
const DEMO_PASSWORD = "demo1234";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
      setBusy(false);
    }
  };

  const inputCls =
    "w-full rounded-2xl border border-mint-100 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-mint-400 focus:ring-4 focus:ring-mint-100 dark:border-abyss-700 dark:bg-abyss-950 dark:text-mint-50 dark:placeholder:text-mint-100/40 dark:focus:border-mint-500 dark:focus:ring-mint-900/50";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-mint-50 via-aqua-50 to-mint-100 px-5 py-12 dark:from-abyss-950 dark:via-abyss-900 dark:to-abyss-950">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 animate-blob-drift rounded-full bg-mint-200/50 blur-3xl dark:bg-mint-900/30" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 animate-blob-drift-2 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/25" aria-hidden="true" />
      <SparkleField seed={23} />

      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="rounded-[2rem] bg-white/90 p-8 shadow-lift backdrop-blur-xl dark:border dark:border-abyss-700/60 dark:bg-abyss-900/90 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo size={56} />
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-mint-950 dark:text-white">
              PearlSmile Dental Studio
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-mint-100/60">
              Staff portal — sign in to manage the clinic
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-mint-100/80">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@pearlsmile.dental"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-mint-100/80">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {error && (
              <div className="animate-fade-up rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-mint-600 py-3.5 text-base font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-dashed border-mint-300 bg-mint-50/60 p-4 dark:border-abyss-700 dark:bg-abyss-950/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-mint-700 dark:text-mint-300">Demo credentials</p>
                <p className="mt-1.5 font-mono text-[13px] text-slate-700 dark:text-mint-100/80">
                  {DEMO_EMAIL}
                  <br />
                  {DEMO_PASSWORD}
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="shrink-0 rounded-full border border-mint-300 bg-white px-4 py-2 text-xs font-bold text-mint-800 transition-all hover:bg-mint-600 hover:text-white dark:border-abyss-700 dark:bg-abyss-800 dark:text-mint-200 dark:hover:bg-mint-600 dark:hover:text-white"
              >
                Fill
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-mint-100/60">
          <Link href="/" className="font-semibold text-mint-700 hover:text-mint-900 dark:text-mint-300 dark:hover:text-mint-200">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
