"use client";

import Image from "next/image";

/**
 * PotScene — a single elegant purple-orchid photograph along the bottom edge
 * of the landing hero. The full rectangular photo is blended into the page
 * with long CSS mask fades (no cutouts, so no fringes or halos). A seam-wash
 * overlay knits the photo into the page background so no horizontal band is
 * ever visible. The still-life stays essentially still — GSAP gives it only a
 * barely-perceptible slow zoom for life.
 */
export default function PotScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden"
    >
      <div data-pot className="pot-zoom absolute inset-x-0 bottom-0 h-[30vh] sm:h-[36vh]">
        <Image
          src="/orchid-pot.jpg"
          alt=""
          fill
          sizes="100vw"
          className="pot-photo object-cover object-bottom dark:brightness-[0.62] dark:saturate-[0.85]"
        />
        {/* cool tint so the photo melts into the dark theme */}
        <div className="absolute inset-0 hidden dark:block dark:bg-[#0d3b38]/35" />
        {/* dark-mode top grade: navy washes down over the bright photo top */}
        <div className="absolute inset-0 hidden bg-gradient-to-b from-[#041f1e] via-[#041f1e]/35 to-transparent dark:block" />
      </div>

      {/* seam wash: page background knits the photo into the backdrop —
          spans the whole transition zone so no horizontal band is visible */}
      <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#f7f4ec]/[0.55] via-[#f7f4ec]/25 to-transparent dark:from-[#041f1e]/[0.62] dark:via-[#041f1e]/30 dark:to-transparent" />

      {/* spacer gives the scene its height */}
      <div className="h-[30vh] sm:h-[36vh]" />
    </div>
  );
}

const BUTTERFLIES = [
  // near the bubble (upper-center)
  { left: "44%", top: "26%", size: 40, dur: 26, delay: 0, src: "/butterfly-monarch.png" },
  // near the orchid pot (bottom-right)
  { left: "70%", top: "64%", size: 30, dur: 31, delay: 5, src: "/butterfly-morpho.png" },
  // upper-left airspace
  { left: "12%", top: "20%", size: 28, dur: 29, delay: 11, src: "/butterfly-monarch.png" },
  // right-middle airspace
  { left: "83%", top: "42%", size: 34, dur: 27, delay: 16, src: "/butterfly-morpho.png" },
];

/**
 * Butterflies — delicate photorealistic butterflies wandering the hero on
 * gentle curved paths with fluttering wings. Small, blurred, ambient.
 */
export function Butterflies() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          data-butterfly
          data-dur={b.dur}
          data-delay={b.delay}
          className="absolute opacity-0"
          style={{ left: b.left, top: b.top, width: b.size }}
        >
          <div data-flutter className="blur-[0.5px]">
            <Image
              src={b.src}
              alt=""
              width={160}
              height={100}
              className="h-auto w-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
