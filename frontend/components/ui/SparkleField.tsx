"use client";

import { useMemo } from "react";

/** Deterministic PRNG so server and client render identical sparkles. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * SparkleField — a field of small four-point sparkle stars that twinkle at
 * staggered rhythms. Purely decorative accent background.
 */
export default function SparkleField({
  count = 26,
  seed = 7,
  className = "",
  starClassName = "text-mint-300 dark:text-mint-500/50",
}: {
  count?: number;
  seed?: number;
  className?: string;
  starClassName?: string;
}) {
  const stars = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 8 + rand() * 14,
      delay: rand() * 2.8,
      duration: 2.2 + rand() * 2.4,
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {stars.map((s) => (
        <svg
          key={s.id}
          width={s.size}
          height={s.size}
          viewBox="0 0 24 24"
          className={`absolute animate-twinkle ${starClassName}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <path
            d="M12 2c.7 5.8 4.2 9.3 10 10-5.8.7-9.3 4.2-10 10-.7-5.8-4.2-9.3-10-10 5.8-.7 9.3-4.2 10-10z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}
