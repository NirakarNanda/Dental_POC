"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * HeroArt — the tooth hero illustration with GSAP motion:
 *  - gentle infinite floating of the tooth emblem,
 *  - a periodic diagonal shine sweep across the tooth,
 *  - twinkling sparkle stars orbiting the emblem.
 */
export default function HeroArt() {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Gentle floating motion
      gsap.to(floatRef.current, {
        y: -14,
        rotation: 2.5,
        duration: 3.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Periodic shine sweep across the tooth
      gsap.fromTo(
        shineRef.current,
        { xPercent: -160, opacity: 0 },
        {
          xPercent: 160,
          opacity: 1,
          duration: 1.4,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 3.2,
        },
      );

      // Subtle entrance
      gsap.from(rootRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 1,
        ease: "power3.out",
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div
        className="absolute inset-0 animate-blob-drift rounded-[3rem] bg-gradient-to-br from-mint-200 via-aqua-100 to-mint-300 blur-2xl dark:from-mint-900/50 dark:via-abyss-800 dark:to-mint-800/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-6 animate-blob-drift-2 rounded-[2.5rem] bg-white/70 backdrop-blur dark:bg-abyss-900/70"
        aria-hidden="true"
      />

      {/* twinkling sparkle stars around the emblem */}
      <svg width="14" height="14" viewBox="0 0 24 24" className="absolute left-[12%] top-[16%] animate-twinkle text-mint-400 dark:text-mint-300/80" aria-hidden="true">
        <path d="M12 2c.7 5.8 4.2 9.3 10 10-5.8.7-9.3 4.2-10 10-.7-5.8-4.2-9.3-10-10 5.8-.7 9.3-4.2 10-10z" fill="currentColor" />
      </svg>
      <svg width="10" height="10" viewBox="0 0 24 24" className="absolute right-[14%] top-[30%] animate-twinkle text-cyan-400 dark:text-cyan-300/70" style={{ animationDelay: "0.9s" }} aria-hidden="true">
        <path d="M12 2c.7 5.8 4.2 9.3 10 10-5.8.7-9.3 4.2-10 10-.7-5.8-4.2-9.3-10-10 5.8-.7 9.3-4.2 10-10z" fill="currentColor" />
      </svg>
      <svg width="12" height="12" viewBox="0 0 24 24" className="absolute bottom-[24%] left-[8%] animate-twinkle text-mint-500 dark:text-mint-400/70" style={{ animationDelay: "1.7s" }} aria-hidden="true">
        <path d="M12 2c.7 5.8 4.2 9.3 10 10-5.8.7-9.3 4.2-10 10-.7-5.8-4.2-9.3-10-10 5.8-.7 9.3-4.2 10-10z" fill="currentColor" />
      </svg>
      <svg width="9" height="9" viewBox="0 0 24 24" className="absolute bottom-[14%] right-[22%] animate-twinkle text-teal-300 dark:text-teal-300/60" style={{ animationDelay: "2.4s" }} aria-hidden="true">
        <path d="M12 2c.7 5.8 4.2 9.3 10 10-5.8.7-9.3 4.2-10 10-.7-5.8-4.2-9.3-10-10 5.8-.7 9.3-4.2 10-10z" fill="currentColor" />
      </svg>

      <div className="relative flex h-full items-center justify-center">
        <div ref={floatRef}>
          <div className="relative overflow-hidden rounded-full">
            <svg width="220" height="220" viewBox="0 0 48 48" aria-hidden="true" className="drop-shadow-xl">
              <defs>
                <linearGradient id="hero-tooth" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5eead4" />
                  <stop offset="60%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="21" fill="url(#hero-tooth)" />
              <path
                d="M17.5 13c-3.2 0-5.2 2.6-5.2 6 0 3.7 1.6 4.9 2.6 8.4.9 2.6 1.4 5.3 3 5.3 1.7 0 1-4.9 2.2-6.9.6-1.3 3.2-1.3 3.8 0 1.2 2 1.3 6.9 3 6.9 1.6 0 2.1-2.7 3-5.3 1-3.5 2.6-4.7 2.6-8.4 0-3.4-2-6-5.2-6-2.1 0-3.8 1-5.9 1s-3.8-1-5.9-1z"
                fill="#ffffff"
              />
              <path d="M34 16c.7 1.6 1.3 2.3 2.9 3-1.6.7-2.2 1.4-2.9 3-.7-1.6-1.3-2.3-2.9-3 1.6-.7 2.2-1.4 2.9-3z" fill="#fff" opacity="0.95" />
              <path d="M14.5 33.5c.5 1.1.9 1.6 2 2.1-1.1.5-1.5 1-2 2.1-.5-1.1-.9-1.6-2-2.1 1.1-.5 1.5-1 2-2.1z" fill="#fff" opacity="0.8" />
            </svg>
            {/* shine sweep, clipped to the tooth circle */}
            <div
              ref={shineRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)",
              }}
            />
          </div>
        </div>

        <div className="absolute left-2 top-10 animate-fade-up rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur dark:bg-abyss-900/90" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs font-semibold text-slate-500 dark:text-mint-200/60">Next slot</p>
          <p className="text-sm font-bold text-mint-800 dark:text-mint-200">Today · 4:30 PM</p>
        </div>
        <div className="absolute bottom-12 right-0 animate-fade-up rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur dark:bg-abyss-900/90" style={{ animationDelay: "0.5s" }}>
          <p className="text-xs font-semibold text-slate-500 dark:text-mint-200/60">Patient rating</p>
          <p className="text-sm font-bold text-mint-800 dark:text-mint-200">4.9 / 5 · 2,300+ reviews</p>
        </div>
        <div className="absolute right-8 top-4 animate-fade-up rounded-full bg-mint-600 px-4 py-2 text-xs font-bold text-white shadow-soft" style={{ animationDelay: "0.7s" }}>
          Painless-first
        </div>
      </div>
    </div>
  );
}
