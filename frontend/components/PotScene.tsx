"use client";

import Image from "next/image";

/**
 * PotScene — the purple orchid as a DISCRETE element anchored bottom-right
 * of the landing hero (not a full-width strip): a portrait crop holding the
 * entire plant — blooms, leaves, pot — with its top and left edges feathered
 * into the background via CSS masks, so no hard rectangle edges. The
 * still-life stays essentially still — GSAP gives it only a
 * barely-perceptible slow zoom for life.
 */
export default function PotScene() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 z-[1] overflow-hidden"
    >
      <div
        data-pot
        className="pot-zoom relative h-[300px] w-[305px] sm:h-[46vh] sm:w-auto sm:aspect-[1260/1240] lg:h-[52vh]"
      >
        <Image
          src="/orchid-plant.jpg"
          alt=""
          fill
          sizes="(max-width: 640px) 305px, 40vw"
          className="pot-plant object-cover object-bottom dark:brightness-[0.62] dark:saturate-[0.85]"
        />
        {/* cool tint so the photo melts into the dark theme */}
        <div className="absolute inset-0 hidden dark:block dark:bg-[#0d3b38]/35" />
      </div>
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
