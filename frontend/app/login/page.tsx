"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fraunces } from "@/lib/fonts";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "@/components/Logo";
import AmbientBackground from "@/components/AmbientBackground";
import ThemeToggle from "@/components/theme/ThemeToggle";
import PasswordField, { fieldInputCls, fieldLabelCls } from "@/components/PasswordField";
import ToothBuddy from "@/components/ToothBuddy";

const DEMO_EMAIL = "doctor@pearlsmile.dental";
const DEMO_PASSWORD = "demo1234";

export default function LoginPage() {
  const { login } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set("[data-reveal]", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        "[data-reveal]",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.15,
        },
      );
      // Gentle perpetual float for the equipment showcase cards.
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? -14 : 12,
          rotation: i % 2 === 0 ? 1.1 : -1.1,
          duration: 3.6 + i * 0.8,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.5,
        });
      });
    },
    { scope: rootRef },
  );

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

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ivory px-5 py-12 text-ink dark:bg-abyss-950 dark:text-[#edf7f5]"
    >
      <AmbientBackground />

      <div
        className="absolute right-5 top-5 z-20 flex items-center gap-3 sm:right-8 sm:top-8"
        data-reveal
      >
        <Link
          href="/"
          className="group flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 text-sm font-semibold text-ink/70 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:text-ink dark:border-white/15 dark:bg-white/[0.06] dark:text-white/70 dark:hover:border-white/25 dark:hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          >
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
          Back
        </Link>
        <ThemeToggle />
      </div>

      {/* Equipment showcase — fills the wide-screen space flanking the card */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden w-[34%] items-center justify-center xl:flex"
        aria-hidden="true"
      >
        <div className="relative w-full max-w-[400px] -translate-y-6 pl-[6%]">
          <div
            className="absolute -inset-10 rounded-full bg-mint-400/15 blur-3xl dark:bg-mint-300/10"
            data-reveal
          />
          <div data-float className="relative -rotate-3">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-20px_rgba(13,60,60,0.45)] ring-1 ring-ink/10 dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] dark:ring-white/15">
              <img
                src="/equipment-chair.png"
                alt=""
                className="h-auto w-full"
                draggable={false}
              />
            </div>
            <p
              className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/40 dark:text-white/35"
              data-reveal
            >
              Operatory chair
            </p>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[34%] items-center justify-center xl:flex"
        aria-hidden="true"
      >
        <div className="relative w-full max-w-[360px] translate-y-10 pr-[6%]">
          <div
            className="absolute -inset-10 rounded-full bg-mint-400/15 blur-3xl dark:bg-mint-300/10"
            data-reveal
          />
          <div data-float className="relative rotate-2">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-20px_rgba(13,60,60,0.45)] ring-1 ring-ink/10 dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] dark:ring-white/15">
              <img
                src="/equipment-tools.png"
                alt=""
                className="h-auto w-full"
                draggable={false}
              />
            </div>
            <p
              className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.26em] text-ink/40 dark:text-white/35"
              data-reveal
            >
              Precision instruments
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative z-10 -mb-5 flex justify-center" data-reveal>
          <ToothBuddy />
        </div>
        <div
          data-reveal
          className="glass-deep rounded-[1.75rem] p-8 pt-10 sm:p-10 sm:pt-12"
        >
          <div className="flex flex-col items-center text-center">
            <Logo size={52} />
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45 dark:text-white/40">
              Staff Portal
            </p>
            <h1
              className={`${fraunces.className} mt-2 text-[2rem] font-light leading-tight tracking-tight`}
            >
              Welcome back, Doctor
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/55 dark:text-white/50">
              Sign in to open your clinic dashboard.
            </p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className={fieldLabelCls}>
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
                className={fieldInputCls}
              />
            </div>
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />

            {error && (
              <div
                className="rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-ink py-3.5 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 dark:bg-mint-300 dark:text-abyss-950"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="glass-pill mt-7 rounded-2xl bg-white/40 p-4 dark:bg-white/[0.05]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45 dark:text-white/40">
              Demo credentials
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-mono text-[12.5px] leading-relaxed text-ink/70 dark:text-white/60">
                {DEMO_EMAIL}
                <br />
                {DEMO_PASSWORD}
              </p>
              <button
                type="button"
                onClick={fillDemo}
                className="shrink-0 text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink dark:text-white/80 dark:decoration-white/30 dark:hover:decoration-white"
              >
                Fill
              </button>
            </div>
          </div>
        </div>

        <p
          className="mt-6 text-center text-[11px] tracking-wide text-ink/40 dark:text-white/35"
          data-reveal
        >
          © 2026 PearlSmile Dental Studio · Crafted by Nirakar Nanda
        </p>
      </div>
    </div>
  );
}
