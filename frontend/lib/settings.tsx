"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface TreatmentPrice {
  name: string;
  fee: number;
}

export interface WorkingHours {
  /** "HH:MM" 24h */
  open: string;
  /** "HH:MM" 24h */
  close: string;
  slotMinutes: 15 | 30 | 45 | 60;
  /** "HH:MM" 24h — lunch break start (no slots) */
  lunchStart: string;
  /** "HH:MM" 24h — lunch break end */
  lunchEnd: string;
  /** 0 = Sunday … 6 = Saturday */
  offDays: number[];
}

export interface ClinicSettings {
  /** Pre-filled fee (₹) when booking an appointment. */
  defaultFee: number;
  treatmentPrices: TreatmentPrice[];
  workingHours: WorkingHours;
}

const STORAGE_KEY = "pearlsmile-settings";

export const DEFAULT_TREATMENT_PRICES: TreatmentPrice[] = [
  { name: "General Checkup", fee: 500 },
  { name: "Teeth Cleaning", fee: 800 },
  { name: "Dental Fillings", fee: 1500 },
  { name: "Tooth Extraction", fee: 2000 },
  { name: "Root Canal", fee: 6000 },
  { name: "Crowns & Bridges", fee: 8000 },
  { name: "Teeth Whitening", fee: 5000 },
  { name: "Braces & Orthodontics", fee: 1000 },
  { name: "Dental Implants", fee: 25000 },
  { name: "Pediatric Dentistry", fee: 500 },
];

export const DEFAULT_WORKING_HOURS: WorkingHours = {
  open: "09:30",
  close: "18:00",
  slotMinutes: 30,
  lunchStart: "13:00",
  lunchEnd: "14:00",
  offDays: [0],
};

const DEFAULTS: ClinicSettings = {
  defaultFee: 500,
  treatmentPrices: DEFAULT_TREATMENT_PRICES,
  workingHours: DEFAULT_WORKING_HOURS,
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const SLOT_OPTIONS = [15, 30, 45, 60] as const;

function sanitizeWorkingHours(raw: unknown): WorkingHours {
  const d = DEFAULT_WORKING_HOURS;
  if (typeof raw !== "object" || raw === null) return d;
  const r = raw as Record<string, unknown>;
  const pick = (k: string, fb: string) =>
    typeof r[k] === "string" && TIME_RE.test(r[k] as string) ? (r[k] as string) : fb;
  const slot = SLOT_OPTIONS.includes(r.slotMinutes as (typeof SLOT_OPTIONS)[number])
    ? (r.slotMinutes as WorkingHours["slotMinutes"])
    : d.slotMinutes;
  const offDays = Array.isArray(r.offDays)
    ? [...new Set(r.offDays.filter((x) => Number.isInteger(x) && (x as number) >= 0 && (x as number) <= 6))]
    : d.offDays;
  const open = pick("open", d.open);
  const close = pick("close", d.close);
  return {
    open: open < close ? open : d.open,
    close: open < close ? close : d.close,
    slotMinutes: slot,
    lunchStart: pick("lunchStart", d.lunchStart),
    lunchEnd: pick("lunchEnd", d.lunchEnd),
    offDays,
  };
}

interface SettingsState extends ClinicSettings {
  loaded: boolean;
  update: (patch: Partial<ClinicSettings>) => void;
}

const SettingsCtx = createContext<SettingsState>({
  ...DEFAULTS,
  loaded: false,
  update: () => {},
});

export const useSettings = () => useContext(SettingsCtx);

function readStored(): ClinicSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<ClinicSettings>;
    const feeByName = new Map<string, number>();
    if (Array.isArray(parsed.treatmentPrices)) {
      for (const t of parsed.treatmentPrices) {
        if (
          typeof t?.name === "string" &&
          typeof t?.fee === "number" &&
          Number.isFinite(t.fee) &&
          t.fee >= 0
        ) {
          feeByName.set(t.name, Math.round(t.fee));
        }
      }
    }
    return {
      defaultFee:
        typeof parsed.defaultFee === "number" &&
        Number.isFinite(parsed.defaultFee) &&
        parsed.defaultFee >= 0
          ? Math.round(parsed.defaultFee)
          : DEFAULTS.defaultFee,
      // Merge over the built-in list so new treatments appear automatically.
      treatmentPrices: DEFAULT_TREATMENT_PRICES.map((t) => ({
        name: t.name,
        fee: feeByName.get(t.name) ?? t.fee,
      })),
      workingHours: sanitizeWorkingHours(parsed.workingHours),
    };
  } catch {
    return DEFAULTS;
  }
}

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<ClinicSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(readStored());
    setLoaded(true);
  }, []);

  const update = useCallback((patch: Partial<ClinicSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — settings just won't persist */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ...settings, loaded, update }),
    [settings, loaded, update],
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}
