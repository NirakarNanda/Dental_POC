"use client";

import { useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import HeroArt from "@/components/HeroArt";
import ThemeToggle from "@/components/theme/ThemeToggle";
import SparkleField from "@/components/ui/SparkleField";
import SmileDivider from "@/components/ui/SmileDivider";
import SpotlightCard from "@/components/ui/SpotlightCard";
import TypeReveal, { type TypeSegment } from "@/components/ui/TypeReveal";
import { gsap, useGSAP } from "@/lib/gsap";

const HEADLINE: TypeSegment[] = [
  { text: "Gentle dentistry, " },
  { text: "brilliant smiles", className: "text-gradient" },
  { text: "." },
];

/**
 * PearlSmile POC entry page — a single viewport-filling animated hero.
 * No brochure sections: brand, typing headline, tagline, Doctor Login CTA,
 * demo-POC note, tooth art with GSAP motion, sparkles and a smile-curve accent.
 */
export default function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);

  // Entrance: staggered reveal of the hero blocks
  useGSAP(
    () => {
      const items = heroRef.current?.querySelectorAll("[data-hero]");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.1,
          },
        );
      }
    },
    { scope: heroRef },
  );

  return (
    <div className="overflow-x-clip bg-white text-slate-900 dark:bg-abyss-950 dark:text-mint-50">
      <section
        ref={heroRef}
        className="relative flex min-h-svh flex-col overflow-hidden"
      >
        {/* ambient background */}
        <div
          className="pointer-events-none absolute -left-32 top-10 h-[480px] w-[480px] animate-blob-drift rounded-full bg-mint-100/80 blur-3xl dark:bg-mint-900/30"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-[420px] w-[420px] animate-blob-drift-2 rounded-full bg-aqua-100/70 blur-3xl dark:bg-cyan-900/20"
          aria-hidden="true"
        />
        <SparkleField className="opacity-70" seed={11} />

        {/* slim header: brand + theme toggle */}
        <header data-hero className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <span className="flex items-center gap-2.5">
            <Logo size={38} />
            <span className="text-lg font-bold tracking-tight text-mint-950 dark:text-white">
              PearlSmile{" "}
              <span className="font-medium text-mint-700 dark:text-mint-300">
                Dental Studio
              </span>
            </span>
          </span>
          <ThemeToggle />
        </header>

        {/* hero body */}
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-4 text-center sm:px-8">
          <div data-hero className="w-48 sm:w-64 lg:w-72">
            <HeroArt />
          </div>

          <div
            data-hero
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-4 py-1.5 text-xs font-semibold text-mint-800 dark:border-abyss-700 dark:bg-abyss-900 dark:text-mint-200"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-mint-500" />
            Painless-first dental care · Bengaluru
          </div>

          <h1
            data-hero
            className="mt-5 min-h-[2.4em] max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-mint-950 dark:text-white sm:min-h-0 sm:text-5xl lg:text-6xl"
          >
            <TypeReveal segments={HEADLINE} startDelay={400} />
          </h1>

          <p
            data-hero
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-mint-100/70 sm:text-lg"
          >
            PearlSmile Dental Studio — modern, gentle dentistry with honest
            pricing and spa-like comfort.
          </p>

          <div data-hero className="mt-9 w-full max-w-sm">
            <SpotlightCard className="rounded-[2rem] border border-mint-100 bg-white/80 p-3 shadow-soft backdrop-blur dark:border-abyss-700/70 dark:bg-abyss-900/80">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2.5 rounded-[1.6rem] bg-mint-600 px-8 py-4 text-base font-bold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-mint-700"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5M15 12H3" />
                </svg>
                Doctor Login
              </Link>
              <p className="px-2 pb-2 pt-3 text-xs leading-relaxed text-slate-500 dark:text-mint-100/60">
                Demo POC — sign in with the demo credentials shown on the login
                page to explore the dashboard and patient records.
              </p>
            </SpotlightCard>
          </div>

          <div data-hero className="mt-4 w-full max-w-md">
            <SmileDivider />
          </div>
        </div>

        <footer
          data-hero
          className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-6 text-center sm:px-8"
        >
          <p className="text-xs font-medium text-slate-400 dark:text-mint-100/40">
            © {new Date().getFullYear()} PearlSmile Dental Studio · Demo
            proof-of-concept, not a real clinic
          </p>
        </footer>
      </section>
    </div>
  );
}
