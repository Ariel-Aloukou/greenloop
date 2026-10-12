"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Propage le réglage système « réduire les animations » à TOUTES les
 * animations Framer Motion du site (`reducedMotion="user"`).
 * Les utilisateurs sensibles au mouvement voient ainsi une interface
 * stable, sans devoir désactiver chaque animation une par une.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
