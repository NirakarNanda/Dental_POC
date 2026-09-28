import type { PatientStatus } from "@/lib/api";

const STYLES: Record<PatientStatus | "all", string> = {
  all: "bg-slate-100 text-slate-600 dark:bg-abyss-800 dark:text-mint-100/70",
  active: "bg-mint-100 text-mint-800 dark:bg-mint-900/60 dark:text-mint-200",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  "follow-up": "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
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
