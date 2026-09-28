"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import ToastProvider from "@/components/Toast";
import { useRequireAuth } from "@/lib/auth";

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Patients",
    href: "/patients",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mint-50/50">
        <div className="flex flex-col items-center gap-4">
          <Logo size={52} className="animate-pulse" />
          <div className="h-2 w-40 overflow-hidden rounded-full bg-mint-100">
            <div className="skeleton h-full w-full rounded-full" />
          </div>
          <p className="text-sm font-medium text-slate-500">Loading PearlSmile studio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50/70 via-white to-aqua-50/50 lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-white/80 px-5 py-6 backdrop-blur-xl lg:flex">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
          <Logo size={38} />
          <span className="text-[17px] font-bold tracking-tight text-mint-950">
            PearlSmile <span className="font-medium text-mint-700">Studio</span>
          </span>
        </Link>
        <nav className="mt-10 flex flex-col gap-1.5">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                  active
                    ? "bg-mint-600 text-white shadow-soft"
                    : "text-slate-600 hover:bg-mint-50 hover:text-mint-800"
                }`}
              >
                {n.icon}
                {n.label}
              </Link>
            );
          })}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-mint-50 hover:text-mint-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z" />
            </svg>
            Website
          </a>
        </nav>
        <div className="mt-auto">
          <div className="rounded-2xl bg-mint-50 p-4">
            <p className="text-xs font-semibold text-slate-500">Signed in as</p>
            <p className="mt-0.5 truncate text-sm font-bold text-mint-950">{user.name}</p>
            <button
              onClick={logout}
              className="mt-3 w-full rounded-xl border border-mint-200 bg-white py-2 text-xs font-bold text-mint-800 transition-colors hover:bg-mint-600 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-base font-bold text-mint-950">PearlSmile</span>
        </Link>
        <div className="flex items-center gap-2">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  active ? "bg-mint-600 text-white" : "text-slate-600 hover:bg-mint-50"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="rounded-full px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Sign out"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ShellInner>{children}</ShellInner>
    </ToastProvider>
  );
}
