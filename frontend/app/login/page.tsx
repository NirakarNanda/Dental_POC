"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fraunces } from "@/lib/fonts";
import { gsap, useGSAP } from "@/lib/gsap";
import AmbientBackground from "@/components/AmbientBackground";
import ThemeToggle from "@/components/theme/ThemeToggle";

const DEMO_EMAIL = "doctor@pearlsmile.dental";
const DEMO_PASSWORD = "demo1234";

const SKETCHFAB_EMBED =
  "https://sketchfab.com/models/af77b63454c248df8709741aac7cf393/embed?autostart=1&ui_theme=dark";

const inputCls =
  "w-full rounded-2xl border border-white/50 bg-white/70 px-5 py-4 text-[16px] text-ink shadow-soft backdrop-blur-md placeholder:text-ink/35 outline-none transition-all focus:border-mint-500/60 focus:bg-white/95 focus:ring-4 focus:ring-mint-500/10 dark:border-white/10 dark:bg-white/[0.07] dark:text-[#edf7f5] dark:placeholder:text-white/30 dark:focus:border-mint-300/40 dark:focus:bg-white/[0.1] dark:focus:ring-mint-300/10";

const eyeIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const eyeOffIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

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
      // Slow ambient drift for the glow orbs.
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

      {/* Reference-style glow orbs, tinted to our theme */}
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
        {/* 3D hero */}
        <div data-reveal>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-mint-300/30 blur-2xl dark:bg-mint-400/15" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-abyss-900 shadow-[0_30px_80px_-24px_rgba(13,60,60,0.5)] ring-1 ring-ink/10 dark:shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)] dark:ring-white/15">
              {!modelLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="animate-pulse text-sm tracking-wide text-white/40">
                    Loading 3D…
                  </p>
                </div>
              )}
              <iframe
                title="Rose Tinted — flowers in test tubes, 3D model by SiobhanClair"
                src={SKETCHFAB_EMBED}
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                onLoad={() => setModelLoaded(true)}
                className="relative h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] tracking-wide text-ink/40 dark:text-white/35">
            “Rose Tinted” by{" "}
            <a
              href="https://sketchfab.com/SiobhanClair"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-ink dark:hover:text-white"
            >
              SiobhanClair
            </a>{" "}
            on{" "}
            <a
              href="https://sketchfab.com/3d-models/rose-tinted-af77b63454c248df8709741aac7cf393"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:text-ink dark:hover:text-white"
            >
              Sketchfab
            </a>
          </p>
        </div>

        <h1
          data-reveal
          className={`${fraunces.className} mt-8 text-center text-[2.6rem] font-light leading-none tracking-tight`}
        >
          Log In
        </h1>

        <form onSubmit={submit} className="mt-7 space-y-4" data-reveal>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            className={inputCls}
          />
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className={`${inputCls} pr-13`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {showPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>

          {error && (
            <div
              className="rounded-2xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-ink py-4 text-[16px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 dark:bg-mint-300 dark:text-abyss-950"
          >
            {busy ? "Logging in…" : "Login"}
          </button>
        </form>

        <div
          data-reveal
          className="mt-6 rounded-2xl border border-white/50 bg-white/50 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
        >
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
