"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const LINKS = [
  { label: "Services", href: "/#services" },
  { label: "Why us", href: "/#why-us" },
  { label: "Doctors", href: "/#doctors" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-white/85 shadow-soft backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={38} />
          <span className="text-lg font-bold tracking-tight text-mint-950">
            PearlSmile <span className="font-medium text-mint-700">Dental Studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-mint-700"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-mint-800 transition-colors hover:bg-mint-50"
          >
            Staff login
          </Link>
          <Link
            href="/#contact"
            className="rounded-full bg-mint-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-mint-700 hover:shadow-lift"
          >
            Book visit
          </Link>
        </div>

        <button
          className="rounded-xl p-2 text-mint-900 transition-colors hover:bg-mint-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="animate-fade-up border-t border-mint-100 bg-white/95 px-5 pb-6 pt-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-mint-50 hover:text-mint-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-mint-200 px-5 py-3 text-center text-sm font-semibold text-mint-800"
              >
                Staff login
              </Link>
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-mint-600 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Book visit
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
