"use client";

import { useRef, useState, useId } from "react";
import { motion, useInView, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import {
  Leaf,
  Coins,
  Smartphone,
  RefreshCw,
  Users,
  TrendingUp,
  ArrowUpRight,
  Zap,
  MapPin,
  BarChart3,
  CircleDot,
} from "lucide-react";
import { GlowCard } from "@/app/components/ui/GlowCard";
import { cn } from "@/app/lib/utils";
import { useRegisterModal } from "@/app/lib/register-modal-context";

// ─── EASING PARTAGÉ ──────────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

// ─── MINI COUNT-UP INTERNE ───────────────────────────────────────────────────
function CountValue({
  target,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
  trigger,
  duration = 2,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  trigger: boolean;
  duration?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("fr-FR")
  );
  const [display, setDisplay] = useState(decimals > 0 ? "0.0" : "0");

  useEffect(() => {
    if (!trigger) return;
    const controls = animate(mv, target, {
      duration,
      ease: "easeOut",
    });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
  }, [trigger, target, duration, mv, rounded]);

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── MINI GRAPHE À BARRES SVG (Impact) ───────────────────────────────────────
const BAR_DATA = [
  { month: "Jan", val: 22 },
  { month: "Fév", val: 35 },
  { month: "Mar", val: 28 },
  { month: "Avr", val: 48 },
  { month: "Mai", val: 41 },
  { month: "Jun", val: 62 },
];
const BAR_MAX = 70;

function MiniBarChart({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex items-end gap-1.5 h-14 w-full">
      {BAR_DATA.map((d, i) => {
        const pct = d.val / BAR_MAX;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className="w-full rounded-t-sm origin-bottom"
              style={{
                height: `${pct * 100}%`,
                background:
                  i === BAR_DATA.length - 1
                    ? "linear-gradient(to top, #16a34a, #4ade80)"
                    : "rgba(74,222,128,0.22)",
              }}
              initial={{ scaleY: 0 }}
              animate={trigger ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.3 + i * 0.07,
                ease: EASE_OUT_EXPO,
              }}
            />
            <span className="text-[8px] text-white/25 hidden sm:block">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MINI DONUT SVG (Circularité) ────────────────────────────────────────────
function MiniDonut({ trigger }: { trigger: boolean }) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;

  const segments = [
    { label: "Plastique", pct: 0.48, color: "#22c55e" },
    { label: "Carton",    pct: 0.28, color: "#4ade80" },
    { label: "Organique", pct: 0.24, color: "#86efac" },
  ];

  let cumulPct = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
        {/* Fond */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} />

        {segments.map((seg, i) => {
          const dash = seg.pct * circumference;
          const gap  = circumference - dash;
          const offset = circumference - cumulPct * circumference;
          cumulPct += seg.pct;

          return (
            <motion.circle
              key={seg.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={10}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-circumference + offset}
              strokeLinecap="butt"
              initial={{ opacity: 0 }}
              animate={trigger ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
            />
          );
        })}
      </svg>

      {/* Centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-white leading-none">100%</span>
        <span className="text-[7px] text-white/35 leading-none mt-0.5">valorisé</span>
      </div>
    </div>
  );
}

// ─── WALLET DE POINTS (Récompenses) ──────────────────────────────────────────
const REWARDS = [
  { icon: "📱", label: "Crédit téléphonique",  pts: 500,  color: "#4ade80" },
  { icon: "🛒", label: "Bon alimentaire",       pts: 1200, color: "#22c55e" },
  { icon: "⛽", label: "Bon carburant",          pts: 2000, color: "#86efac" },
];

function RewardWallet({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {REWARDS.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, x: 16 }}
          animate={trigger ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease: EASE_OUT_EXPO }}
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl",
            "border border-white/[0.07] bg-white/[0.04]"
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{r.icon}</span>
            <span className="text-[12px] text-white/65 font-medium">{r.label}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Coins className="w-3 h-3" style={{ color: r.color }} />
            <span className="text-[12px] font-semibold" style={{ color: r.color }}>
              {r.pts.toLocaleString("fr-FR")} pts
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── MAP PINS (Emplois locaux) ────────────────────────────────────────────────
const ZONES = [
  { label: "Yopougon",   top: "30%", left: "18%",  active: true  },
  { label: "Cocody",     top: "20%", left: "62%",  active: true  },
  { label: "Adjamé",     top: "48%", left: "40%",  active: true  },
  { label: "Abobo",      top: "15%", left: "38%",  active: false },
  { label: "Marcory",    top: "65%", left: "55%",  active: false },
  { label: "Treichville",top: "70%", left: "38%",  active: false },
];

function ZoneMap({ trigger }: { trigger: boolean }) {
  return (
    <div className="relative w-full h-24 select-none">
      {/* Fond carte stylisée */}
      <div
        className="absolute inset-0 rounded-xl opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 40% 50%, rgba(22,163,74,0.15) 0%, transparent 60%),
            repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.025) 18px, rgba(255,255,255,0.025) 19px),
            repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.025) 18px, rgba(255,255,255,0.025) 19px)
          `,
        }}
      />

      {ZONES.map((z, i) => (
        <motion.div
          key={z.label}
          className="absolute flex flex-col items-center gap-0.5"
          style={{ top: z.top, left: z.left, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={trigger ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.45, delay: 0.3 + i * 0.1, type: "spring", stiffness: 300, damping: 18 }}
        >
          {/* Ping sur les zones actives */}
          {z.active && (
            <motion.div
              className="absolute w-6 h-6 rounded-full"
              animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              style={{ background: "rgba(74,222,128,0.3)" }}
            />
          )}
          <MapPin
            className="w-3.5 h-3.5"
            style={{ color: z.active ? "#4ade80" : "#ffffff35" }}
            fill={z.active ? "#4ade8035" : "transparent"}
          />
          <span className="text-[7px] font-medium whitespace-nowrap"
            style={{ color: z.active ? "#86efac" : "#ffffff30" }}>
            {z.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ─── ICÔNE HOVER ANIMÉE ──────────────────────────────────────────────────────
function AnimIcon({
  icon: Icon,
  color,
  bgColor,
  size = "default",
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  color: string;
  bgColor: string;
  size?: "default" | "lg";
}) {
  const [hovered, setHovered] = useState(false);
  const s = size === "lg" ? "w-7 h-7" : "w-5 h-5";
  const wrap = size === "lg" ? "w-14 h-14 rounded-2xl" : "w-10 h-10 rounded-xl";

  return (
    <motion.div
      className={cn("flex items-center justify-center shrink-0 border", wrap)}
      style={{ backgroundColor: bgColor, borderColor: `${color}35` }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <motion.div
        animate={hovered ? { rotate: [0, -12, 12, 0], scale: 1.15 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      >
        <Icon className={s} style={{ color }} strokeWidth={1.8} />
      </motion.div>
    </motion.div>
  );
}

// ─── BLOC 1 : IMPACT ÉCOLOGIQUE (col-span-7) ─────────────────────────────────
function BlockEcological({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col h-full gap-5">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <AnimIcon icon={Leaf} color="#4ade80" bgColor="rgba(74,222,128,0.1)" size="lg" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green-500/70 mb-1">
              Impact mesurable
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Impact écologique
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                direct &amp; certifié
              </span>
            </h3>
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="flex flex-col gap-2 shrink-0 text-right">
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">
              <CountValue target={48.6} decimals={1} suffix=" t" trigger={trigger} />
            </div>
            <div className="text-[10px] text-white/40">déchets collectés</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 tabular-nums">
              <CountValue target={31.2} decimals={1} suffix=" t" trigger={trigger} />
            </div>
            <div className="text-[10px] text-white/40">CO₂ économisé</div>
          </div>
        </div>
      </div>

      {/* Graphique barres */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/30 font-medium">Collecte mensuelle (tonnes)</span>
          <div className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
            <TrendingUp className="w-3 h-3" />
            +41% ce semestre
          </div>
        </div>
        <MiniBarChart trigger={trigger} />
      </div>

      {/* Footer */}
      <p className="text-[12.5px] text-white/45 leading-relaxed">
        Chaque foyer participant réduit en moyenne{" "}
        <span className="text-white/70 font-medium">14 kg de CO₂</span> par mois.
        Nos partenaires recycleurs certifient chaque tonne valorisée.
      </p>
    </div>
  );
}

// ─── BLOC 2 : RÉCOMPENSES (col-span-5) ───────────────────────────────────────
function BlockRewards({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={Coins} color="#fbbf24" bgColor="rgba(251,191,36,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-amber-500/70 mb-0.5">
            GreenPoints
          </p>
          <h3 className="text-xl font-bold text-white leading-tight">
            Récompenses
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              attractives
            </span>
          </h3>
        </div>
      </div>

      {/* Solde principal */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3.5 rounded-2xl",
          "border border-amber-500/15 bg-amber-950/20"
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/25 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-amber-400" strokeWidth={1.8} />
        </div>
        <div>
          <div className="text-[11px] text-white/40 leading-none mb-1">Mon solde disponible</div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums leading-none">
            <CountValue target={2480} suffix=" pts" trigger={trigger} duration={2.2} />
          </div>
        </div>
      </div>

      {/* Liste récompenses */}
      <RewardWallet trigger={trigger} />

      <div className="mt-auto flex items-center gap-1.5 text-[11px] text-white/30">
        <CircleDot className="w-3 h-3 text-green-500/60" />
        25 pts gagnés par kg collecté
      </div>
    </div>
  );
}

// ─── BLOC 3 : COLLECTE SIMPLIFIÉE (col-span-4) ───────────────────────────────
const UX_STEPS = [
  { label: "Scan le QR code",        sub: "Depuis l'app en 3s"         },
  { label: "Planifie la collecte",   sub: "Créneau en 2 taps"          },
  { label: "Pose tes sacs dehors",   sub: "La veille ou le matin"      },
  { label: "Reçois tes points",      sub: "Validation automatique"     },
];

function BlockSimplicity() {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={Smartphone} color="#818cf8" bgColor="rgba(129,140,248,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-400/70 mb-0.5">
            Expérience UX
          </p>
          <h3 className="text-xl font-bold text-white leading-tight">
            Collecte
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              en un clic
            </span>
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {UX_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.09, ease: EASE_OUT_EXPO }}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl",
              "border border-white/[0.06] bg-white/[0.03]",
              "hover:border-indigo-500/25 hover:bg-indigo-950/15 transition-all duration-300"
            )}
          >
            <div className="w-5 h-5 rounded-full border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-indigo-400">{i + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-white/80 leading-none truncate">
                {s.label}
              </p>
              <p className="text-[11px] text-white/35 leading-none mt-0.5">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 text-[11px] text-white/30">
        <BarChart3 className="w-3 h-3 text-indigo-400/50" />
        Disponible sur iOS &amp; Android
      </div>
    </div>
  );
}

// ─── BLOC 4 : ÉCONOMIE CIRCULAIRE (col-span-4) ────────────────────────────────
function BlockCircular({ trigger }: { trigger: boolean }) {
  const segments = [
    { label: "Plastique", pct: 48, color: "#22c55e" },
    { label: "Carton",    pct: 28, color: "#4ade80" },
    { label: "Organique", pct: 24, color: "#86efac" },
  ];

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={RefreshCw} color="#34d399" bgColor="rgba(52,211,153,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-emerald-500/70 mb-0.5">
            Valorisation
          </p>
          <h3 className="text-xl font-bold text-white leading-tight">
            Économie
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              circulaire
            </span>
          </h3>
        </div>
      </div>

      {/* Donut + légende */}
      <div className="flex items-center gap-4">
        <MiniDonut trigger={trigger} />
        <div className="flex flex-col gap-2 flex-1">
          {segments.map((s, i) => (
            <motion.div
              key={s.label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={trigger ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: EASE_OUT_EXPO }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[11px] text-white/55 flex-1 truncate">{s.label}</span>
              <span className="text-[11px] font-semibold text-white/70 tabular-nums">
                {s.pct}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-[12.5px] text-white/40 leading-relaxed">
        100% des déchets collectés sont valorisés localement par nos
        partenaires industriels ivoiriens.
      </p>
    </div>
  );
}

// ─── BLOC 5 : EMPLOIS LOCAUX (col-span-4) ────────────────────────────────────
function BlockJobs({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={Users} color="#fb923c" bgColor="rgba(251,146,60,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-orange-500/70 mb-0.5">
            Impact social
          </p>
          <h3 className="text-xl font-bold text-white leading-tight">
            Emplois
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              locaux créés
            </span>
          </h3>
        </div>
      </div>

      {/* Métrique centrale */}
      <div className="flex items-end gap-3">
        <div className="text-5xl font-black tabular-nums text-white leading-none">
          <CountValue target={48} trigger={trigger} duration={1.8} />
        </div>
        <div className="pb-1.5">
          <div className="text-[11px] text-white/40 leading-tight">agents de</div>
          <div className="text-[11px] text-white/40 leading-tight">collecte formés</div>
        </div>
      </div>

      {/* Carte des quartiers */}
      <ZoneMap trigger={trigger} />

      {/* Stat secondaire */}
      <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-center">
          <div className="text-lg font-bold text-orange-400 tabular-nums">
            <CountValue target={6} trigger={trigger} duration={1.5} />
          </div>
          <div className="text-[10px] text-white/35">quartiers actifs</div>
        </div>
        <div className="w-px h-8 bg-white/[0.07]" />
        <div className="text-center">
          <div className="text-lg font-bold text-orange-400 tabular-nums">
            <CountValue target={94} suffix="%" trigger={trigger} duration={1.8} />
          </div>
          <div className="text-[10px] text-white/35">emplois locaux</div>
        </div>
        <div className="w-px h-8 bg-white/[0.07]" />
        <div className="text-center">
          <div className="text-lg font-bold text-orange-400 tabular-nums">
            <CountValue target={3} suffix="x" trigger={trigger} duration={1.5} />
          </div>
          <div className="text-[10px] text-white/35">salaire minimum</div>
        </div>
      </div>
    </div>
  );
}

// ─── BLOC 6 : BANDE PLEINE LARGEUR ───────────────────────────────────────────
function BlockBanner() {
  const { onOpenChange } = useRegisterModal();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Côté gauche */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green-500/70">
          La boucle est bouclée
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          Un seul geste.{" "}
          <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
            Un impact infini.
          </span>
        </h3>
      </div>

      {/* Séparateur vertical */}
      <div className="hidden sm:block w-px self-stretch bg-white/[0.07]" />

      {/* Métriques rapides */}
      <div className="flex items-center gap-8 md:gap-12">
        {[
          { val: "12 400+", label: "utilisateurs actifs" },
          { val: "100%",    label: "déchets valorisés" },
          { val: "≥ 95",    label: "score Lighthouse" },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-0.5">
            <span className="text-xl md:text-2xl font-black text-white">{m.val}</span>
            <span className="text-[10px] text-white/35 text-center leading-tight">{m.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onOpenChange(true)}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shrink-0",
          "bg-green-600 hover:bg-green-500 text-white font-semibold text-sm",
          "shadow-[0_0_24px_rgba(22,163,74,0.35)] hover:shadow-[0_0_40px_rgba(22,163,74,0.55)]",
          "border border-green-500/25 transition-all duration-300"
        )}
      >
        Rejoindre GreenLoop
        <ArrowUpRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────
export function FeaturesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const id = useId();
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Stagger container pour l'entrée de la grille
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
  };

  // Variante de chaque cellule — surcharge l'animation de GlowCard
  // GlowCard gère déjà son propre whileInView, on le laisse travailler.
  // Le stagger est appliqué via le prop `delay` de GlowCard.

  const STAGGER_DELAYS = [0, 0.09, 0.18, 0.27, 0.36, 0.45];

  return (
    <section
      ref={sectionRef}
      id="pourquoi-greenloop"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-[#030a06] overflow-hidden"
    >
      {/* ── FOND DÉCORATIF ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute top-[5%] right-[-10%] w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* ── EN-TÊTE ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-green-500/40" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-green-500/80">
              Pourquoi GreenLoop
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-white">Une solution conçue pour </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              changer les habitudes
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/45 max-w-[540px] mx-auto leading-relaxed">
            GreenLoop réunit technologie, économie circulaire et impact social
            dans une plateforme pensée pour les villes africaines.
          </p>
        </motion.div>

        {/* ── BENTO GRID ──────────────────────────────────────────────────── */}
        {/*
          Desktop (≥ lg) : grille 12 colonnes
            Ligne 1 : Bloc écologique (7 col) + Récompenses (5 col)
            Ligne 2 : Collecte (4 col) + Circulaire (4 col) + Emplois (4 col)
            Ligne 3 : Bannière (12 col)
          Mobile : colonne unique pleine largeur
        */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-auto"
          )}
        >
          {/* ── BLOC 1 : Impact écologique (7 col) ──────────────────────── */}
          <div className="lg:col-span-7">
            <GlowCard
              className="h-full min-h-[360px] p-7"
              glowColor="#22c55e"
              delay={STAGGER_DELAYS[0]}
            >
              <BlockEcological trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 2 : Récompenses (5 col) ────────────────────────────── */}
          <div className="lg:col-span-5">
            <GlowCard
              className="h-full min-h-[360px] p-7"
              glowColor="#fbbf24"
              delay={STAGGER_DELAYS[1]}
            >
              <BlockRewards trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 3 : Collecte simplifiée (4 col) ────────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#818cf8"
              delay={STAGGER_DELAYS[2]}
            >
              <BlockSimplicity />
            </GlowCard>
          </div>

          {/* ── BLOC 4 : Économie circulaire (4 col) ────────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#34d399"
              delay={STAGGER_DELAYS[3]}
            >
              <BlockCircular trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 5 : Emplois locaux (4 col) ─────────────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#fb923c"
              delay={STAGGER_DELAYS[4]}
            >
              <BlockJobs trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 6 : Bannière pleine largeur (12 col) ───────────────── */}
          <div className="lg:col-span-12">
            <GlowCard
              className="w-full p-6 md:p-8"
              glowColor="#16a34a"
              delay={STAGGER_DELAYS[5]}
            >
              <BlockBanner />
            </GlowCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}