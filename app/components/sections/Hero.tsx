"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { gsap } from "gsap";
import CountUp from "react-countup";
import { Download, Play, Recycle, Coins } from "lucide-react";
import { HeroScene } from "@/app/components/three/HeroScene";
import { VideoModal } from "@/app/components/ui/VideoModal";
import { cn } from "@/app/lib/utils";
import { APP_DOWNLOAD_URL } from "@/app/lib/links";

// ─── DONNÉES ─────────────────────────────────────────────────────────────────

const STATS = [
  { value: 130, prefix: "≈ ", suffix: " GWh", label: "Électricité perdue chaque année", decimals: 0 },
  { value: 45, prefix: "≈ ", suffix: "%", label: "Matière organique méthanisable", decimals: 0 },
  { value: 55, prefix: "< ", suffix: "%", label: "Des déchets sont collectés", decimals: 0 },
  { value: 170, prefix: "", suffix: " kWh", label: "Électricité par tonne méthanisée", decimals: 0 },
];

const TITLE_LINES = [
  { text: "Transformer nos", gradient: false },
  { text: "déchets en", gradient: false },
  { text: "énergie.", gradient: true },
];

// ─── BOUTON MAGNÉTIQUE ────────────────────────────────────────────────────────

function MagneticWrapper({
  children,
  strength = 0.42,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      gsap.to(el, {
        x: (e.clientX - cx) * strength,
        y: (e.clientY - cy) * strength,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.45)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, prefersReduced]);

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  stat,
  index,
  triggered,
}: {
  stat: typeof STATS[0];
  index: number;
  triggered: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={triggered ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 1.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col gap-0.5 px-4 py-3.5 rounded-2xl",
        "border border-white/[0.07] bg-white/[0.03] backdrop-blur-md",
        "hover:border-green-500/30 hover:bg-green-950/20 transition-all duration-500 cursor-default"
      )}
    >
      {/* Glow hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(80px at 50% -10%, rgba(22,163,74,0.12), transparent)" }}
      />

      <span className="text-[1.65rem] md:text-3xl font-bold tabular-nums leading-none text-white">
        {stat.prefix && (
          <span className="text-green-400 mr-0.5 text-2xl">{stat.prefix}</span>
        )}
        {triggered && (
          <CountUp
            start={0}
            end={stat.value}
            duration={2.2}
            decimals={stat.decimals}
            delay={1.5 + index * 0.12}
            useEasing
          />
        )}
        {!triggered && "0"}
        <span className="text-green-400 ml-0.5 text-2xl">{stat.suffix}</span>
      </span>

      <span className="text-[11px] text-white/40 font-medium tracking-wide leading-tight">
        {stat.label}
      </span>
    </motion.div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const triggered = useInView(statsRef, { once: true });
  const [videoOpen, setVideoOpen] = useState(false);

  const scrollToHowItWorks = () => {
    document.getElementById("comment-ca-marche")?.scrollIntoView({ behavior: "smooth" });
  };

  const lineVariants = {
    hidden: { y: "108%", opacity: 0 },
    visible: (i: number) => ({
      y: "0%",
      opacity: 1,
      transition: {
        delay: 0.25 + i * 0.14,
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#030a06]"
      aria-label="Section principale"
    >
      {/* ── FONDS LUMINEUX ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute top-[-18%] left-[25%] w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,163,74,0.16) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[-12%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Séparateur bas */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
      </div>

      {/* ── CONTENU PRINCIPAL ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 xl:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 items-center">

          {/* ── COLONNE TEXTE ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 lg:gap-9">

            {/* Badge pulsant */}
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="self-start"
            >
              <span className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
                "text-sm font-medium text-green-400",
                "border border-green-500/25 bg-green-950/40 backdrop-blur-sm",
                "shadow-[inset_0_1px_0_rgba(74,222,128,0.08)]"
              )}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Abidjan · Côte d&apos;Ivoire
              </span>
            </motion.div>

            {/* Titre — reveal ligne par ligne */}
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.07] tracking-tight">
              {TITLE_LINES.map(({ text, gradient }, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={cn(
                      "block",
                      gradient
                        ? "bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent"
                        : "text-white"
                    )}
                    custom={i}
                    variants={lineVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {text}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Sous-titre */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="text-base md:text-[1.1rem] text-white/50 leading-[1.75] max-w-[480px]"
            >
              GreenGas trace chaque déchet, du bac du citoyen jusqu&apos;au
              kilowattheure produit. La chaîne d&apos;approvisionnement
              numérique de la méthanisation.
            </motion.p>

            {/* Boutons magnétiques */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3"
            >
              {/* Bouton primaire */}
              <MagneticWrapper strength={0.38}>
                <motion.a
                  href={APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "inline-flex items-center gap-2.5 px-7 py-[14px] rounded-xl",
                    "font-semibold text-[0.95rem] text-white cursor-pointer",
                    "bg-green-600 hover:bg-green-500 transition-colors duration-300",
                    "shadow-[0_0_0_1px_rgba(74,222,128,0.2),0_8px_32px_rgba(22,163,74,0.38)]",
                    "hover:shadow-[0_0_0_1px_rgba(74,222,128,0.4),0_8px_56px_rgba(22,163,74,0.55)]",
                    "transition-shadow duration-400"
                  )}
                >
                  Télécharger l&apos;app
                  <Download className="w-4 h-4" />
                </motion.a>
              </MagneticWrapper>

              {/* Bouton secondaire */}
              <MagneticWrapper strength={0.32}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVideoOpen(true)}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={cn(
                    "inline-flex items-center gap-3 px-7 py-[14px] rounded-xl",
                    "font-semibold text-[0.95rem] text-white/75 hover:text-white cursor-pointer",
                    "border border-white/[0.09] hover:border-white/[0.18]",
                    "bg-white/[0.04] hover:bg-white/[0.08]",
                    "backdrop-blur-sm transition-all duration-300"
                  )}
                  aria-label="Voir la vidéo de présentation"
                >
                  <span className={cn(
                    "inline-flex items-center justify-center w-6 h-6 rounded-full",
                    "border border-white/20 bg-white/10"
                  )}>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </span>
                  Voir comment ça marche
                </motion.button>
              </MagneticWrapper>
            </motion.div>

            {/* Stats CountUp */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5 pt-1"
            >
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} triggered={triggered} />
              ))}
            </div>
          </div>

          {/* ── COLONNE 3D ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[400px] md:h-[540px] lg:h-[620px] w-full"
            aria-hidden
          >
            {/* Halo derrière le canvas */}
            <div
              className="absolute inset-[8%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(22,163,74,0.13) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* Scène 3D */}
            <HeroScene />

            {/* Étiquette — Collecte active */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute top-[16%] left-[2%] flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
                "border border-green-500/25 bg-green-950/65 backdrop-blur-lg",
                "shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-green-600/25 border border-green-500/30 flex items-center justify-center shrink-0">
                <Recycle className="w-4 h-4 text-green-400" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white leading-tight">Dépôt scanné</p>
                <p className="text-[10px] text-green-400 truncate">BAC-014 · Résidence Atlantic</p>
              </div>
            </motion.div>

            {/* Étiquette — Points */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute bottom-[20%] right-[2%] flex items-center gap-2.5 px-3 py-2.5 rounded-xl",
                "border border-white/[0.09] bg-white/[0.05] backdrop-blur-lg",
                "shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-white leading-tight">+186 GreenPoints</p>
                <p className="text-[10px] text-white/40 truncate">Échangeables maintenant</p>
              </div>
            </motion.div>

            {/* Étiquette — CO2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute top-[52%] right-[6%] flex items-center gap-2 px-3 py-2 rounded-xl",
                "border border-green-500/20 bg-[#030a06]/70 backdrop-blur-lg",
                "shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
              )}
            >
              <span className="text-[12px] font-bold text-green-400">≈ 5,8 kWh</span>
              <span className="text-[10px] text-white/35">estimés ce mois</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden
      >
        <span className="text-[9px] font-medium tracking-[0.25em] uppercase text-white/25">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-green-500/40 to-transparent"
        />
      </motion.div>

      {/* ── MODALE VIDÉO ───────────────────────────────────────────────────── */}
      <VideoModal
        open={videoOpen}
        onOpenChange={setVideoOpen}
        onFallback={scrollToHowItWorks}
      />
    </section>
  );
}
