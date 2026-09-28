"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fraunces } from "@/lib/fonts";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import FloraStrip from "@/components/FloraStrip";
import { gsap, useGSAP } from "@/lib/gsap";

const AVATARS = [
  { initials: "AR", bg: "bg-[#dfe9e4] text-[#3d5a53] dark:bg-abyss-700 dark:text-mint-200" },
  { initials: "PK", bg: "bg-[#efe6d4] text-[#7a6234] dark:bg-abyss-800 dark:text-mint-100" },
  { initials: "SM", bg: "bg-[#dcebe8] text-[#2f5d55] dark:bg-abyss-700 dark:text-mint-200" },
  { initials: "JT", bg: "bg-[#e9e2d6] text-[#6d5a3e] dark:bg-abyss-800 dark:text-mint-100" },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * PearlSmile POC entry page — like the botanical reference:
 * a crystal-clear bubble overlapping the headline (text stays visible THROUGH
 * the glass), a pristine tooth floating inside it, and wildflowers swaying
 * along the bottom edge.
 */
export default function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const breatheRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(".hl-inner", { yPercent: 0 });
        gsap.set("[data-fade]", { opacity: 1, y: 0 });
        gsap.set("[data-orb-enter]", { opacity: 1, scale: 1 });
        gsap.set(".flora-layer", { rotation: 0, x: 0 });
        gsap.set("[data-petal]", { opacity: 0.7 });
        return;
      }

      // Headline: staggered line-mask reveal
      gsap.fromTo(
        ".hl-inner",
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: 1.25,
          stagger: 0.13,
          ease: "power4.out",
          delay: 0.2,
        },
      );

      // Bubble entrance
      gsap.fromTo(
        "[data-orb-enter]",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: "power3.out",
          delay: 0.45,
        },
      );

      // Quiet fades for header, corners, side notes, CTA, flora
      gsap.fromTo(
        "[data-fade]",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.7,
        },
      );

      // ── Bubble life ──────────────────────────────────────────
      // Gentle vertical bob (±14px, ~6s)
      gsap.to(floatRef.current, {
        y: -14,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2,
      });
      // Slight rotation (±2°)
      gsap.to(spinRef.current, {
        rotation: 2,
        duration: 7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2,
      });
      // Slow "breathing" scale
      gsap.to(breatheRef.current, {
        scale: 1.015,
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2,
      });
      // Animated specular sweep across the glass every ~5s
      gsap.fromTo(
        sweepRef.current,
        { xPercent: -160 },
        {
          xPercent: 460,
          duration: 1.4,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 3.6,
          delay: 2.6,
        },
      );

      // Subtle mouse parallax on the whole bubble group (±18px)
      const fine = window.matchMedia("(pointer: fine)").matches;
      if (fine && parallaxRef.current) {
        const qx = gsap.quickTo(parallaxRef.current, "x", {
          duration: 0.9,
          ease: "power3.out",
        });
        const qy = gsap.quickTo(parallaxRef.current, "y", {
          duration: 0.9,
          ease: "power3.out",
        });
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          qx(nx * 36);
          qy(ny * 36);
        };
        window.addEventListener("mousemove", onMove);

        // ── Botanical wind: each photo layer sways on its own
        // rhythm for parallax depth ─────────────────────────────
        const layers = gsap.utils.toArray<HTMLElement>(".flora-layer");
        layers.forEach((layer, i) => {
          gsap.to(layer, {
            rotation: (i === 0 ? 1 : -1) * rand(1, 1.5),
            x: (i === 0 ? -1 : 1) * rand(8, 18),
            duration: rand(4, 7),
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: rand(0, 2),
          });
        });

        // ── A few petals drifting on the breeze ────────────────
        gsap.utils.toArray<HTMLElement>("[data-petal]").forEach((petal) => {
          gsap.to(petal, {
            x: () => rand(-70, 70),
            y: () => rand(-90, -30),
            rotation: () => rand(-120, 120),
            duration: () => rand(7, 11),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: rand(0, 3),
          });
        });

        return () => window.removeEventListener("mousemove", onMove);
      }

      // No fine pointer: still sway the flora layers
      gsap.utils.toArray<HTMLElement>(".flora-layer").forEach((layer, i) => {
        gsap.to(layer, {
          rotation: (i === 0 ? 1 : -1) * rand(1, 1.5),
          x: (i === 0 ? -1 : 1) * rand(8, 18),
          duration: rand(4, 7),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: rand(0, 2),
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#f7f4ec] text-[#0e2a28] dark:bg-abyss-950 dark:text-[#edf7f5]"
    >
      {/* ── slim top bar ─────────────────────────────────────────── */}
      <header
        data-fade
        className="relative z-20 border-b border-[#0e2a28]/10 dark:border-white/10"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label="PearlSmile home">
            <Logo size={34} />
            <span className="leading-none">
              <span
                className={`${fraunces.className} block text-[22px] font-medium tracking-tight`}
              >
                PearlSmile
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0e2a28]/55 dark:text-white/50">
                Dental Studio
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-[#0e2a28]/70 underline-offset-4 transition-colors hover:text-[#0e2a28] hover:underline sm:block dark:text-white/70 dark:hover:text-white"
            >
              Doctor Login
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── top-left: doctor monogram tile ───────────────────────── */}
      <div
        data-fade
        className="absolute left-6 top-32 z-20 hidden md:block lg:left-12"
      >
        <Link
          href="/login"
          className="group flex flex-col items-center gap-3"
          aria-label="Meet Dr. Ananya Sharma — sign in"
        >
          <span className="relative block h-[76px] w-[60px] overflow-visible rounded-2xl border border-[#0e2a28]/12 bg-white/70 shadow-soft backdrop-blur transition-transform duration-500 group-hover:-translate-y-1 dark:border-white/15 dark:bg-white/[0.06]">
            <span
              className={`${fraunces.className} flex h-full items-center justify-center text-[26px] font-light text-[#0e2a28]/80 dark:text-white/85`}
            >
              AS
            </span>
            <span className="absolute -bottom-2.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#0e2a28] text-[#f7f4ec] shadow-soft transition-transform duration-500 group-hover:scale-110 dark:bg-mint-300 dark:text-abyss-950">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3.5 2.3v7.4c0 .5.6.9 1 .6l5.6-3.7c.4-.3.4-.9 0-1.2L4.5 1.7c-.4-.3-1 0-1 .6z" />
              </svg>
            </span>
          </span>
          <span className="text-center leading-tight">
            <span className="block text-[12px] font-semibold">
              Dr. Ananya Sharma
            </span>
            <span className="block text-[11px] text-[#0e2a28]/55 dark:text-white/50">
              Chief Dentist
            </span>
          </span>
        </Link>
      </div>

      {/* ── top-right: stat + avatar stack ───────────────────────── */}
      <div
        data-fade
        className="absolute right-6 top-32 z-20 hidden text-right md:block lg:right-12"
      >
        <p className={`${fraunces.className} text-[40px] font-light leading-none`}>
          2.5K+
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-[#0e2a28]/60 dark:text-white/55">
          Healthy smiles
          <br />
          crafted with care
        </p>
        <div className="mt-3 flex justify-end -space-x-2.5">
          {AVATARS.map((a) => (
            <span
              key={a.initials}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-[#f7f4ec] dark:ring-abyss-950 ${a.bg}`}
            >
              {a.initials}
            </span>
          ))}
        </div>
      </div>

      {/* ── hero: headline with the bubble overlapping its middle ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6">
        <div className="relative flex w-full flex-col items-center">
          <h1
            className={`${fraunces.className} relative z-0 text-center text-[clamp(2.9rem,7vw,5.75rem)] font-light leading-[1.08] tracking-[-0.015em]`}
          >
            <span className="block overflow-hidden pb-1">
              <span className="hl-inner block">Gentle Dentistry,</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span className="hl-inner block">Crafted Around</span>
            </span>
            <span className="block overflow-hidden pb-3">
              <span className="hl-inner block italic">Your Smile.</span>
            </span>
          </h1>

          {/* The bubble — crystal clear, so the headline reads THROUGH it */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div ref={parallaxRef} data-orb-enter className="opacity-0">
              <div ref={floatRef}>
                <div ref={spinRef}>
                  <div
                    ref={breatheRef}
                    className="relative h-[clamp(220px,34vw,400px)] w-[clamp(220px,34vw,400px)]"
                  >
                    {/* tooth floats inside the bubble */}
                    <Image
                      src="/tooth.png"
                      alt=""
                      aria-hidden="true"
                      width={800}
                      height={800}
                      priority
                      className="absolute left-1/2 top-1/2 w-[46%] -translate-x-1/2 -translate-y-1/2"
                    />
                    {/* the glass itself — transparent middle */}
                    <Image
                      src="/orb-glass.png"
                      alt="A pristine tooth preserved inside a crystal-clear glass bubble"
                      width={1200}
                      height={1200}
                      priority
                      className="absolute inset-0 h-full w-full"
                    />
                    {/* travelling specular highlight, clipped to the bubble */}
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                      <div
                        ref={sweepRef}
                        aria-hidden="true"
                        className="absolute -bottom-[20%] -top-[20%] left-0 w-1/3 rotate-[18deg] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* side notes flank the bubble on wide screens */}
          <div
            data-fade
            className="absolute left-0 top-1/2 hidden w-56 -translate-y-1/2 xl:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0e2a28]/45 dark:text-white/40">
              The Studio
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[#0e2a28]/70 dark:text-white/60">
              Painless, precise dentistry designed around your comfort — and
              your calendar.
            </p>
          </div>
          <div
            data-fade
            className="absolute right-0 top-1/2 hidden w-56 -translate-y-1/2 text-right xl:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0e2a28]/45 dark:text-white/40">
              The Standard
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[#0e2a28]/70 dark:text-white/60">
              From routine hygiene to full smile design. One studio, one
              standard: excellence.
            </p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div data-fade className="mt-14 flex flex-col items-center gap-4 lg:mt-16">
          <Link
            href="/login"
            className="group inline-flex items-center gap-3 rounded-full border border-[#0e2a28]/15 bg-white/85 py-4 pl-9 pr-7 text-[15px] font-semibold tracking-wide text-[#0e2a28] shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0e2a28]/30 hover:shadow-lift dark:border-white/15 dark:bg-white/[0.07] dark:text-white dark:hover:border-white/30"
          >
            Doctor Login
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <p className="text-[10.5px] font-medium uppercase tracking-[0.24em] text-[#0e2a28]/45 dark:text-white/40">
            Demo POC
          </p>
        </div>
      </main>

      {/* ── drifting petals ── */}
      <span
        data-petal
        aria-hidden="true"
        className="absolute left-[12%] top-[62%] z-[5] h-3 w-4 rounded-full bg-[var(--flora-petal)] opacity-0"
      />
      <span
        data-petal
        aria-hidden="true"
        className="absolute right-[16%] top-[70%] z-[5] h-2.5 w-3.5 rounded-full bg-[var(--flora-petal)] opacity-0"
      />
      <span
        data-petal
        aria-hidden="true"
        className="absolute left-[46%] top-[78%] z-[5] h-2 w-3 rounded-full bg-[var(--flora-petal)] opacity-0"
      />

      {/* ── swaying wildflowers along the bottom edge ── */}
      <div data-fade>
        <FloraStrip />
      </div>

      {/* ── film grain ── */}
      <div
        aria-hidden="true"
        className="hero-grain pointer-events-none absolute inset-0 z-[3] opacity-[0.05] dark:opacity-[0.07]"
      />

      <footer
        data-fade
        className="relative z-20 pb-6 pt-2 text-center text-[11px] font-medium tracking-wide text-[#0e2a28]/40 dark:text-white/35"
      >
        © 2026 PearlSmile Dental Studio · Designed &amp; built by Nirakar
        Nanda
      </footer>
    </section>
  );
}
