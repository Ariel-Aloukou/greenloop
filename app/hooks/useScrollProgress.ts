"use client";
import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

export function useScrollProgress(offset: [string, string] = ["start end", "end start"]) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return { ref, scrollYProgress };
}

export function useParallax(scrollYProgress: MotionValue<number>, distance: number = 100) {
  return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
}