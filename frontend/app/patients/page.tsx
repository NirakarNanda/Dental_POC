"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import PatientModal from "@/components/PatientModal";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/components/Toast";
import { api, formatDate, type Patient, type PatientStatus } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";

type StatusFilter = "all" | PatientStatus;
type SortKey = "name" | "nextVisit" | "createdAt";

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "follow-up", label: "Follow-up" },
];

function ConfirmDialog({
  name,
  onCancel,
  onConfirm,
  busy,
}: {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-mint-950/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="alertdialog"
      aria-label="Confirm delete"
    >
      <div
        className="animate-fade-up w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-extrabold text-mint-950">Delete patient?</h3>
        <p className="mt-2 text-sm text-slate-600">
          <span className="font-semibold text-mint-950">{name}</span> will be
          removed from the clinic records. This cannot be undone.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border border-mint-200 py-2.5 text-sm font-bold text-mint-800 transition-colors hover:bg-mint-50"
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-2xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientsContent() {
  useRequireAuth();
  const toast = useToast();
  const searchParams = useSearchParams();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("nextVisit");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const [deleting, setDeleting] = useState<Patient | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await api.listPatients();
      setPatients(r.patients);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deep links: ?add=1 opens the create modal, ?status=follow-up pre-filters
  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setEditing(null);
      setModalError("");
      setModalOpen(true);
    }
    const st = searchParams.get("status");
    if (st === "active" || st === "completed" || st === "follow-up") {
      setFilter(st);
    }
  }, [searchParams]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const out = patients.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.treatment.toLowerCase().includes(q)
      );
    });
    out.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else cmp = +new Date(a[sortKey]) - +new Date(b[sortKey]);
      return cmp * sortDir;
    });
    return out;
  }, [patients, search, filter, sortKey, sortDir]);

  const openAdd = () => {
    setEditing(null);
    setModalError("");
    setModalOpen(true);
  };
  const openEdit = (p: Patient) => {
    setEditing(p);
    setModalError("");
    setModalOpen(true);
  };

  const save = async (payload: Partial<Patient>) => {
    setSaving(true);
    setModalError("");
    try {
      if (editing) {
        const r = await api.updatePatient(editing.id, payload);
        setPatients((ps) => ps.map((p) => (p.id === editing.id ? r.patient : p)));
        toast("Patient updated", "success");
      } else {
        const r = await api.createPatient(payload);
        setPatients((ps) => [r.patient, ...ps]);
        toast("Patient added", "success");
      }
      setModalOpen(false);
    } catch (e) {
      setModalError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.deletePatient(deleting.id);
      setPatients((ps) => ps.filter((p) => p.id !== deleting.id));
      toast("Patient deleted", "success");
      setDeleting(null);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    } finally {
      setDeleteBusy(false);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const sortArrow = (key: SortKey) =>
    sortKey === key ? (sortDir === 1 ? " ↑" : " ↓") : "";

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = {
      all: patients.length,
      active: 0,
      completed: 0,
      "follow-up": 0,
    };
    for (const p of patients) c[p.status] += 1;
    return c;
  }, [patients]);

  return (
    <AppShell>
      {/* header */}
      <div className="animate-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-mint-950">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading records…" : `${visible.length} of ${patients.length} patients`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-full bg-mint-600 px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-lift"
        >
          + Add patient
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700" role="alert">
          <span>{error}</span>
          <button onClick={load} className="shrink-0 font-bold underline">Retry</button>
        </div>
      )}

      {/* toolbar */}
      <div className="animate-fade-up mt-6 rounded-3xl bg-white p-4 shadow-soft sm:p-5" style={{ animationDelay: "0.08s" }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, phone or treatment…"
              className="w-full rounded-2xl border border-mint-100 bg-mint-50/40 py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-mint-400 focus:bg-white focus:ring-4 focus:ring-mint-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
                  filter === f.key
                    ? "bg-mint-600 text-white shadow-soft"
                    : "bg-mint-50 text-slate-600 hover:bg-mint-100 hover:text-mint-800"
                }`}
              >
                {f.label}
                <span className={`ml-1.5 rounded-full px-1.5 ${filter === f.key ? "bg-white/25" : "bg-white text-slate-500"}`}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* desktop table */}
      <div className="animate-fade-up mt-6 hidden overflow-hidden rounded-3xl bg-white shadow-soft md:block" style={{ animationDelay: "0.12s" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-mint-100 bg-mint-50/50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-4">
                <button onClick={() => toggleSort("name")} className="font-bold hover:text-mint-800">
                  Patient{sortArrow("name")}
                </button>
              </th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Treatment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">
                <button onClick={() => toggleSort("nextVisit")} className="font-bold hover:text-mint-800">
                  Next visit{sortArrow("nextVisit")}
                </button>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-mint-50">
                  <td className="px-6 py-4"><div className="skeleton h-4 w-36 rounded" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-28 rounded" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-32 rounded" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-6 w-20 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="skeleton h-4 w-24 rounded" /></td>
                  <td className="px-6 py-4"><div className="skeleton ml-auto h-8 w-24 rounded-xl" /></td>
                </tr>
              ))
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <p className="text-base font-bold text-mint-950">No patients found</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {patients.length === 0
                      ? "Your clinic records are empty — add your first patient to get started."
                      : "Try a different search or filter."}
                  </p>
                  {patients.length === 0 && (
                    <button
                      onClick={openAdd}
                      className="mt-4 rounded-full bg-mint-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-mint-700"
                    >
                      + Add first patient
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id} className="border-b border-mint-50 transition-colors last:border-0 hover:bg-mint-50/40">
                  <td className="px-6 py-4">
                    <p className="font-bold text-mint-950">{p.name}</p>
                    <p className="text-xs text-slate-500">Age {p.age}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700">{p.phone}</p>
                    {p.email && <p className="text-xs text-slate-500">{p.email}</p>}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{p.treatment}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 font-medium text-slate-700">{formatDate(p.nextVisit)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-xl border border-mint-200 px-3.5 py-1.5 text-xs font-bold text-mint-800 transition-colors hover:bg-mint-600 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        className="rounded-xl border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="mt-6 space-y-4 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton mt-3 h-4 w-56 rounded" />
              <div className="skeleton mt-2 h-4 w-32 rounded" />
            </div>
          ))
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-mint-200 bg-white p-10 text-center shadow-soft">
            <p className="text-base font-bold text-mint-950">No patients found</p>
            <p className="mt-1 text-sm text-slate-500">
              {patients.length === 0
                ? "Add your first patient to get started."
                : "Try a different search or filter."}
            </p>
            {patients.length === 0 && (
              <button
                onClick={openAdd}
                className="mt-4 rounded-full bg-mint-600 px-6 py-2.5 text-sm font-bold text-white"
              >
                + Add first patient
              </button>
            )}
          </div>
        ) : (
          visible.map((p, i) => (
            <div
              key={p.id}
              className="animate-fade-up rounded-3xl bg-white p-5 shadow-soft"
              style={{ animationDelay: `${Math.min(i, 6) * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-mint-950">{p.name}</p>
                  <p className="text-xs text-slate-500">Age {p.age} · {p.phone}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-mint-50 pt-3 text-sm">
                <div>
                  <p className="text-slate-700">{p.treatment}</p>
                  <p className="mt-0.5 text-xs font-semibold text-mint-700">
                    Next visit: {formatDate(p.nextVisit)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded-xl border border-mint-200 px-3.5 py-1.5 text-xs font-bold text-mint-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(p)}
                    className="rounded-xl border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <PatientModal
        open={modalOpen}
        patient={editing}
        saving={saving}
        error={modalError}
        onClose={() => setModalOpen(false)}
        onSave={save}
      />

      {deleting && (
        <ConfirmDialog
          name={deleting.name}
          busy={deleteBusy}
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
    </AppShell>
  );
}

export default function PatientsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-mint-50/50">
          <p className="text-sm font-medium text-slate-500">Loading patients…</p>
        </div>
      }
    >
      <PatientsContent />
    </Suspense>
  );
}
