"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Locale, TranslationKey, t as translate } from "@/lib/i18n";

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dark: boolean;
  toggleDark: () => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedLocale = (localStorage.getItem("ace_locale") as Locale) || "en";
    const savedDark =
      localStorage.getItem("ace_dark") === "1" ||
      (localStorage.getItem("ace_dark") === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setLocaleState(savedLocale);
    setDark(savedDark);
  }, []);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("ace_locale", l);
  }, []);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      localStorage.setItem("ace_dark", d ? "0" : "1");
      return !d;
    });
  }, []);

  const t = useCallback((key: TranslationKey) => translate(locale, key), [locale]);

  return (
    <AppContext.Provider value={{ locale, setLocale, dark, toggleDark, t }}>
      {children}
    </AppContext.Provider>
  );
}
