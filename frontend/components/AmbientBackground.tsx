"use client";

/**
 * AmbientBackground — rich, calm color fields that sit behind the app so
 * backdrop-blur glass surfaces have something luminous to refract.
 * Light: sage/mint/peach/aqua radial washes over ivory.
 * Dark: teal/blue glow fields over deep navy.
 */
export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* light-mode washes */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute -top-36 -left-28 h-[32rem] w-[32rem] rounded-full bg-mint-300/60 blur-3xl" />
        <div className="absolute right-[-10rem] top-[12%] h-[36rem] w-[36rem] rounded-full bg-[#f7ddb8]/75 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[26%] h-[34rem] w-[34rem] rounded-full bg-[#dfe6c4]/70 blur-3xl" />
        <div className="absolute left-[4%] top-[52%] h-72 w-72 rounded-full bg-aqua-200/80 blur-3xl" />
        <div className="absolute right-[18%] top-[4%] h-60 w-60 rounded-full bg-white/80 blur-3xl" />
        <div className="absolute bottom-[8%] right-[38%] h-56 w-56 rounded-full bg-[#f3e3cf]/60 blur-3xl" />
      </div>
      {/* dark-mode glow fields */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute -top-36 left-[10%] h-[34rem] w-[34rem] rounded-full bg-mint-500/[0.14] blur-3xl" />
        <div className="absolute right-[-8rem] top-[24%] h-[32rem] w-[32rem] rounded-full bg-blue-400/[0.10] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[22%] h-[30rem] w-[30rem] rounded-full bg-teal-300/[0.10] blur-3xl" />
        <div className="absolute left-[38%] top-[46%] h-72 w-72 rounded-full bg-indigo-400/[0.08] blur-3xl" />
      </div>
      {/* film grain to keep gradients from banding */}
      <div className="hero-grain absolute inset-0 opacity-[0.05] dark:opacity-[0.08]" />
    </div>
  );
}
