"use client";

/**
 * AmbientBackground — rich, calm color fields that sit behind the app so
 * backdrop-blur glass surfaces have something luminous to refract.
 * Light: sage/mint/ivory radial washes. Dark: deep teal-navy glow fields.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* light-mode washes */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-mint-200/50 blur-3xl" />
        <div className="absolute right-[-8rem] top-[18%] h-[32rem] w-[32rem] rounded-full bg-aqua-200/60 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[28%] h-[30rem] w-[30rem] rounded-full bg-[#e9e2d2]/70 blur-3xl" />
        <div className="absolute left-[6%] top-[58%] h-64 w-64 rounded-full bg-mint-100/70 blur-3xl" />
        <div className="absolute right-[22%] top-[8%] h-52 w-52 rounded-full bg-white/70 blur-3xl" />
      </div>
      {/* dark-mode glow fields */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-32 left-[12%] h-[30rem] w-[30rem] rounded-full bg-mint-500/[0.09] blur-3xl" />
        <div className="absolute right-[-6rem] top-[28%] h-[28rem] w-[28rem] rounded-full bg-mint-400/[0.07] blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[24%] h-[26rem] w-[26rem] rounded-full bg-teal-300/[0.06] blur-3xl" />
      </div>
      {/* film grain to keep gradients from banding */}
      <div className="hero-grain absolute inset-0 opacity-[0.05] dark:opacity-[0.08]" />
    </div>
  );
}
