"use client";

import { useRef } from "react";

/**
 * SpotlightCard — card with a soft glow that follows the mouse plus an
 * animated light beam that travels along the card border on hover.
 * Original component written in the spirit of Aceternity-style spotlight cards.
 */
export default function SpotlightCard({
  children,
  className = "",
  glowClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spot relative ${className}`}
    >
      {/* mouse-following glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(45,212,191,0.14), transparent 70%)",
        }}
      />
      {/* animated beam travelling along the border (hover only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
      >
        <div
          className="absolute -inset-[70%] animate-[spin_5s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(45,212,191,0.85) 330deg, transparent 360deg)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            padding: "1.5px",
            borderRadius: "inherit",
          }}
        />
      </div>
      <div className={`relative ${glowClassName}`}>{children}</div>
    </div>
  );
}
