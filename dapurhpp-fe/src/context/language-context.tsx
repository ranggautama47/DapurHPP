"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

type Locale = "id" | "en";

interface TranslationData {
  common: Record<string, any>;
  auth: Record<string, any>;
  dashboard: Record<string, any>;
  settings: Record<string, any>;
  master: Record<string, any>;
  landing: Record<string, any>;
  errors: Record<string, any>;
}

interface LanguageContextType {
  locale: Locale;
  language: Locale;
  setLocale: (locale: Locale) => void;
  setLanguage: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => any;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsCache: Partial<Record<Locale, TranslationData>> = {};

async function loadTranslations(locale: Locale): Promise<TranslationData> {
  if (translationsCache[locale]) {
    return translationsCache[locale]!;
  }

  const [common, auth, dashboard, settings, master, landing, errors] = await Promise.all([
    import(`../locales/${locale}/common.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/auth.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/dashboard.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/settings.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/master.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/landing.json`).catch(() => ({ default: {} })),
    import(`../locales/${locale}/errors.json`).catch(() => ({ default: {} })),
  ]);

  const data: TranslationData = {
    common: common.default || {},
    auth: auth.default || {},
    dashboard: dashboard.default || {},
    settings: settings.default || {},
    master: master.default || {},
    landing: landing.default || {},
    errors: errors.default || {},
  };

  translationsCache[locale] = data;
  return data;
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }

  return current;
}

function interpolate(template: string, params?: Record<string, string>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [translations, setTranslations] = useState<TranslationData | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    const initialLocale = saved || "id";
    setLocaleState(initialLocale);
  }, []);

  useEffect(() => {
    let mounted = true;
    loadTranslations(locale).then((data) => {
      if (mounted) {
        setTranslations(data);
        setReady(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((key: string, params?: Record<string, string>): any => {
    if (!translations) return key;

    const [namespace, ...rest] = key.split(".");
    const namespaceKey = namespace as keyof TranslationData;

    if (!(namespaceKey in translations)) return key;

    const value = getNestedValue(translations[namespaceKey], rest.join("."));
    if (value === undefined) return key;
    if (typeof value !== "string") return value;
    return interpolate(value, params);
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ locale, language: locale, setLocale, setLanguage: setLocale, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

const TOP_LEVEL_NAMESPACES = ["common", "auth", "dashboard", "settings", "master", "landing", "errors"];

export function useTranslation(namespace?: string): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  if (namespace) {
    const wrappedT = useCallback((key: string, params?: Record<string, string>): any => {
      const first = key.split(".")[0];
      if (TOP_LEVEL_NAMESPACES.includes(first)) {
        return context.t(key, params);
      }
      return context.t(`${namespace}.${key}`, params);
    }, [context.t, namespace]);

    return {
      ...context,
      t: wrappedT,
    };
  }

  return context;
}