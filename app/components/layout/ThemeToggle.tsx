"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/layout/ThemeProvider";
import { cn } from "@/app/lib/utils";

/**
 * Bouton de bascule clair / sombre.
 *
 * Les deux icônes sont rendues et affichées via CSS (`dark:`), pas via l'état
 * React : le serveur et le client produisent donc exactement le même HTML et
 * l'icône correspond au thème déjà appliqué par le script d'amorçage.
 * En thème sombre on montre le soleil, en thème clair la lune.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Changer de thème"
      title="Changer de thème"
      className={cn(
        "inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0",
        "border border-foreground/10 text-foreground/60",
        "hover:text-foreground hover:bg-foreground/[0.06] hover:border-foreground/20",
        "transition-all duration-300 cursor-pointer",
        className
      )}
    >
      <Sun className="hidden dark:block w-[18px] h-[18px]" strokeWidth={1.8} />
      <Moon className="dark:hidden w-[18px] h-[18px]" strokeWidth={1.8} />
    </button>
  );
}
