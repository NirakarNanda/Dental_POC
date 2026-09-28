interface LogoProps {
  size?: number;
  className?: string;
}

/** PearlSmile mark: white tooth inside a mint gradient circle. */
export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="PearlSmile Dental Studio logo"
    >
      <defs>
        <linearGradient id="pearlsmile-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="55%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#pearlsmile-g)" />
      <circle cx="24" cy="24" r="22" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* tooth */}
      <path
        d="M17.5 12c-3.4 0-5.5 2.8-5.5 6.4 0 3.9 1.7 5.2 2.8 8.9.9 2.8 1.5 5.7 3.2 5.7 1.8 0 1.1-5.2 2.3-7.4.7-1.3 3.7-1.3 4.4 0 1.2 2.2.5 7.4 2.3 7.4 1.7 0 2.3-2.9 3.2-5.7 1.1-3.7 2.8-5 2.8-8.9 0-3.6-2.1-6.4-5.5-6.4-2.2 0-4 1.1-6 1.1s-3.8-1.1-6-1.1z"
        fill="#ffffff"
      />
      {/* sparkle */}
      <path
        d="M33.5 15.5c.6 1.4 1.1 2 2.5 2.6-1.4.6-1.9 1.2-2.5 2.6-.6-1.4-1.1-2-2.5-2.6 1.4-.6 1.9-1.2 2.5-2.6z"
        fill="#ffffff"
        opacity="0.9"
      />
    </svg>
  );
}

/** Standalone tooth glyph used for decorative / section art. */
export function ToothGlyph({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M17.5 12c-3.4 0-5.5 2.8-5.5 6.4 0 3.9 1.7 5.2 2.8 8.9.9 2.8 1.5 5.7 3.2 5.7 1.8 0 1.1-5.2 2.3-7.4.7-1.3 3.7-1.3 4.4 0 1.2 2.2.5 7.4 2.3 7.4 1.7 0 2.3-2.9 3.2-5.7 1.1-3.7 2.8-5 2.8-8.9 0-3.6-2.1-6.4-5.5-6.4-2.2 0-4 1.1-6 1.1s-3.8-1.1-6-1.1z"
        fill="currentColor"
      />
    </svg>
  );
}
