import type { PatientStatus } from "@/lib/api";

/** Quiet, editorial status pills — status shown as a dot + muted tone. */
const STYLES: Record<PatientStatus | "all", string> = {
  all: "bg-ink/[0.06] text-ink/60 dark:bg-white/[0.08] dark:text-white/60",
  active: "bg-[#dcebe8] text-[#2f5d55] dark:bg-mint-900/50 dark:text-mint-200",
  completed: "bg-[#e9e2d6] text-[#6d5a3e] dark:bg-white/10 dark:text-white/65",
  "follow-up": "bg-[#f3e8c8] text-[#8a6d1f] dark:bg-amber-950/50 dark:text-amber-200",
};

export default function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
