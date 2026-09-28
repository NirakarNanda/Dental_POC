"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AppShell from "@/components/AppShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { api, formatDate, type Appointment, type Patient } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";

function StatSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-abyss-900">
      <div className="skeleton h-10 w-10 rounded-2xl" />
      <div className="skeleton mt-4 h-8 w-20 rounded-lg" />
      <div className="skeleton mt-2 h-4 w-28 rounded-lg" />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  hint,
  delay = 0,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  hint: string;
  delay?: number;
}) {
  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift dark:bg-abyss-900"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* periodic sparkle glint sweeping across the card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-16 animate-glint bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-mint-200/20"
      />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 text-mint-700 dark:from-abyss-700 dark:to-abyss-800 dark:text-mint-300">
        {icon}
      </div>
      <p className="relative mt-4 text-3xl font-extrabold tracking-tight text-mint-950 dark:text-white">{value}</p>
      <p className="relative mt-1 text-sm font-semibold text-slate-600 dark:text-mint-100/70">{label}</p>
      <p className="relative mt-1 text-xs font-medium text-mint-600 dark:text-mint-400">{hint}</p>
    </div>
  );
}

const ICONS = {
  calendar: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </svg>
  ),
  patients: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  revenue: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v20M17 7H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  followup: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" />
      <path d="M3 3v5h5M12 7v5l3.5 2" />
    </svg>
  ),
};

function apptChip(status: string) {
  const s = status.toLowerCase();
  if (s.includes("confirm"))
    return "bg-mint-100 text-mint-800 dark:bg-mint-900/60 dark:text-mint-200";
  if (s.includes("complete") || s.includes("done"))
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200";
  if (s.includes("cancel"))
    return "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-200";
  return "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200";
}

export default function DashboardPage() {
  const { user } = useRequireAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([api.todayAppointments(), api.listPatients()])
      .then(([a, p]) => {
        if (!alive) return;
        setAppointments(a.appointments);
        setPatients(p.patients);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Failed to load dashboard");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const followUps = patients.filter((p) => p.status === "follow-up").length;

  // Demo revenue estimate: ₹1,500 avg per active/completed patient this month
  const revenue = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const count = patients.filter(
      (p) => new Date(p.createdAt).getMonth() === thisMonth,
    ).length;
    return count * 1500;
  }, [patients]);

  // Weekly chart: distribute today's appointments + upcoming nextVisit across the week
  const weekly = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const buckets = days.map((d) => ({ day: d, visits: 0 }));
    const now = new Date();
    const monday = new Date(now);
    const dow = (now.getDay() + 6) % 7; // Monday = 0
    monday.setDate(now.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    for (const p of patients) {
      const d = new Date(p.nextVisit);
      if (Number.isNaN(d.getTime())) continue;
      const diff = Math.floor((d.getTime() - monday.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) buckets[diff].visits += 1;
    }
    if (buckets.every((b) => b.visits === 0) && appointments.length > 0) {
      buckets[dow].visits = appointments.length;
    }
    return buckets;
  }, [patients, appointments]);

  // Theme-aware recharts palette
  const chart = {
    grid: isDark ? "#0e4a46" : "#e6f4f2",
    tick: isDark ? "#99d8d2" : "#64748b",
    bar: isDark ? "#2dd4bf" : "#14b8a6",
    cursor: isDark ? "#093936" : "#f0fdfa",
    tooltipBg: isDark ? "#062b29" : "#ffffff",
    tooltipBorder: isDark ? "#0e4a46" : "#ccfbf1",
    tooltipText: isDark ? "#e6f7f5" : "#0f2724",
  };

  return (
    <AppShell>
      {/* header */}
      <div className="animate-fade-up flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-mint-700 dark:text-mint-300">{today}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-mint-950 dark:text-white">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}
            {user ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-mint-100/60">
            Here is what is happening at PearlSmile Dental Studio today.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/patients?add=1"
            className="rounded-full bg-mint-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-mint-700"
          >
            + Add patient
          </Link>
          <Link
            href="/patients"
            className="rounded-full border border-mint-200 bg-white px-5 py-2.5 text-sm font-semibold text-mint-800 transition-all hover:-translate-y-0.5 hover:bg-mint-50 dark:border-abyss-700 dark:bg-abyss-900 dark:text-mint-200 dark:hover:bg-abyss-800"
          >
            Book appointment
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300" role="alert">
          {error}
        </div>
      )}

      {/* stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={ICONS.calendar} value={String(appointments.length)} label="Today's appointments" hint="Scheduled for today" />
            <StatCard icon={ICONS.patients} value={String(patients.length)} label="Total patients" hint="In the clinic records" delay={0.08} />
            <StatCard icon={ICONS.revenue} value={`₹${revenue.toLocaleString("en-IN")}`} label="Revenue this month" hint="Estimated from new patients" delay={0.16} />
            <StatCard icon={ICONS.followup} value={String(followUps)} label="Pending follow-ups" hint="Need a callback" delay={0.24} />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* today's appointments */}
        <div className="animate-fade-up rounded-3xl bg-white p-6 shadow-soft dark:bg-abyss-900 lg:col-span-3" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-mint-950 dark:text-white">Today&apos;s appointments</h2>
            <Link href="/patients" className="text-sm font-semibold text-mint-700 hover:text-mint-900 dark:text-mint-300 dark:hover:text-mint-200">
              View all patients →
            </Link>
          </div>
          <div className="slim-scroll mt-5 max-h-[380px] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl bg-mint-50/50 p-4 dark:bg-abyss-950/60">
                  <div className="skeleton h-11 w-14 rounded-xl" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 rounded" />
                    <div className="skeleton mt-2 h-3 w-48 rounded" />
                  </div>
                </div>
              ))
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-mint-200 bg-mint-50/50 p-10 text-center dark:border-abyss-700 dark:bg-abyss-950/40">
                <p className="text-sm font-semibold text-mint-800 dark:text-mint-200">No appointments today</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-mint-100/60">Enjoy the calm — or add a patient to fill the chair.</p>
              </div>
            ) : (
              appointments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-4 rounded-2xl border border-mint-50 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-mint-100 hover:shadow-soft dark:border-abyss-800 dark:bg-abyss-950/60 dark:hover:border-abyss-700"
                >
                  <div className="flex h-12 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-mint-50 text-mint-800 dark:bg-abyss-800 dark:text-mint-200">
                    <span className="text-sm font-extrabold leading-none">{a.time}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-mint-950 dark:text-white">{a.patientName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-mint-100/60">{a.treatment}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${apptChip(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* chart + quick actions */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="animate-fade-up rounded-3xl bg-white p-6 shadow-soft dark:bg-abyss-900" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-lg font-bold text-mint-950 dark:text-white">Visits this week</h2>
            <p className="text-xs text-slate-500 dark:text-mint-100/60">Scheduled visits per day</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: chart.tick }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: chart.tick }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: chart.cursor }}
                    contentStyle={{
                      borderRadius: 12,
                      border: `1px solid ${chart.tooltipBorder}`,
                      fontSize: 12,
                      background: chart.tooltipBg,
                      color: chart.tooltipText,
                    }}
                  />
                  <Bar dataKey="visits" fill={chart.bar} radius={[8, 8, 4, 4]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-mint-600 to-cyan-600 p-6 text-white shadow-soft dark:from-mint-800 dark:to-cyan-800" style={{ animationDelay: "0.25s" }}>
            <h2 className="text-lg font-bold">Quick actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-2.5">
              <Link href="/patients?add=1" className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:bg-white/25">
                Add a new patient
              </Link>
              <Link href="/patients" className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:bg-white/25">
                Book an appointment
              </Link>
              <Link href="/patients?status=follow-up" className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur transition-all hover:bg-white/25">
                View pending follow-ups
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* upcoming visits strip */}
      {!loading && patients.length > 0 && (
        <div className="animate-fade-up mt-8 rounded-3xl bg-white p-6 shadow-soft dark:bg-abyss-900" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-bold text-mint-950 dark:text-white">Upcoming visits</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {patients
              .filter((p) => new Date(p.nextVisit).getTime() >= Date.now() - 86400000)
              .sort((a, b) => +new Date(a.nextVisit) - +new Date(b.nextVisit))
              .slice(0, 6)
              .map((p) => (
                <div key={p.id} className="rounded-2xl border border-mint-50 p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft dark:border-abyss-800 dark:bg-abyss-950/50">
                  <p className="text-sm font-bold text-mint-950 dark:text-white">{p.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-mint-100/60">{p.treatment}</p>
                  <p className="mt-2 text-xs font-semibold text-mint-700 dark:text-mint-300">
                    {formatDate(p.nextVisit)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
