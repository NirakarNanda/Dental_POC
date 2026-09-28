"use client";

/**
 * ToothBuddy — a cozy little animated tooth that keeps the doctor company
 * on the login screen. Pure SVG + CSS: gentle bob, blinking eyes, drifting
 * sparkles. Respects prefers-reduced-motion (see globals.css).
 */
export default function ToothBuddy() {
  return (
    <div className="tooth-buddy relative h-24 w-24" aria-hidden="true">
      {/* sparkles */}
      <svg
        viewBox="0 0 24 24"
        className="absolute -left-3 top-1 h-4 w-4 text-mint-500 motion-safe:animate-[sparkle-rise_5s_ease-in-out_infinite] dark:text-mint-300"
        fill="currentColor"
      >
        <path d="M12 2c.7 4.8 3.2 7.3 8 8-4.8.7-7.3 3.2-8 8-.7-4.8-3.2-7.3-8-8 4.8-.7 7.3-3.2 8-8z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute -right-2 top-4 h-3 w-3 text-amber-400 motion-safe:animate-[sparkle-rise_6.5s_ease-in-out_1.2s_infinite] dark:text-amber-300"
        fill="currentColor"
      >
        <path d="M12 2c.7 4.8 3.2 7.3 8 8-4.8.7-7.3 3.2-8 8-.7-4.8-3.2-7.3-8-8 4.8-.7 7.3-3.2 8-8z" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute -left-1 bottom-2 h-2.5 w-2.5 text-mint-400 motion-safe:animate-[sparkle-rise_7.5s_ease-in-out_2.4s_infinite] dark:text-mint-200"
        fill="currentColor"
      >
        <path d="M12 2c.7 4.8 3.2 7.3 8 8-4.8.7-7.3 3.2-8 8-.7-4.8-3.2-7.3-8-8 4.8-.7 7.3-3.2 8-8z" />
      </svg>

      {/* the tooth */}
      <svg
        viewBox="0 0 100 104"
        className="h-full w-full motion-safe:animate-[tooth-bob_4.5s_ease-in-out_infinite]"
      >
        <defs>
          <radialGradient id="toothBody" cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fdf9f0" />
            <stop offset="100%" stopColor="#f3e9d6" />
          </radialGradient>
        </defs>
        {/* soft ground shadow */}
        <ellipse cx="50" cy="98" rx="26" ry="4.5" fill="#0e2a28" opacity="0.10" />
        {/* body */}
        <path
          d="M50 6c19 0 33 11.5 33 30 0 11.5-5.5 19-9.5 28.5-3 7.2-5.8 17.5-11.5 17.5-4.8 0-6.4-7.5-8.2-13.2-1-3.2-5.6-3.2-6.6 0-1.8 5.7-3.4 13.2-8.2 13.2-5.7 0-8.5-10.3-11.5-17.5C23.5 55 18 47.5 18 36 18 17.5 31 6 50 6z"
          fill="url(#toothBody)"
          stroke="#e7d9bf"
          strokeWidth="1.5"
        />
        {/* glossy highlight */}
        <ellipse
          cx="38"
          cy="28"
          rx="9"
          ry="14"
          fill="#ffffff"
          opacity="0.75"
          transform="rotate(-18 38 28)"
        />
        {/* blush */}
        <ellipse cx="36" cy="52" rx="5.5" ry="3.6" fill="#f6b8a0" opacity="0.55" />
        <ellipse cx="64" cy="52" rx="5.5" ry="3.6" fill="#f6b8a0" opacity="0.55" />
        {/* eyes (blink) */}
        <g className="tooth-eye motion-safe:animate-[tooth-blink_5.2s_ease-in-out_infinite]">
          <ellipse cx="42" cy="44" rx="3.4" ry="4.4" fill="#143230" />
          <circle cx="43.2" cy="42.4" r="1.2" fill="#ffffff" opacity="0.9" />
        </g>
        <g
          className="tooth-eye motion-safe:animate-[tooth-blink_5.2s_ease-in-out_infinite]"
          style={{ animationDelay: "0.02s" }}
        >
          <ellipse cx="58" cy="44" rx="3.4" ry="4.4" fill="#143230" />
          <circle cx="59.2" cy="42.4" r="1.2" fill="#ffffff" opacity="0.9" />
        </g>
        {/* smile */}
        <path
          d="M43 58q7 6.5 14 0"
          fill="none"
          stroke="#143230"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
