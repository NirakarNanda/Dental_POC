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
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
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
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.15,
        },
      );
      // Gentle float for the hero illustration.
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, {
          y: -10,
          duration: 3.4 + i * 0.7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 46 : -38,
          y: i % 2 === 0 ? -30 : 42,
          duration: 11 + i * 3.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
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
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ivory px-5 py-14 text-ink dark:bg-abyss-950 dark:text-[#edf7f5]"
    >
      <AmbientBackground />

      {/* Soft glow orbs tinted to our theme */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          data-drift
          className="absolute -left-24 top-[8%] h-[26rem] w-[26rem] rounded-full bg-mint-300/50 blur-3xl dark:bg-mint-400/15"
        />
        <div
          data-drift
          className="absolute -right-28 top-[30%] h-[30rem] w-[30rem] rounded-full bg-amber-200/70 blur-3xl dark:bg-amber-200/10"
        />
        <div
          data-drift
          className="absolute -bottom-32 left-[22%] h-[24rem] w-[24rem] rounded-full bg-rose-200/60 blur-3xl dark:bg-rose-300/10"
        />
      </div>

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

      <div className="relative z-10 w-full max-w-md">
        {/* Clay-style dentist + patient hero topper */}
        <div className="relative z-10 -mb-6 flex justify-center" data-reveal>
          <div className="w-full max-w-[330px]" data-float>
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-mint-300/30 blur-2xl dark:bg-mint-400/15" />
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_24px_60px_-20px_rgba(13,60,60,0.5)] ring-1 ring-ink/10 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)] dark:ring-white/15">
                <img
                  src="/dentist-patient-clay.png"
                  alt="Friendly cartoon dentist examining a smiling patient in a cozy dental clinic"
                  className="h-auto w-full"
                  draggable={false}
                />
              </div>
            </div>
          </div>
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
          className="mt-4 text-center text-[11px] tracking-wide text-ink/40 dark:text-white/35"
          data-reveal
        >
          © 2026 PearlSmile Dental Studio · Crafted by Nirakar Nanda
        </p>
      </div>
    </div>
  );
}
