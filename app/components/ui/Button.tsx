"use client";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", children, icon, className, ...props }, ref) => {
    const variants = {
      primary:
        "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_40px_rgba(22,163,74,0.3)] hover:shadow-[0_0_60px_rgba(22,163,74,0.5)] border border-green-500/20",
      ghost:
        "bg-transparent hover:bg-foreground/5 text-foreground border border-foreground/10 hover:border-foreground/20",
      outline:
        "bg-transparent border border-green-600/50 text-green-400 hover:bg-green-600/10 hover:border-green-500",
      glass:
        "bg-foreground/5 backdrop-blur-xl text-foreground border border-foreground/10 hover:bg-foreground/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-1.5",
      md: "px-6 py-3 text-base gap-2",
      lg: "px-8 py-4 text-lg gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "relative inline-flex items-center justify-center font-medium rounded-xl",
          "transition-all duration-300 cursor-pointer select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export { Button };