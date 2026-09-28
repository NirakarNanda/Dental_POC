"use client";

import { useEffect, useMemo, useState } from "react";
import { fraunces } from "@/lib/fonts";
import { type NewAppointment, type Patient } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { dayName, generateSlots, isOffDay } from "@/lib/slots";

interface Props {
  open: boolean;
  patients: Patient[];
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (payload: NewAppointment) => void;
}

function localToday(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function BookAppointmentModal({ open, patients, saving, error, onClose, onSave }: Props) {
  const { defaultFee, treatmentPrices, workingHours } = useSettings();
  const [patientSearch, setPatientSearch] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState(localToday());
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState("");
  const [fee, setFee] = useState("");
  const [feeTouched, setFeeTouched] = useState(false);

  const priceByName = useMemo(
    () => new Map(treatmentPrices.map((t) => [t.name, t.fee])),
    [treatmentPrices],
  );
  const priceFor = (name: string) => priceByName.get(name.trim()) ?? defaultFee;
  const slots = useMemo(() => generateSlots(workingHours), [workingHours]);
  const closedDay = date ? isOffDay(date, workingHours.offDays) : false;

  useEffect(() => {
    if (open) {
      const first = treatmentPrices[0];
      setPatientSearch("");
      setPatientId("");
      setDate(localToday());
      setTime("");
      setTreatment(first?.name ?? "General Checkup");
      setFee(String(first?.fee ?? defaultFee));
      setFeeTouched(false);
    }
  }, [open, treatmentPrices, defaultFee]);

  const pickTreatment = (name: string) => {
    setTreatment(name);
    if (!feeTouched) setFee(String(priceFor(name)));
  };

  const pickDate = (d: string) => {
    setDate(d);
    if (d && isOffDay(d, workingHours.offDays)) setTime("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = patientSearch.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.treatment.toLowerCase().includes(q),
    );
  }, [patients, patientSearch]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date || !time) return;
    const feeNum = fee === "" ? defaultFee : parseInt(fee, 10);
    onSave({
      patientId,
      date,
      time,
      treatment: treatment.trim() || treatmentPrices[0]?.name || "General Checkup",
      fee: Number.isNaN(feeNum) ? defaultFee : Math.max(0, feeNum),
    });
  };

  const inputCls =
    "w-full rounded-xl border border-white/60 bg-white/55 px-3.5 py-2.5 text-sm text-ink backdrop-blur-md placeholder:text-ink/35 outline-none transition-all focus:border-ink/40 focus:bg-white/85 focus:ring-4 focus:ring-ink/5 dark:border-white/10 dark:bg-white/[0.06] dark:text-[#edf7f5] dark:placeholder:text-white/30 dark:focus:border-white/40 dark:focus:bg-white/[0.09] dark:focus:ring-white/5";
  const labelCls = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/50 dark:text-white/45";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm dark:bg-black/60 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book appointment"
    >
      <div
        className="animate-fade-up slim-scroll glass-deep max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/45 dark:text-white/40">
              Clinic schedule
            </p>
            <h2 className={`${fraunces.className} mt-1 text-[1.7rem] font-light tracking-tight`}>
              Book appointment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className={labelCls} htmlFor="ba-search">Patient *</label>
            <input
              id="ba-search"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              placeholder="Search patients…"
              className={inputCls}
            />
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
              className={`${inputCls} mt-2`}
              aria-label="Select patient"
            >
              <option value="">— Select a patient —</option>
              {filtered.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.phone}
                </option>
              ))}
            </select>
            {patients.length === 0 && (
              <p className="mt-1.5 text-xs text-ink/50 dark:text-white/45">
                No patients yet — add one first.
              </p>
            )}
          </div>

          <div>
            <label className={labelCls} htmlFor="ba-date">Date *</label>
            <input
              id="ba-date"
              type="date"
              required
              value={date}
              min={localToday()}
              onChange={(e) => pickDate(e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <span className={labelCls}>Time slot *</span>
            {closedDay ? (
              <p className="mt-1 rounded-xl border border-dashed border-ink/20 bg-ink/[0.03] px-4 py-3 text-[13px] text-ink/60 dark:border-white/15 dark:bg-white/[0.03] dark:text-white/55">
                The clinic is closed on {dayName(date)}s — pick another day.
              </p>
            ) : (
              <div className="mt-1 flex flex-wrap gap-2">
                {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  aria-pressed={time === slot}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    time === slot
                      ? "bg-ink text-ivory shadow-soft dark:bg-mint-300 dark:text-abyss-950"
                      : "border border-ink/15 bg-white/50 text-ink/70 hover:border-ink/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-white/40"
                  }`}
                >
                  {slot}
                </button>
              ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="ba-treatment">Treatment</label>
              <input
                id="ba-treatment"
                value={treatment}
                onChange={(e) => pickTreatment(e.target.value)}
                placeholder="General Checkup"
                list="ba-treatments"
                className={inputCls}
              />
              <datalist id="ba-treatments">
                {treatmentPrices.map((t) => (
                  <option key={t.name} value={t.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="ba-fee">Fee (₹)</label>
              <input
                id="ba-fee"
                type="number"
                min="0"
                step="50"
                value={fee}
                onChange={(e) => {
                  setFee(e.target.value);
                  setFeeTouched(true);
                }}
                placeholder={String(priceFor(treatment))}
                className={inputCls}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-900/15 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-800 dark:border-red-400/20 dark:bg-red-950/40 dark:text-red-200" role="alert">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-ink/15 py-3 text-sm font-semibold text-ink/70 transition-colors hover:border-ink/40 hover:text-ink dark:border-white/15 dark:text-white/60 dark:hover:border-white/40 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-ink py-3 text-sm font-semibold text-ivory shadow-soft transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 dark:bg-mint-300 dark:text-abyss-950"
            >
              {saving ? "Booking…" : "Book appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
