"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PasswordField from "@/components/PasswordField";
import { useToast } from "@/components/Toast";
import { api, type Appointment, type Patient } from "@/lib/api";
import { downloadCSV, toCSV } from "@/lib/csv";
import { fraunces } from "@/lib/fonts";
import { useRequireAuth } from "@/lib/auth";
import { useSettings } from "@/lib/settings";
import { useTheme, type ThemeMode } from "@/components/theme/ThemeProvider";
import type { TreatmentPrice, WorkingHours } from "@/lib/settings";

const inputCls =
  "w-full rounded-xl border border-ink/10 bg-white/70 px-4 py-3 text-[15px] text-ink placeholder:text-ink/30 outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#edf7f5] dark:placeholder:text-white/25";
const labelCls =
  "mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/50 dark:text-white/45";

function Section({
  kicker,
  title,
  blurb,
  children,
}: {
  kicker: string;
  title: string;
  blurb?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-deep rounded-[1.75rem] p-8 sm:p-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45 dark:text-white/40">
        {kicker}
      </p>
      <h2 className={`${fraunces.className} mt-2 text-[1.9rem] font-light leading-tight tracking-tight`}>
        {title}
      </h2>
      {blurb && (
        <p className="mt-2 text-sm leading-relaxed text-ink/55 dark:text-white/50">{blurb}</p>
      )}
      <div className="mt-7">{children}</div>
    </section>
  );
}

function TreatmentPrices() {
  const { treatmentPrices, update } = useSettings();
  const toast = useToast();
  const [rows, setRows] = useState<TreatmentPrice[]>(treatmentPrices);

  useEffect(() => {
    setRows(treatmentPrices);
  }, [treatmentPrices]);

  const setFeeFor = (name: string, feeStr: string) => {
    const n = parseInt(feeStr.replace(/[^0-9]/g, ""), 10);
    setRows((prev) =>
      prev.map((t) =>
        t.name === name ? { ...t, fee: Number.isNaN(n) ? 0 : n } : t,
      ),
    );
  };

  const save = () => {
    update({ treatmentPrices: rows });
    toast("Price list saved — fees now auto-fill when booking.", "success");
  };

  return (
    <Section
      kicker="Price list"
      title="Treatment prices"
      blurb="Your standard fee for each treatment. When you book, picking a treatment fills its fee automatically — you can still adjust it per appointment."
    >
      <div className="overflow-hidden rounded-2xl border border-ink/10 dark:border-white/10">
        {rows.map((t, i) => (
          <div
            key={t.name}
            className={`flex items-center gap-4 px-4 py-3 sm:px-5 ${
              i % 2 === 1 ? "bg-ink/[0.025] dark:bg-white/[0.03]" : ""
            }`}
          >
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{t.name}</span>
            <div className="flex w-32 shrink-0 items-center gap-1.5">
              <span className="text-sm text-ink/50 dark:text-white/45">₹</span>
              <input
                value={String(t.fee)}
                onChange={(e) => setFeeFor(t.name, e.target.value)}
                inputMode="numeric"
                aria-label={`Fee for ${t.name}`}
                className="w-full rounded-lg border border-ink/10 bg-white/70 px-2.5 py-1.5 text-right text-sm font-semibold outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25 dark:border-white/10 dark:bg-white/[0.06]"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={save}
        className="mt-5 rounded-full bg-ink px-7 py-3 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:bg-mint-300 dark:text-abyss-950"
      >
        Save price list
      </button>
    </Section>
  );
}

const DAY_CHIPS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_NAMES_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function WorkingHoursSection() {
  const { workingHours, update } = useSettings();
  const toast = useToast();
  const [wh, setWh] = useState<WorkingHours>(workingHours);

  useEffect(() => {
    setWh(workingHours);
  }, [workingHours]);

  const set = <K extends keyof WorkingHours>(k: K, v: WorkingHours[K]) =>
    setWh((prev) => ({ ...prev, [k]: v }));

  const toggleDay = (d: number) =>
    set(
      "offDays",
      wh.offDays.includes(d)
        ? wh.offDays.filter((x) => x !== d)
        : [...wh.offDays, d].sort(),
    );

  const save = () => {
    if (wh.open >= wh.close) {
      toast("Opening time must be before closing time.", "error");
      return;
    }
    if (wh.lunchStart >= wh.lunchEnd) {
      toast("Lunch break start must be before its end.", "error");
      return;
    }
    update({ workingHours: wh });
    toast("Working hours saved — booking slots update right away.", "success");
  };

  const timeInputCls = `${inputCls} dark:[color-scheme:dark]`;

  return (
    <Section
      kicker="Schedule"
      title="Working hours"
      blurb="Define the clinic day. The booking dialog builds its time slots from this — and blocks out your lunch break and weekly off days automatically."
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className={labelCls} htmlFor="wh-open">Opens</label>
          <input
            id="wh-open"
            type="time"
            value={wh.open}
            onChange={(e) => set("open", e.target.value)}
            className={timeInputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="wh-close">Closes</label>
          <input
            id="wh-close"
            type="time"
            value={wh.close}
            onChange={(e) => set("close", e.target.value)}
            className={timeInputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="wh-slot">Slot length</label>
          <select
            id="wh-slot"
            value={wh.slotMinutes}
            onChange={(e) => set("slotMinutes", Number(e.target.value) as WorkingHours["slotMinutes"])}
            className={`${inputCls} cursor-pointer appearance-none dark:[color-scheme:dark]`}
          >
            {[15, 30, 45, 60].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className={labelCls}>Preview</span>
          <p className="rounded-xl bg-ink/[0.04] px-3 py-2.5 text-[13px] font-medium dark:bg-white/[0.05]">
            {wh.open} – {wh.close}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="wh-lunch-start">Lunch break from</label>
          <input
            id="wh-lunch-start"
            type="time"
            value={wh.lunchStart}
            onChange={(e) => set("lunchStart", e.target.value)}
            className={timeInputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="wh-lunch-end">Lunch break to</label>
          <input
            id="wh-lunch-end"
            type="time"
            value={wh.lunchEnd}
            onChange={(e) => set("lunchEnd", e.target.value)}
            className={timeInputCls}
          />
        </div>
      </div>

      <div className="mt-5">
        <span className={labelCls}>Weekly off days</span>
        <div className="mt-1 flex gap-2">
          {DAY_CHIPS.map((label, d) => {
            const off = wh.offDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                aria-pressed={off}
                title={DAY_NAMES_FULL[d]}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  off
                    ? "bg-ink text-ivory shadow-soft dark:bg-mint-300 dark:text-abyss-950"
                    : "border border-ink/15 bg-white/50 text-ink/60 hover:border-ink/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/60 dark:hover:border-white/40"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] text-ink/45 dark:text-white/40">
          Booking is blocked on off days — the dialog will say the clinic is closed.
        </p>
      </div>

      <button
        type="button"
        onClick={save}
        className="mt-6 rounded-full bg-ink px-7 py-3 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:bg-mint-300 dark:text-abyss-950"
      >
        Save working hours
      </button>
    </Section>
  );
}

function AppointmentDefaults() {
  const { defaultFee, update } = useSettings();
  const toast = useToast();
  const [fee, setFee] = useState(String(defaultFee));

  useEffect(() => {
    setFee(String(defaultFee));
  }, [defaultFee]);

  const save = () => {
    const n = parseInt(fee, 10);
    if (!Number.isFinite(n) || n < 0) {
      toast("Enter a valid fee — 0 or more.", "error");
      return;
    }
    update({ defaultFee: n });
    toast(`Default fee set to ₹${n} — pre-filled on every new booking.`, "success");
  };

  return (
    <Section
      kicker="Appointments"
      title="Booking defaults"
      blurb="Fallback fee used when a treatment isn't on your price list. Treatments with a set price always win."
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-44">
          <label className={labelCls} htmlFor="default-fee">Default fee (₹)</label>
          <input
            id="default-fee"
            className={inputCls}
            value={fee}
            onChange={(e) => setFee(e.target.value.replace(/[^0-9]/g, ""))}
            inputMode="numeric"
            placeholder="500"
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="rounded-full bg-ink px-7 py-3 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift dark:bg-mint-300 dark:text-abyss-950"
        >
          Save
        </button>
      </div>
    </Section>
  );
}

function Appearance() {
  const { mode, setMode } = useTheme();
  const toast = useToast();
  const options: { value: ThemeMode; label: string; hint: string }[] = [
    { value: "light", label: "Light", hint: "Bright clinic look" },
    { value: "dark", label: "Dark", hint: "Easy on the eyes" },
    { value: "system", label: "System", hint: "Follow this device" },
  ];
  return (
    <Section
      kicker="Appearance"
      title="Theme"
      blurb="Pick how the app looks. System follows your device's light/dark setting automatically."
    >
      <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
        {options.map((o) => {
          const active = mode === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setMode(o.value);
                toast(`Theme set to ${o.label.toLowerCase()}.`, "success");
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                active
                  ? "border-ink/70 bg-ink/[0.04] shadow-soft dark:border-mint-300/60 dark:bg-mint-300/10"
                  : "border-ink/10 bg-white/40 hover:border-ink/25 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/25"
              }`}
            >
              <span className="block text-[15px] font-semibold">{o.label}</span>
              <span className="mt-1 block text-[12px] text-ink/50 dark:text-white/45">{o.hint}</span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function dateStamp(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}${m}${day}`;
}

const PATIENT_COLS = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "treatment", header: "Treatment" },
  { key: "status", header: "Status" },
  { key: "nextVisit", header: "Next visit" },
  { key: "notes", header: "Notes" },
  { key: "createdAt", header: "Added on" },
];

const APPT_COLS = [
  { key: "date", header: "Date" },
  { key: "time", header: "Time" },
  { key: "patientName", header: "Patient" },
  { key: "treatment", header: "Treatment" },
  { key: "fee", header: "Fee (₹)" },
  { key: "status", header: "Status" },
];

function DataExport() {
  const toast = useToast();
  const [busy, setBusy] = useState<"patients" | "appointments" | null>(null);

  const exportPatients = async () => {
    setBusy("patients");
    try {
      const { patients }: { patients: Patient[] } = await api.listPatients();
      downloadCSV(
        `pearlsmile-patients-${dateStamp()}.csv`,
        toCSV(PATIENT_COLS, patients as unknown as Record<string, unknown>[]),
      );
      toast(`Exported ${patients.length} patient${patients.length === 1 ? "" : "s"}.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Export failed — please try again.", "error");
    } finally {
      setBusy(null);
    }
  };

  const exportAppointments = async () => {
    setBusy("appointments");
    try {
      const { appointments }: { appointments: Appointment[] } = await api.listAppointments();
      downloadCSV(
        `pearlsmile-appointments-${dateStamp()}.csv`,
        toCSV(APPT_COLS, appointments as unknown as Record<string, unknown>[]),
      );
      toast(
        `Exported ${appointments.length} appointment${appointments.length === 1 ? "" : "s"}.`,
        "success",
      );
    } catch (err) {
      toast(err instanceof Error ? err.message : "Export failed — please try again.", "error");
    } finally {
      setBusy(null);
    }
  };

  const btnCls =
    "flex flex-1 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-white/50 px-5 py-4 text-[15px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-soft disabled:translate-y-0 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25";

  return (
    <Section
      kicker="Data"
      title="Export your records"
      blurb="Download everything as a spreadsheet-friendly CSV — handy for accounts, audits, or a personal backup. Exports include all records, not just today's."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={exportPatients} disabled={busy !== null} className={btnCls}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
          </svg>
          {busy === "patients" ? "Exporting…" : "Patients CSV"}
        </button>
        <button type="button" onClick={exportAppointments} disabled={busy !== null} className={btnCls}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
          </svg>
          {busy === "appointments" ? "Exporting…" : "Appointments CSV"}
        </button>
      </div>
    </Section>
  );
}

function ChangePassword() {
  const { user } = useRequireAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match — check and try again.");
      return;
    }
    if (next === current) {
      setError("New password must be different from the current one.");
      return;
    }
    setBusy(true);
    try {
      await api.changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess("Password updated. Use it next time you sign in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update the password. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      kicker="Security"
      title="Change password"
      blurb={
        `Signed in as ${user?.name ?? ""} (${user?.email ?? ""}). Pick something memorable — at least 8 characters.`
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <PasswordField
          id="current-password"
          label="Current password"
          value={current}
          onChange={setCurrent}
          autoComplete="current-password"
        />
        <PasswordField
          id="new-password"
          label="New password"
          value={next}
          onChange={setNext}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />
        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />

        {error && (
          <div
            className="rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded-xl border border-emerald-900/15 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-200"
            role="status"
          >
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-ink py-3.5 text-[15px] font-semibold tracking-wide text-ivory shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift disabled:translate-y-0 disabled:opacity-60 dark:bg-mint-300 dark:text-abyss-950"
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </form>
    </Section>
  );
}

const SECTIONS = [
  { value: "prices", label: "Treatment prices", hint: "Set the fee for each treatment — auto-filled when you book." },
  { value: "hours", label: "Working hours", hint: "Open hours, slot length, lunch break, and weekly off days." },
  { value: "appointments", label: "Booking defaults", hint: "Fallback fee used when a treatment has no set price." },
  { value: "appearance", label: "Appearance", hint: "Light, dark, or follow this device automatically." },
  { value: "data", label: "Data export", hint: "Download patients and appointments as CSV files." },
  { value: "security", label: "Security", hint: "Change your sign-in password." },
];

function SettingsInner() {
  const [section, setSection] = useState(SECTIONS[0].value);
  const active = SECTIONS.find((s) => s.value === section) ?? SECTIONS[0];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <label className={labelCls} htmlFor="settings-section">
          Settings section
        </label>
        <div className="relative">
          <select
            id="settings-section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className={`${inputCls} cursor-pointer appearance-none pr-11 font-medium dark:[color-scheme:dark]`}
          >
            {SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-white/40"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        <p className="mt-2 text-[13px] text-ink/50 dark:text-white/45">{active.hint}</p>
      </div>

      <div key={section} className="settings-enter">
        {section === "prices" && <TreatmentPrices />}
        {section === "hours" && <WorkingHoursSection />}
        {section === "appointments" && <AppointmentDefaults />}
        {section === "appearance" && <Appearance />}
        {section === "data" && <DataExport />}
        {section === "security" && <ChangePassword />}
      </div>

      <p className="mt-6 pb-2 text-center text-[12px] leading-relaxed text-ink/40 dark:text-white/35">
        Booking defaults are saved on this device. Password changes apply to your account everywhere.
      </p>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsInner />
    </AppShell>
  );
}
