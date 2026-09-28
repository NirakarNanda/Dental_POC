"use client";

import Image from "next/image";

/**
 * FloraStrip — dense meadow photographs along the bottom edge of the
 * landing hero. NO cutouts: two full rectangular photos blended into the
 * page with CSS masks (top + side fades), so there are no fringes or halos.
 * Each layer is 120% viewport width and carries the `flora-layer` class;
 * the page's GSAP timeline drifts them horizontally with irregular gust
 * timing for natural parallax wind.
 */
export default function FloraStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden"
    >
      {/* back layer: sunlit daisy meadow */}
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
      </div>
      {/* front layer: lush close-up meadow */}
      <div className="flora-layer absolute bottom-0 left-[-10vw] h-[32vh] w-[120vw] sm:h-[38vh]">
        <Image
          src="/meadow-front.jpg"
          alt=""
          fill
          sizes="120vw"
          className="flora-photo object-cover object-bottom dark:brightness-[0.62] dark:saturate-[0.85]"
        />
        <div className="absolute inset-0 hidden dark:block dark:bg-[#0d3b38]/35" />
      </div>
      {/* spacer gives the strip its height */}
      <div className="h-[32vh] sm:h-[38vh]" />
    </div>
  );
}
