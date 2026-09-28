"use client";

import Image from "next/image";

/**
 * FloraStrip — vibrant wildflower meadow photographs along the bottom edge
 * of the landing hero. Full rectangular photos blended into the page with
 * long CSS mask fades (no cutouts, so no fringes or halos). Each layer is
 * 120% viewport width and carries the `flora-layer` class; the page's GSAP
 * timeline drifts them horizontally with irregular gust timing for
 * natural parallax wind. Three butterflies wander above the meadow on
 * gentle curved paths with fluttering wings.
 */
const BUTTERFLIES = [
  { left: "14%", top: "6%", size: 34, dur: 26, delay: 0 },
  { left: "58%", top: "0%", size: 26, dur: 32, delay: 4 },
  { left: "78%", top: "12%", size: 40, dur: 29, delay: 9 },
];

export default function FloraStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden"
    >
      {/* back layer: vibrant wide meadow */}
      <div className="flora-layer absolute bottom-0 left-[-10vw] h-[26vh] w-[120vw] sm:h-[32vh]">
        <Image
          src="/meadow-back.jpg"
          alt=""
          fill
          sizes="120vw"
          className="flora-photo object-cover object-bottom dark:brightness-[0.62] dark:saturate-[0.85]"
        />
        {/* cool tint so the photo melts into the dark theme */}
        <div className="absolute inset-0 hidden dark:block dark:bg-[#0d3b38]/35" />
        {/* dark-mode top grade: navy washes down over bright photo tops */}
        <div className="absolute inset-0 hidden bg-gradient-to-b from-[#041f1e] via-[#041f1e]/35 to-transparent dark:block" />
      </div>
      {/* front layer: vivid close-up meadow */}
      <div className="flora-layer absolute bottom-0 left-[-10vw] h-[32vh] w-[120vw] sm:h-[38vh]">
        <Image
          src="/meadow-front.jpg"
          alt=""
          fill
          sizes="120vw"
          className="flora-photo object-cover object-bottom dark:brightness-[0.62] dark:saturate-[0.85]"
        />
        <div className="absolute inset-0 hidden dark:block dark:bg-[#0d3b38]/35" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-[#041f1e] via-[#041f1e]/35 to-transparent dark:block" />
      </div>

      {/* seam wash: page background knits the photos into the backdrop —
          spans the whole transition zone so no horizontal band is visible */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#f7f4ec]/[0.55] via-[#f7f4ec]/25 to-transparent dark:from-[#041f1e]/[0.62] dark:via-[#041f1e]/30 dark:to-transparent" />

      {/* butterflies wandering above the meadow */}
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          data-butterfly
          data-dur={b.dur}
          data-delay={b.delay}
          className="absolute z-[2] opacity-0"
          style={{ left: b.left, top: b.top, width: b.size }}
        >
          <div data-flutter className="blur-[0.5px]">
            <Image
              src="/butterfly.png"
              alt=""
              width={160}
              height={98}
              className="h-auto w-full"
            />
          </div>
        </div>
      ))}

      {/* spacer gives the strip its height */}
      <div className="h-[32vh] sm:h-[38vh]" />
    </div>
  );
}
