"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "pearlsmile-theme";

interface ThemeState {
  theme: Theme;
  /** True only after the client has mounted and the stored theme applied. */
  mounted: boolean;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeState>({
  theme: "light",
  mounted: false,
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeCtx);

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* storage unavailable — theme just won't persist */
  }
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mount-gated: first render is always light on both server and client,
  // so SSR markup and hydration match. The stored preference is applied
  // in an effect after mount (a blocking inline script in <head> also
  // pre-applies it before first paint to avoid a flash).
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initial: Theme = "light";
    try {
      if (localStorage.getItem(STORAGE_KEY) === "dark") initial = "dark";
    } catch {
      /* ignore */
    }
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, mounted, toggle }),
    [theme, mounted, toggle],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
