import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";
import SettingsProvider from "@/lib/settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PearlSmile Dental Studio — Modern Dental Care",
  description:
    "PearlSmile Dental Studio: gentle, modern dentistry. Book cleanings, braces, implants, whitening and more.",
};

/**
 * Blocking inline script: reads the persisted theme before first paint and
 * applies .dark to <html> so there is no light-flash on reload. The class is
 * applied imperatively (React never renders it), and suppressHydrationWarning
 * covers the attribute diff at hydration.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('pearlsmile-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col bg-white text-slate-900 dark:bg-abyss-950 dark:text-mint-50">
        <ThemeProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
