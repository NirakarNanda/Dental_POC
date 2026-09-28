"use client";

import { useEffect, useState } from "react";
import {
  STATUSES,
  TREATMENTS,
  toDateInput,
  type Patient,
  type PatientStatus,
} from "@/lib/api";

interface Props {
  open: boolean;
  patient: Patient | null; // null => create mode
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (payload: Partial<Patient>) => void;
}

const EMPTY = {
  name: "",
  age: "",
  phone: "",
  email: "",
  treatment: TREATMENTS[0],
  status: "active" as PatientStatus,
  nextVisit: "",
  notes: "",
};

export default function PatientModal({ open, patient, saving, error, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) {
      if (patient) {
        setForm({
          name: patient.name,
          age: String(patient.age),
          phone: patient.phone,
          email: patient.email ?? "",
          treatment: patient.treatment,
          status: patient.status,
          nextVisit: toDateInput(patient.nextVisit),
          notes: patient.notes ?? "",
        });
      } else {
        setForm(EMPTY);
      }
    }
  }, [open, patient]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(form.age, 10);
    if (!form.name.trim() || !form.phone.trim() || Number.isNaN(age) || age < 0) return;
    onSave({
      name: form.name.trim(),
      age,
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      treatment: form.treatment,
      status: form.status,
      nextVisit: form.nextVisit
        ? new Date(form.nextVisit).toISOString()
        : new Date().toISOString(),
      notes: form.notes.trim() || undefined,
    });
  };

  const inputCls =
    "w-full rounded-xl border border-mint-100 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-mint-400 focus:ring-4 focus:ring-mint-100";
  const labelCls = "mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-mint-950/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={patient ? "Edit patient" : "Add patient"}
    >
      <div
        className="animate-fade-up slim-scroll max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-lift sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-mint-950">
            {patient ? "Edit patient" : "Add new patient"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-mint-50 hover:text-mint-800"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls} htmlFor="pm-name">Full name *</label>
            <input id="pm-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aarav Patel" className={inputCls} />
          </div>
          <div className="col-span-1">
            <label className={labelCls} htmlFor="pm-age">Age *</label>
            <input id="pm-age" required type="number" min="0" max="130" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="32" className={inputCls} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls} htmlFor="pm-phone">Phone *</label>
            <input id="pm-phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls} htmlFor="pm-email">Email</label>
            <input id="pm-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="patient@email.com" className={inputCls} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls} htmlFor="pm-treatment">Treatment</label>
            <select id="pm-treatment" value={form.treatment} onChange={(e) => set("treatment", e.target.value)} className={inputCls}>
              {TREATMENTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls} htmlFor="pm-status">Status</label>
            <select id="pm-status" value={form.status} onChange={(e) => set("status", e.target.value)} className={`${inputCls} capitalize`}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls} htmlFor="pm-nextVisit">Next visit</label>
            <input id="pm-nextVisit" type="date" value={form.nextVisit} onChange={(e) => set("nextVisit", e.target.value)} className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls} htmlFor="pm-notes">Notes</label>
            <textarea id="pm-notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Allergies, concerns, treatment plan…" className={`${inputCls} resize-none`} />
          </div>

          {error && (
            <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="col-span-2 mt-1 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-mint-200 py-3 text-sm font-bold text-mint-800 transition-colors hover:bg-mint-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-2xl bg-mint-600 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-mint-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : patient ? "Save changes" : "Add patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
