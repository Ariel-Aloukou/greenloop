"use client";

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LEAF_PATH =
  "M64 8C64 8 8 40 8 88C8 136 64 152 64 152C64 152 120 136 120 88C120 40 64 8 64 8Z";
const LOOP_PATH =
  "M64 152C64 152 120 136 120 88C120 40 64 8 64 8C64 8 8 40 8 88C8 136 64 152 64 152Z";
const DROP_PATH =
  "M64 8C64 8 8 72 8 112C8 145.6 33.6 160 64 160C94.4 160 120 145.6 120 112C120 72 64 8 64 8Z";
const INFINITY_ONE =
  "M64 88C64 88 92 52 120 88C148 124 120 152 64 152C8 152 8 88 64 88Z";
const INFINITY_TWO =
  "M64 88C64 88 36 124 8 88C-20 52 8 24 64 24C120 24 120 88 64 88Z";
const CHECK_PATH =
  "M32 88L56 112L96 64";

const SHAPES = [LEAF_PATH, LOOP_PATH, DROP_PATH, INFINITY_ONE, INFINITY_TWO, CHECK_PATH];

const TRANSITION = {
  duration: 2.4,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function LoadingScreen() {
  const id = useId();
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (phase < SHAPES.length - 1) {
      const t = setTimeout(() => setPhase((p) => p + 1), 2400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <AnimatePresence>
      {visible && mounted && (
        <motion.div
          key={`${id}-loader`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030a06]"
          aria-label="Chargement de GreenGas"
        >
          {/* Grille d'arrière-plan subtile */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            aria-hidden
          >
            <defs>
              <pattern
                id={`${id}-grid`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(22,163,74,0.03)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id}-grid)`} />
          </svg>

          {/* Lueur centrale */}
          <div
            className="absolute w-[300px] h-[300px] rounded-full pointer-events-none select-none"
            style={{
              background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
            aria-hidden
          />

          {/* SVG morphing */}
          <div className="relative z-10 flex flex-col items-center gap-10">
            <svg
              width="128"
              height="160"
              viewBox="0 0 128 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_40px_rgba(22,163,74,0.15)]"
              aria-hidden
            >
              <motion.path
                d={SHAPES[phase]}
                animate={{ d: SHAPES[phase] }}
                transition={TRANSITION}
                stroke="url(#gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient" x1="8" y1="8" x2="120" y2="152" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#22c55e" />
                  <stop offset="0.5" stopColor="#16a34a" />
                  <stop offset="1" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </svg>

            {/* Indicateur */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                {SHAPES.map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full transition-all duration-700"
                    style={{
                      backgroundColor:
                        i <= phase
                          ? `rgba(22, 163, 74, ${0.4 + (i === phase ? 0.4 : 0.2)})`
                          : "rgba(255,255,255,0.08)",
                      transform: i === phase ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/25"
              >
                Chargement...
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
