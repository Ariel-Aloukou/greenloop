"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { gsap } from "gsap";
import { Download, Menu, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { APP_DOWNLOAD_URL } from "@/app/lib/links";
import { ThemeToggle } from "@/app/components/layout/ThemeToggle";

const NAV_LINKS = [
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Pourquoi GreenGas", href: "#pourquoi-greengas" },
  { label: "Espace citoyen", href: "#tableau-de-bord" },
];

function MagneticButton({
  children,
  className,
  wrapperClassName,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  onClick?: () => void;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - cx) * 0.35,
        y: (e.clientY - cy) * 0.35,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const classes = cn(
    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer",
    "bg-green-600 hover:bg-green-500 text-white",
    "shadow-[0_0_24px_rgba(22,163,74,0.3)] hover:shadow-[0_0_36px_rgba(22,163,74,0.5)]",
    "border border-green-500/25 transition-colors duration-300",
    className
  );

  return (
    <div ref={ref} className={cn("inline-block", wrapperClassName)}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={classes}>
          {children}
        </button>
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const links = NAV_LINKS;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 50);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-foreground/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="GreenGas — Accueil"
        >
          <Image
            src="/logo.png"
            alt="GreenGas"
            width={982}
            height={148}
            priority
            className="h-6 sm:h-7 w-auto rounded-md ring-1 ring-foreground/10"
          />
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.05]"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <MagneticButton href={APP_DOWNLOAD_URL}>
            <Download className="w-4 h-4" strokeWidth={1.8} />
            Télécharger l&apos;app
          </MagneticButton>
        </div>

        {/* Actions mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/[0.06] transition-all duration-200"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileOpen ? "auto" : 0,
          opacity: mobileOpen ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-foreground/[0.06]"
      >
        <div className="px-6 py-6 flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/[0.05] transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-4 border-t border-foreground/[0.06]">
            <MagneticButton
              href={APP_DOWNLOAD_URL}
              wrapperClassName="w-full"
              className="w-full justify-center"
            >
              <Download className="w-4 h-4" strokeWidth={1.8} />
              Télécharger l&apos;app
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
