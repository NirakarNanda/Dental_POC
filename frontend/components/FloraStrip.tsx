"use client";

import Image from "next/image";

/**
 * FloraStrip — photorealistic botanical layers along the bottom edge of the
 * landing hero. Two depth rows (soft-focus meadow bokeh behind, sharp daisies
 * and grasses in front). Each layer carries the `flora-layer` class; the
 * page's GSAP timeline sways them independently for parallax wind. True-alpha
 * PNGs; the top edge of each photo melts into the background via a CSS mask.
 */
export default function FloraStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] overflow-hidden"
    >
      {/* back layer: soft-focus meadow bokeh */}
      <div className="flora-layer absolute inset-x-0 bottom-0 h-32 sm:h-40 dark:brightness-[0.72] dark:saturate-90">
        <Image
          src="/flora-back.png"
          alt=""
          fill
          sizes="100vw"
          className="flora-img object-cover object-bottom opacity-90 blur-[1.5px]"
        />
      </div>
      {/* front layer: sharp daisies, seed heads and grasses */}
      <div className="flora-layer absolute inset-x-0 bottom-0 h-44 sm:h-60 dark:brightness-[0.72] dark:saturate-90">
        <Image
          src="/flora-front.png"
          alt=""
          fill
          sizes="100vw"
          className="flora-img object-cover object-bottom"
        />
      </div>
      {/* spacer gives the strip its height */}
      <div className="h-44 sm:h-60" />
    </div>
  );
}
