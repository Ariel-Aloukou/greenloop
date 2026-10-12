"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Évite que tous les éléments animent leur couleur pendant le basculement. */
function disableTransitions() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode("*,*::before,*::after{transition:none!important}")
  );
  document.head.appendChild(style);
  // Force le calcul du style avant de retirer la règle.
  void window.getComputedStyle(document.body);
  window.setTimeout(() => document.head.removeChild(style), 1);
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

/**
 * Thème clair / sombre sans dépendance externe.
 *
 * La classe sur `<html>` est posée avant la première peinture par le script
 * d'amorçage défini dans le layout (voir `app/layout.tsx`). `useSyncExternalStore`
 * renvoie `DEFAULT_THEME` pendant l'hydratation (comme le serveur), puis se
 * synchronise avec le DOM : aucun écart d'hydratation, aucun flash.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    disableTransitions();
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* stockage indisponible : on garde le thème en mémoire */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const current: Theme = document.documentElement.classList.contains("light")
      ? "light"
      : "dark";
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider.");
  }
  return context;
}
