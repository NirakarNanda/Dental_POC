"use client";

/**
 * FloraStrip — a row of hand-drawn wildflowers, grasses and buds along the
 * bottom edge of the landing hero. Two depth rows (soft-focus back, sharp
 * front). Each stem carries the `flora-sway` class; the page's GSAP timeline
 * rotates them ±2–4° on staggered 3–6s yoyo loops for a continuous wind feel.
 * Colors come from CSS vars (--flora-*) so dark mode deepens them.
 */

type PlantKind = "daisy" | "bud" | "grass" | "clover" | "seedhead";

function Daisy({ h = 120 }: { h?: number }) {
  const petals = Array.from({ length: 9 });
  return (
    <g className="flora-sway">
      <path
        d={`M0,0 C 6,${-h * 0.3} -6,${-h * 0.6} 2,${-h}`}
        fill="none"
        stroke="var(--flora-stem)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M1,${-h * 0.45} q 26,-8 40,-26 q -28,-2 -40,26`}
        fill="var(--flora-leaf)"
      />
      <path
        d={`M0,${-h * 0.62} q -24,-10 -34,-30 q 26,0 34,30`}
        fill="var(--flora-leaf)"
      />
      <g transform={`translate(2, ${-h})`}>
        {petals.map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-13"
            rx="6.5"
            ry="14"
            fill="var(--flora-petal)"
            opacity="0.95"
            transform={`rotate(${i * 40})`}
          />
        ))}
        <circle r="8" fill="var(--flora-center)" />
      </g>
    </g>
  );
}

function Bud({ h = 95 }: { h?: number }) {
  return (
    <g className="flora-sway">
      <path
        d={`M0,0 C -8,${-h * 0.35} 8,${-h * 0.65} 0,${-h}`}
        fill="none"
        stroke="var(--flora-stem)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d={`M0,${-h * 0.5} q 22,-6 32,-24 q -24,-4 -32,24`}
        fill="var(--flora-leaf)"
      />
      <ellipse cx="0" cy={-h - 6} rx="9" ry="12" fill="var(--flora-petal)" />
      <path
        d={`M-8,${-h + 2} q 8,10 16,0 l -2,14 q -6,4 -12,0 z`}
        fill="var(--flora-leaf)"
      />
    </g>
  );
}

function Grass({ h = 110, blades = 6 }: { h?: number; blades?: number }) {
  return (
    <g className="flora-sway">
      {Array.from({ length: blades }).map((_, i) => {
        const spread = (i - (blades - 1) / 2) * 14;
        const bh = h * (0.7 + ((i * 37) % 30) / 100);
        return (
          <path
            key={i}
            d={`M0,0 Q ${spread * 0.4},${-bh * 0.6} ${spread},${-bh}`}
            fill="none"
            stroke="var(--flora-grass)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function Clover({ h = 55 }: { h?: number }) {
  return (
    <g className="flora-sway">
      <path
        d={`M0,0 C 4,${-h * 0.5} -2,${-h * 0.7} 0,${-h}`}
        fill="none"
        stroke="var(--flora-stem)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g transform={`translate(0, ${-h})`}>
        <circle cx="-11" cy="-4" r="11" fill="var(--flora-leaf)" />
        <circle cx="11" cy="-4" r="11" fill="var(--flora-leaf)" />
        <circle cx="0" cy="-14" r="11" fill="var(--flora-leaf)" />
      </g>
    </g>
  );
}

function SeedHead({ h = 135 }: { h?: number }) {
  return (
    <g className="flora-sway">
      <path
        d={`M0,0 C 5,${-h * 0.4} -5,${-h * 0.7} 3,${-h}`}
        fill="none"
        stroke="var(--flora-stem)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const y = -h * (0.72 + t * 0.28);
        const x = 3 + Math.sin(t * 5) * 4;
        return (
          <ellipse
            key={i}
            cx={x + (i % 2 === 0 ? 7 : -7)}
            cy={y}
            rx="4.5"
            ry="8"
            fill="var(--flora-petal)"
            opacity="0.9"
            transform={`rotate(${i % 2 === 0 ? 24 : -24} ${x} ${y})`}
          />
        );
      })}
    </g>
  );
}

const PLANTS: Record<PlantKind, (p: { h?: number }) => React.JSX.Element> = {
  daisy: Daisy,
  bud: Bud,
  grass: Grass,
  clover: Clover,
  seedhead: SeedHead,
};

interface Placement {
  x: number;
  s: number;
  kind: PlantKind;
  h?: number;
}

const BACK: Placement[] = [
  { x: 40, s: 1.5, kind: "grass", h: 120 },
  { x: 210, s: 1.3, kind: "daisy", h: 130 },
  { x: 400, s: 1.6, kind: "seedhead", h: 140 },
  { x: 620, s: 1.25, kind: "grass", h: 130 },
  { x: 830, s: 1.5, kind: "daisy", h: 120 },
  { x: 1040, s: 1.35, kind: "bud", h: 110 },
  { x: 1240, s: 1.6, kind: "grass", h: 125 },
  { x: 1400, s: 1.3, kind: "seedhead", h: 135 },
];

const FRONT: Placement[] = [
  { x: 10, s: 1.0, kind: "daisy", h: 115 },
  { x: 130, s: 0.85, kind: "clover", h: 55 },
  { x: 250, s: 1.1, kind: "grass", h: 100 },
  { x: 380, s: 0.95, kind: "bud", h: 95 },
  { x: 540, s: 1.15, kind: "daisy", h: 125 },
  { x: 700, s: 0.9, kind: "grass", h: 90 },
  { x: 850, s: 1.05, kind: "seedhead", h: 130 },
  { x: 1000, s: 0.9, kind: "clover", h: 60 },
  { x: 1130, s: 1.1, kind: "bud", h: 100 },
  { x: 1280, s: 1.0, kind: "daisy", h: 118 },
  { x: 1420, s: 0.95, kind: "grass", h: 105 },
];

export default function FloraStrip() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 overflow-hidden sm:h-44"
    >
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 h-full w-full"
      >
        <defs>
          <filter id="floraBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
        </defs>
        <g filter="url(#floraBlur)" opacity="0.6">
          {BACK.map((p, i) => {
            const C = PLANTS[p.kind];
            return (
              <g key={`b${i}`} transform={`translate(${p.x}, 202) scale(${p.s})`}>
                <C h={p.h} />
              </g>
            );
          })}
        </g>
        <g>
          {FRONT.map((p, i) => {
            const C = PLANTS[p.kind];
            return (
              <g key={`f${i}`} transform={`translate(${p.x}, 202) scale(${p.s})`}>
                <C h={p.h} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
