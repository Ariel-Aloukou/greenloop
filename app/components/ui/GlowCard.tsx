"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export function GlowCard({ children, className, glowColor = "#16a34a", delay = 0 }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-2xl border border-foreground/5 bg-foreground/3 backdrop-blur-sm overflow-hidden",
        "transition-all duration-500",
        className
      )}
      style={{
        boxShadow: isHovered ? `0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px color-mix(in oklab, var(--foreground) 5%, transparent)` : undefined,
      }}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}30, transparent 60%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  );
}