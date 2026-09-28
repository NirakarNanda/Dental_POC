"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fraunces } from "@/lib/fonts";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { gsap, useGSAP } from "@/lib/gsap";

const AVATARS = [
  { initials: "AR", bg: "bg-[#dfe9e4] text-[#3d5a53] dark:bg-abyss-700 dark:text-mint-200" },
  { initials: "PK", bg: "bg-[#efe6d4] text-[#7a6234] dark:bg-abyss-800 dark:text-mint-100" },
  { initials: "SM", bg: "bg-[#dcebe8] text-[#2f5d55] dark:bg-abyss-700 dark:text-mint-200" },
  { initials: "JT", bg: "bg-[#e9e2d6] text-[#6d5a3e] dark:bg-abyss-800 dark:text-mint-100" },
];

/**
 * PearlSmile POC entry page — editorial, premium, restrained.
 * A single viewport hero: oversized serif headline wrapped around a luminous
 * glass-orb visual, quiet corner details, one Doctor Login CTA.
 */
export default function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(".hl-inner", { yPercent: 0 });
        gsap.set("[data-fade]", { opacity: 1, y: 0 });
        gsap.set("[data-orb-enter]", { opacity: 1, scale: 1 });
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

      // Orb entrance
      gsap.fromTo(
        "[data-orb-enter]",
        { opacity: 0, scale: 0.93 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: "power3.out",
          delay: 0.45,
        },
      );

      // Quiet fades for header, corners, side notes, CTA
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

      // Slow orb float (inner wrapper — never fights the parallax wrapper)
      gsap.to(floatRef.current, {
        y: -14,
        duration: 6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.8,
      });

      // Soft glow pulse behind the orb
      gsap.to(glowRef.current, {
        opacity: 0.55,
        scale: 1.07,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1.8,
      });

      // Gentle mouse parallax on the orb (±10px)
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
          qx(nx * 20);
          qy(ny * 20);
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
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

      {/* ── hero: headline wrapped around the orb ────────────────── */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 pt-10 lg:px-10">
        <div className="relative w-full">
          {/* orb: stacked above the headline on mobile, floating over it on desktop */}
          <div className="relative z-10 mx-auto mb-8 flex w-fit items-center justify-center lg:pointer-events-none lg:absolute lg:inset-0 lg:m-0 lg:w-auto">
            <div ref={parallaxRef} data-orb-enter className="opacity-0">
              <div ref={floatRef} className="relative">
                <div
                  ref={glowRef}
                  aria-hidden="true"
                  className="absolute inset-[-14%] rounded-full bg-[#cde9df]/70 blur-3xl dark:bg-mint-400/15"
                />
                <Image
                  src="/hero-orb.webp"
                  alt="A pristine molar preserved inside a luminous glass orb"
                  width={1600}
                  height={1600}
                  priority
                  className="relative h-[clamp(200px,54vw,260px)] w-[clamp(200px,54vw,260px)] rounded-full object-cover lg:h-[clamp(220px,27vw,400px)] lg:w-[clamp(220px,27vw,400px)]"
                  style={{
                    maskImage:
                      "radial-gradient(circle, black 62%, transparent 72%)",
                    WebkitMaskImage:
                      "radial-gradient(circle, black 62%, transparent 72%)",
                  }}
                />
              </div>
            </div>
          </div>

          <h1
            className={`${fraunces.className} relative z-0 text-center text-[clamp(2.8rem,8.2vw,7.25rem)] font-light leading-[1.05] tracking-[-0.015em]`}
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

          {/* quiet side notes */}
          <div
            data-fade
            className="absolute left-0 top-1/2 hidden w-60 -translate-y-1/2 xl:block"
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
            className="absolute right-0 top-1/2 hidden w-60 -translate-y-1/2 text-right xl:block"
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
        <div data-fade className="mt-12 flex flex-col items-center gap-4 sm:mt-16">
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

      {/* ── bottom edge: soft-focus abstract band ────────────────── */}
      <div
        aria-hidden="true"
        className="hero-band pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48"
      >
        <div className="absolute -bottom-20 left-[6%] h-56 w-80 rounded-full bg-[#c9d2b4]/50 blur-3xl dark:bg-mint-900/40" />
        <div className="absolute -bottom-24 left-[38%] h-64 w-[34rem] rounded-full bg-[#dfe4cd]/45 blur-3xl dark:bg-abyss-800/70" />
        <div className="absolute -bottom-20 right-[4%] h-52 w-96 rounded-full bg-[#c2d8cf]/55 blur-3xl dark:bg-mint-900/30" />
        <div className="hero-grain absolute inset-0 opacity-[0.05] dark:opacity-[0.07]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f7f4ec] to-transparent dark:from-abyss-950" />
      </div>

      <footer
        data-fade
        className="relative z-20 pb-6 text-center text-[11px] font-medium tracking-wide text-[#0e2a28]/40 dark:text-white/35"
      >
        © 2026 PearlSmile Dental Studio · Designed &amp; built by Nirakar
        Nanda
      </footer>
    </section>
  );
}
