"use client";

import { useEffect, useMemo, useState } from "react";

export interface TypeSegment {
  text: string;
  className?: string;
}

/**
 * TypeReveal — types out headline segments character by character with a
 * blinking caret, then rests on the finished headline. Respects
 * prefers-reduced-motion (renders the full text immediately).
 */
export default function TypeReveal({
  segments,
  className = "",
  speed = 26,
  startDelay = 500,
}: {
  segments: TypeSegment[];
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const full = useMemo(() => segments.map((s) => s.text).join(""), [segments]);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCount(full.length);
      return;
    }
    const t = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(t);
  }, [full.length, startDelay]);

  useEffect(() => {
    if (!started || count >= full.length) return;
    const t = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(t);
  }, [started, count, full.length, speed]);

  const done = count >= full.length;

  // Split the typed prefix back across the styled segments.
  let remaining = count;
  const rendered: React.ReactNode[] = [];
  segments.forEach((s, i) => {
    const take = Math.min(remaining, s.text.length);
    remaining -= take;
    if (take > 0) {
      rendered.push(
        <span key={i} className={s.className}>
          {s.text.slice(0, take)}
        </span>,
      );
    }
  });

  return (
    <span className={className} aria-label={full}>
      <span aria-hidden="true">
        {rendered}
        {!done && <span className="type-caret" />}
      </span>
    </span>
  );
}
