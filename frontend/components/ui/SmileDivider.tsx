"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * SmileDivider — an SVG "smile curve" section divider whose path draws
 * itself as it scrolls into view (stroke-dashoffset animation).
 */
export default function SmileDivider({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: path,
        start: "top 88%",
        once: true,
      },
    });
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative mx-auto w-full max-w-5xl px-6 ${className}`}
    >
      <svg
        viewBox="0 0 1200 90"
        className={`h-14 w-full sm:h-20 ${flip ? "-scale-y-100" : ""}`}
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="smile-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0" />
            <stop offset="25%" stopColor="#5eead4" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="75%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d="M20 22 C 220 78, 420 78, 600 45 C 780 12, 980 12, 1180 55"
          stroke="url(#smile-grad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
