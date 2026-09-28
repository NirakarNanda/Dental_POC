import type { WorkingHours } from "./settings";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Build the bookable slot list from working hours, skipping the lunch break. */
export function generateSlots(wh: WorkingHours): string[] {
  const open = toMinutes(wh.open);
  const close = toMinutes(wh.close);
  const lunchStart = toMinutes(wh.lunchStart);
  const lunchEnd = toMinutes(wh.lunchEnd);
  const slots: string[] = [];
  for (let t = open; t + wh.slotMinutes <= close; t += wh.slotMinutes) {
    if (t >= lunchStart && t < lunchEnd) continue;
    slots.push(toHHMM(t));
  }
  return slots;
}

/** 0 = Sunday … 6 = Saturday for a yyyy-mm-dd date. */
export function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function isOffDay(dateStr: string, offDays: number[]): boolean {
  return offDays.includes(weekdayOf(dateStr));
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function dayName(dateStr: string): string {
  return DAY_NAMES[weekdayOf(dateStr)];
}

/** "14:30" -> "2:30 PM" for human-readable messages. */
export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "2026-09-28" -> "Mon, 28 Sep 2026". */
export function formatDateLong(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Shift a yyyy-mm-dd date by n days, returning yyyy-mm-dd. */
export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

/** "2026-09-29" -> "Tue, 29 Sep". */
export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
