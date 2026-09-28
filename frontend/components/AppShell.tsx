"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import ToastProvider from "@/components/Toast";
import AmbientBackground from "@/components/AmbientBackground";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { fraunces } from "@/lib/fonts";
import { useRequireAuth } from "@/lib/auth";

const NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

function ShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useRequireAuth();
  const sectionTitle =
    pathname === "/patients" ? "Patients" : pathname === "/settings" ? "Settings" : "Dashboard";

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory dark:bg-abyss-950">
        <div className="flex flex-col items-center gap-5">
          <Logo size={48} className="animate-pulse" />
          <div className="h-px w-44 overflow-hidden bg-ink/10 dark:bg-white/10">
            <div className="skeleton h-full w-full" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/45 dark:text-white/40">
            Opening PearlSmile studio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-ink dark:bg-abyss-950 dark:text-[#edf7f5] lg:flex">
      <AmbientBackground />
      {/* Sidebar */}
      <aside className="relative z-10 hidden w-64 shrink-0 flex-col border-r border-white/60 bg-white/30 backdrop-blur-[28px] saturate-[1.6] dark:border-white/10 dark:bg-white/[0.04] lg:flex">
        <Link href="/dashboard" className="flex items-center gap-3 px-7 pt-7" aria-label="PearlSmile dashboard">
          <Logo size={36} />
          <span className="leading-none">
            <span className={`${fraunces.className} block text-[21px] font-medium tracking-tight`}>
              PearlSmile
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.3em] text-ink/50 dark:text-white/45">
              Dental Studio
            </span>
          </span>
        </Link>

        <nav className="mt-10 flex flex-col gap-1 px-4">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink text-ivory dark:bg-mint-300 dark:text-abyss-950"
                    : "text-ink/60 hover:bg-ink/5 hover:text-ink dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
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
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z" />
            </svg>
            Website
          </a>
        </nav>

        <div className="mt-auto px-4 pb-3">
          <div className="border-t border-white/60 pt-3 dark:border-white/10">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ink/40 dark:text-white/35">
              Developed by
            </p>
            <p className="mt-1 text-[13px] font-semibold">Nirakar Nanda</p>
            <p className="mt-0.5 text-[10px] text-ink/40 dark:text-white/35">
              © 2026 · MIT Licensed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 pb-6">
          <div className="glass min-w-0 flex-1 rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/45 dark:text-white/40">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-semibold">{user.name}</p>
            <button
              onClick={logout}
              className="glass-pill mt-3 w-full rounded-full bg-white/40 py-2 text-xs font-semibold text-ink/70 transition-colors hover:bg-white/70 hover:text-ink dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.12] dark:hover:text-white"
            >
              Sign out
            </button>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Content column */}
      <div className="min-w-0 flex-1 lg:flex lg:flex-col">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-white/60 bg-ivory/60 px-4 py-2.5 backdrop-blur-2xl dark:border-white/10 dark:bg-abyss-950/70 lg:hidden">
        <Link href="/dashboard" className="flex shrink-0 items-center" aria-label="PearlSmile dashboard">
          <Logo size={30} />
        </Link>
        <div className="flex min-w-0 items-center gap-1">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-ink text-ivory dark:bg-mint-300 dark:text-abyss-950"
                    : "text-ink/60 hover:bg-ink/5 dark:text-white/55 dark:hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <ThemeToggle className="h-8 w-8" />
          <button
            onClick={logout}
            className="rounded-full p-1.5 text-ink/50 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-white/50 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            aria-label="Sign out"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop navbar — section title + theme toggle, always visible */}
      <div className="glass-bar sticky top-0 z-30 hidden items-center justify-between gap-4 px-8 py-3 lg:flex">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-ink/45 dark:text-white/40">
            PearlSmile Studio
          </p>
          <h2 className={`${fraunces.className} mt-0.5 text-[21px] font-light leading-none tracking-tight`}>
            {sectionTitle}
          </h2>
        </div>
        <ThemeToggle />
      </div>

      {/* Main */}
      <main className="relative z-10 min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      </div>
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
