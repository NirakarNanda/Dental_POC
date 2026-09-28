import Link from "next/link";
import Logo, { ToothGlyph } from "@/components/Logo";

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-mint-950 text-mint-100">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-mint-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo size={40} />
              <span className="text-lg font-bold tracking-tight text-white">
                PearlSmile <span className="font-medium text-mint-300">Dental Studio</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mint-200/80">
              Gentle, modern dentistry in a space designed to calm. From routine
              cleanings to complete smile makeovers — your smile is safe with us.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-mint-200">
                <ToothGlyph size={20} />
              </span>
              <div className="text-sm">
                <p className="font-semibold text-white">Open Mon–Sat · 9:00 AM – 8:00 PM</p>
                <p className="text-mint-200/70">Sundays by appointment</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-mint-300">Visit us</h4>
            <address className="mt-4 space-y-2 text-sm not-italic text-mint-200/80">
              <p>2nd Floor, Sunrise Plaza<br />MG Road, Bengaluru 560001</p>
              <p>
                <a href="tel:+919845012345" className="transition-colors hover:text-white">
                  +91 98450 12345
                </a>
              </p>
              <p>
                <a href="mailto:hello@pearlsmile.dental" className="transition-colors hover:text-white">
                  hello@pearlsmile.dental
                </a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-mint-300">Quick links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["Services", "/#services"],
                ["Why choose us", "/#why-us"],
                ["Our doctors", "/#doctors"],
                ["Patient reviews", "/#reviews"],
                ["Staff login", "/login"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-mint-200/80 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-mint-200/60 sm:flex-row">
          <p>© {new Date().getFullYear()} PearlSmile Dental Studio. All rights reserved.</p>
          <p>Crafted with care for brighter smiles.</p>
        </div>
      </div>
    </footer>
  );
}
