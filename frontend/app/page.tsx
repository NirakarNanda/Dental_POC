import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Logo from "@/components/Logo";

/* ---------------- service icons (inline SVG) ---------------- */

function IconShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-mint-100 to-aqua-100 text-mint-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

const SERVICES = [
  {
    title: "Teeth Cleaning",
    blurb: "Gentle ultrasonic scaling and polish that leaves your smile glass-smooth.",
    icon: (
      <IconShell>
        <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z" />
        <path d="M19 15l.9 2.1 2.1.9-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.9L19 15z" />
      </IconShell>
    ),
  },
  {
    title: "Braces & Orthodontics",
    blurb: "Metal, ceramic and invisible aligners to straighten teeth at any age.",
    icon: (
      <IconShell>
        <path d="M4 9c2.5 0 2.5 6 5 6s2.5-6 5-6 2.5 6 5 6" />
        <path d="M3 9h18" strokeDasharray="2 2" />
      </IconShell>
    ),
  },
  {
    title: "Dental Implants",
    blurb: "Permanent, natural-feeling replacements for missing teeth — built to last decades.",
    icon: (
      <IconShell>
        <path d="M8 3h8l-1 5h-6L8 3z" />
        <path d="M10 8v3l-1 8a1 1 0 001.8.6L12 17l1.2 2.6a1 1 0 001.8-.6l-1-8V8" />
      </IconShell>
    ),
  },
  {
    title: "Teeth Whitening",
    blurb: "Brighten up to 8 shades in a single sitting with enamel-safe laser whitening.",
    icon: (
      <IconShell>
        <path d="M9.5 4C7 4 5.5 6 5.5 8.5c0 3 1.5 4 2.3 6.6.6 2 1 3.9 2.2 3.9 1.3 0 .9-3.7 1.6-5.3.4-1 2.4-1 2.8 0 .7 1.6.3 5.3 1.6 5.3 1.2 0 1.6-1.9 2.2-3.9.8-2.6 2.3-3.6 2.3-6.6C20.5 6 19 4 16.5 4c-1.5 0-2.6.7-4 .7S11 4 9.5 4z" />
      </IconShell>
    ),
  },
  {
    title: "Root Canal",
    blurb: "Painless single-visit RCT with rotary endodontics and digital X-rays.",
    icon: (
      <IconShell>
        <path d="M12 21V9" />
        <path d="M12 9c-4 0-6-2.5-6-6h12c0 3.5-2 6-6 6z" />
        <path d="M9 21l-1.5 1.5M15 21l1.5 1.5" />
      </IconShell>
    ),
  },
  {
    title: "Pediatric Dentistry",
    blurb: "Fear-free first visits, fluoride care and habit counselling for little smiles.",
    icon: (
      <IconShell>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 9.5c.8 1.5 1.7 1.5 2.5 0s1.7-1.5 2.5 0" />
        <path d="M8.5 14.5c2 1.5 5 1.5 7 0" />
      </IconShell>
    ),
  },
];

const WHY_POINTS = [
  {
    title: "Painless-first philosophy",
    text: "Computer-controlled anaesthesia and noise-cancelling handpieces make every visit comfortable.",
  },
  {
    title: "Digital everything",
    text: "3D scans, digital X-rays and intraoral cameras — precise diagnosis, no guesswork.",
  },
  {
    title: "Transparent pricing",
    text: "Written treatment plans with fixed quotes before we begin. No surprises, ever.",
  },
  {
    title: "Sterilisation you can see",
    text: "Hospital-grade autoclaves and single-use kits for every patient, every time.",
  },
];

const STATS = [
  { value: "12k+", label: "Happy smiles" },
  { value: "15 yrs", label: "Of gentle care" },
  { value: "4.9", label: "Google rating" },
  { value: "25k+", label: "Treatments done" },
];

const DOCTORS = [
  {
    initials: "DR",
    name: "Dr. Ritu Sharma",
    role: "Chief Dentist · Implantologist",
    tag: "15 yrs experience",
    note: "MDS Prosthodontics. 3,000+ implants placed with a gentle hand.",
  },
  {
    initials: "AK",
    name: "Dr. Arjun Kapoor",
    role: "Orthodontist",
    tag: "Invisalign provider",
    note: "1,200+ smiles straightened — teens and adults alike.",
  },
  {
    initials: "PN",
    name: "Dr. Priya Nair",
    role: "Pediatric Dentist",
    tag: "Kid favourite",
    note: "Turns first dental visits into adventures, not anxieties.",
  },
];

const REVIEWS = [
  {
    quote: "I used to dread dentists. PearlSmile changed that in one visit — genuinely painless root canal.",
    name: "Meera Krishnan",
    detail: "Root canal patient",
  },
  {
    quote: "My aligner journey was so smooth. The 3D preview showed my final smile before we even started.",
    name: "Rohan Mehta",
    detail: "Orthodontics patient",
  },
  {
    quote: "They handled my 6-year-old with such patience. She now asks when her next visit is!",
    name: "Ananya Iyer",
    detail: "Parent of pediatric patient",
  },
];

/* ---------------- hero decorative art ---------------- */

function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-0 animate-blob-drift rounded-[3rem] bg-gradient-to-br from-mint-200 via-aqua-100 to-mint-300 blur-2xl" aria-hidden="true" />
      <div className="absolute inset-6 animate-blob-drift-2 rounded-[2.5rem] bg-white/70 backdrop-blur" aria-hidden="true" />
      <div className="relative flex h-full items-center justify-center">
        <div className="animate-float-slow">
          <svg width="220" height="220" viewBox="0 0 48 48" aria-hidden="true" className="drop-shadow-xl">
            <defs>
              <linearGradient id="hero-tooth" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="60%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="21" fill="url(#hero-tooth)" />
            <path
              d="M17.5 13c-3.2 0-5.2 2.6-5.2 6 0 3.7 1.6 4.9 2.6 8.4.9 2.6 1.4 5.3 3 5.3 1.7 0 1-4.9 2.2-6.9.6-1.3 3.2-1.3 3.8 0 1.2 2 1.3 6.9 3 6.9 1.6 0 2.1-2.7 3-5.3 1-3.5 2.6-4.7 2.6-8.4 0-3.4-2-6-5.2-6-2.1 0-3.8 1-5.9 1s-3.8-1-5.9-1z"
              fill="#ffffff"
            />
            <path d="M34 16c.7 1.6 1.3 2.3 2.9 3-1.6.7-2.2 1.4-2.9 3-.7-1.6-1.3-2.3-2.9-3 1.6-.7 2.2-1.4 2.9-3z" fill="#fff" opacity="0.95" />
            <path d="M14.5 33.5c.5 1.1.9 1.6 2 2.1-1.1.5-1.5 1-2 2.1-.5-1.1-.9-1.6-2-2.1 1.1-.5 1.5-1 2-2.1z" fill="#fff" opacity="0.8" />
          </svg>
        </div>

        <div className="absolute left-2 top-10 animate-fade-up rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur" style={{ animationDelay: "0.3s" }}>
          <p className="text-xs font-semibold text-slate-500">Next slot</p>
          <p className="text-sm font-bold text-mint-800">Today · 4:30 PM</p>
        </div>
        <div className="absolute bottom-12 right-0 animate-fade-up rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur" style={{ animationDelay: "0.5s" }}>
          <p className="text-xs font-semibold text-slate-500">Patient rating</p>
          <p className="text-sm font-bold text-mint-800">4.9 / 5 · 2,300+ reviews</p>
        </div>
        <div className="absolute right-8 top-4 animate-fade-up rounded-full bg-mint-600 px-4 py-2 text-xs font-bold text-white shadow-soft" style={{ animationDelay: "0.7s" }}>
          Painless-first
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function LandingPage() {
  return (
    <div className="overflow-x-clip">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-[72px]">
        <div className="pointer-events-none absolute -left-32 top-20 h-[480px] w-[480px] animate-blob-drift rounded-full bg-mint-100/80 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-64 h-[420px] w-[420px] animate-blob-drift-2 rounded-full bg-aqua-100/70 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-2 lg:pt-20">
          <div>
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-mint-200 bg-mint-50 px-4 py-1.5 text-xs font-semibold text-mint-800">
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint-500" />
              Now accepting new patients in Bengaluru
            </div>
            <h1 className="animate-fade-up mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-mint-950 sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
              A healthier smile, <span className="text-gradient">without the fear</span> of the dentist
            </h1>
            <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-600" style={{ animationDelay: "0.2s" }}>
              PearlSmile Dental Studio pairs painless techniques with honest pricing and
              spa-like comfort — so looking after your teeth feels less like a chore
              and more like self-care.
            </p>
            <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
              <Link
                href="#contact"
                className="rounded-full bg-mint-600 px-8 py-4 text-center text-base font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-mint-700"
              >
                Book an appointment
              </Link>
              <Link
                href="#services"
                className="rounded-full border-2 border-mint-200 bg-white px-8 py-[14px] text-center text-base font-semibold text-mint-800 transition-all hover:-translate-y-0.5 hover:border-mint-400 hover:bg-mint-50"
              >
                Explore services
              </Link>
            </div>
            <div className="animate-fade-up mt-10 grid max-w-md grid-cols-3 gap-6" style={{ animationDelay: "0.4s" }}>
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-mint-800">{s.value}</p>
                  <p className="text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.25s" }}>
            <HeroArt />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative bg-gradient-to-b from-white via-mint-50/60 to-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint-600">Our services</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-mint-950 sm:text-4xl">
              Complete care for every smile
            </h2>
            <p className="mt-4 text-slate-600">
              From six-month cleanings to full-mouth rehabilitation — one studio,
              one team, zero runaround.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 0.1}>
                <div className="group h-full rounded-3xl border border-mint-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  {s.icon}
                  <h3 className="mt-5 text-lg font-bold text-mint-950">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.blurb}</p>
                  <Link href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-mint-700 transition-colors hover:text-mint-900">
                    Book this treatment
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint-600">Why PearlSmile</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-mint-950 sm:text-4xl">
                Dentistry that puts you at ease
              </h2>
              <p className="mt-4 max-w-lg text-slate-600">
                We redesigned every part of the dental visit around one question:
                how do we make this something you actually look forward to?
              </p>
              <div className="mt-8 space-y-5">
                {WHY_POINTS.map((p) => (
                  <div key={p.title} className="flex gap-4">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-100 text-mint-700">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-bold text-mint-950">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-600 via-mint-500 to-cyan-600 p-8 text-white shadow-lift sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
                <Logo size={52} />
                <h3 className="mt-6 text-2xl font-extrabold">The PearlSmile promise</h3>
                <p className="mt-3 max-w-md leading-relaxed text-mint-50/90">
                  If a treatment ever feels rushed or unclear, we stop and explain —
                  or you do not pay for that visit. That is how confident we are in
                  gentle, transparent care.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  {STATS.map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                      <p className="text-2xl font-extrabold">{s.value}</p>
                      <p className="mt-1 text-xs font-medium text-mint-100/80">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="bg-gradient-to-b from-white via-aqua-50/70 to-white py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint-600">Meet the doctors</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-mint-950 sm:text-4xl">
              Hands you can trust
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DOCTORS.map((d, i) => (
              <Reveal key={d.name} delay={i * 0.1}>
                <div className="group rounded-3xl border border-mint-100 bg-white p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-mint-400 to-cyan-600 text-2xl font-extrabold text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
                    {d.initials}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-mint-950">{d.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-mint-700">{d.role}</p>
                  <span className="mt-3 inline-block rounded-full bg-mint-50 px-3 py-1 text-xs font-semibold text-mint-800">
                    {d.tag}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{d.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-mint-600">Patient stories</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-mint-950 sm:text-4xl">
              Smiles that speak for us
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <figure className="flex h-full flex-col rounded-3xl bg-mint-50/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-mint-50 hover:shadow-soft">
                  <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.5 5.8 21l1.6-7L2 9.3l7.1-.7L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                    “{r.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-mint-100 pt-4">
                    <p className="font-bold text-mint-950">{r.name}</p>
                    <p className="text-xs font-medium text-slate-500">{r.detail}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-mint-700 via-mint-600 to-cyan-600 px-8 py-14 text-center text-white shadow-lift sm:px-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-blob-drift rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 animate-blob-drift-2 rounded-full bg-mint-300/30 blur-3xl" aria-hidden="true" />
            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready for your best smile yet?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-mint-50/90">
              Book a consultation today — first checkup and digital smile scan are on us.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="rounded-full bg-white px-8 py-4 text-base font-bold text-mint-800 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Book an appointment
              </Link>
              <a
                href="tel:+919845012345"
                className="rounded-full border-2 border-white/50 px-8 py-[14px] text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
              >
                Call +91 98450 12345
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
