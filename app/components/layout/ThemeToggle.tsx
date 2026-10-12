"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/app/lib/utils";

/**
 * Bouton soleil / lune. Le thème sombre étant la valeur par défaut du site,
 * l'icône affichée indique l'action à venir (soleil = passer en clair).
 *
 * `resolvedTheme` vaut `undefined` au premier rendu (serveur comme client) :
 * on retombe donc sur le rendu sombre, sans risque de désaccord d'hydratation.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      title="Changer de thème"
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
        "border border-foreground/10 text-foreground/60",
        "hover:text-foreground hover:bg-foreground/[0.06] hover:border-foreground/20",
        "transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px]" strokeWidth={1.8} />
      ) : (
        <Moon className="w-[18px] h-[18px]" strokeWidth={1.8} />
      )}
    </button>
  );
}
