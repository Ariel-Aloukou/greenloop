"use client";

import { useRef, useState, useId } from "react";
import { motion, useInView, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import {
  Coins,
  QrCode,
  TrendingUp,
  Download,
  Zap,
  MapPin,
  Route,
  Gauge,
  Recycle,
  CircleDot,
  AlertTriangle,
  Smartphone,
  Wifi,
  Gift,
} from "lucide-react";
import { GlowCard } from "@/app/components/ui/GlowCard";
import { cn } from "@/app/lib/utils";
import { APP_DOWNLOAD_URL } from "@/app/lib/links";

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
    <div className="flex h-14 w-full items-stretch gap-1.5">
      {BAR_DATA.map((d, i) => {
        const pct = d.val / BAR_MAX;
        const isLast = i === BAR_DATA.length - 1;
        return (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
            {/* Piste à hauteur définie : indispensable pour que la hauteur
                en pourcentage de la barre se résolve correctement. */}
            <div className="relative flex w-full flex-1 items-end">
              <motion.div
                className="w-full rounded-t-sm origin-bottom"
                style={{
                  height: `${pct * 100}%`,
                  background: isLast
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
            </div>
            <span className="text-[8px] text-foreground/25 hidden sm:block">{d.month}</span>
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
    { label: "Organique → biogaz", pct: 0.45, color: "#22c55e" },
    { label: "Biomasse → chaleur", pct: 0.25, color: "#4ade80" },
    { label: "Recyclables",        pct: 0.30, color: "#86efac" },
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
        <span className="text-[10px] font-bold text-foreground leading-none">100%</span>
        <span className="text-[7px] text-foreground/35 leading-none mt-0.5">orienté</span>
      </div>
    </div>
  );
}

// ─── WALLET DE POINTS (Récompenses) ──────────────────────────────────────────
const REWARDS = [
  { icon: Smartphone, label: "Crédit d'appel",       pts: 500,  color: "#4ade80" },
  { icon: Wifi,       label: "Forfait internet",     pts: 1200, color: "#22c55e" },
  { icon: Gift,       label: "Réductions & cadeaux", pts: 2000, color: "#86efac" },
];

function RewardWallet({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {REWARDS.map((r, i) => {
        const Icon = r.icon;
        return (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 16 }}
            animate={trigger ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.12, ease: EASE_OUT_EXPO }}
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl",
              "border border-foreground/[0.07] bg-foreground/[0.04]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4" style={{ color: r.color }} strokeWidth={1.9} />
              <span className="text-[12px] text-foreground/65 font-medium">{r.label}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Coins className="w-3 h-3" style={{ color: r.color }} />
              <span className="text-[12px] font-semibold" style={{ color: r.color }}>
                {r.pts.toLocaleString("fr-FR")} pts
              </span>
            </div>
          </motion.div>
        );
      })}
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

// ─── BLOC 1 : CHAÎNE ÉNERGÉTIQUE (col-span-7) ────────────────────────────────
function BlockEcological({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col h-full gap-5">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <AnimIcon icon={Zap} color="#4ade80" bgColor="rgba(74,222,128,0.1)" size="lg" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green-500/70 mb-1">
              De la matière à l&apos;énergie
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
              Du bac au kilowattheure,
              <br />
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                une chaîne continue
              </span>
            </h3>
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="flex flex-col gap-2 shrink-0 text-right">
          <div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              <CountValue target={170} suffix=" kWh" trigger={trigger} />
            </div>
            <div className="text-[10px] text-foreground/40">électricité / tonne</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400 tabular-nums">
              <CountValue target={340} suffix=" kWh" trigger={trigger} />
            </div>
            <div className="text-[10px] text-foreground/40">chaleur / tonne</div>
          </div>
        </div>
      </div>

      {/* Graphique barres */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-foreground/30 font-medium">Matière collectée (tonnes)</span>
          <div className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
            <TrendingUp className="w-3 h-3" />
            vers la cogénération
          </div>
        </div>
        <MiniBarChart trigger={trigger} />
        <span className="text-[9px] text-foreground/25 mt-1">Courbe illustrative · données simulées</span>
      </div>

      {/* Footer */}
      <p className="text-[12.5px] text-foreground/45 leading-relaxed">
        Une tonne de matière organique méthanisée en cogénération fournit de
        l&apos;ordre de{" "}
        <span className="text-foreground/70 font-medium">170 kWh d&apos;électricité</span>{" "}
        et 340 kWh de chaleur. Chaque lot reste relié au biogaz qu&apos;il a produit.
      </p>
    </div>
  );
}

// ─── BLOC 2 : GREENPOINTS (col-span-5) ───────────────────────────────────────
function BlockRewards({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={Coins} color="#fbbf24" bgColor="rgba(251,191,36,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-amber-500/70 mb-0.5">
            GreenPoints
          </p>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Des points qui suivent
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
              la valorisation
            </span>
          </h3>
        </div>
      </div>

      {/* Formule */}
      <div
        className={cn(
          "px-4 py-3.5 rounded-2xl",
          "border border-amber-500/15 bg-amber-950/20"
        )}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase text-amber-400/80 mb-2.5">
          <Zap className="w-3.5 h-3.5" strokeWidth={1.8} />
          Formule
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
          <span className="px-2 py-1 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/80">
            Poids attribué
          </span>
          <span className="text-amber-400 font-bold">×</span>
          <span className="px-2 py-1 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/80">
            Coef. filière
          </span>
          <span className="text-amber-400 font-bold">×</span>
          <span className="px-2 py-1 rounded-lg bg-foreground/[0.05] border border-foreground/[0.08] text-foreground/80">
            Qualité du lot
          </span>
          <span className="text-amber-400 font-bold">=</span>
          <span className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 font-semibold">
            GreenPoints
          </span>
        </div>
      </div>

      {/* Liste récompenses */}
      <RewardWallet trigger={trigger} />

      <div className="mt-auto flex items-center gap-1.5 text-[11px] text-foreground/30">
        <CircleDot className="w-3 h-3 text-green-500/60" />
        Un GreenPoint mesure une contribution réelle à la valorisation
      </div>
    </div>
  );
}

// ─── BLOC 3 : TRAÇABILITÉ (col-span-4) ───────────────────────────────────────
const TRACE_STEPS = [
  { label: "Bac identifié",  sub: "BAC-014 · un code unique"        },
  { label: "Dépôts scannés", sub: "22 dépôts sur la période"        },
  { label: "Bac pesé",       sub: "34 kg · contamination faible"    },
  { label: "Lot orienté",    sub: "ORG-0258 → biodigesteur DIG-01"  },
];

function BlockTraceability() {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-3">
        <AnimIcon icon={QrCode} color="#818cf8" bgColor="rgba(129,140,248,0.1)" size="lg" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-indigo-400/70 mb-0.5">
            Traçabilité
          </p>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Chaque bac reste
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              identifiable
            </span>
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {TRACE_STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2 + i * 0.09, ease: EASE_OUT_EXPO }}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-xl",
              "border border-foreground/[0.06] bg-foreground/[0.03]",
              "hover:border-indigo-500/25 hover:bg-indigo-950/15 transition-all duration-300"
            )}
          >
            <div className="w-5 h-5 rounded-full border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-indigo-400">{i + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-foreground/80 leading-none truncate">
                {s.label}
              </p>
              <p className="text-[11px] text-foreground/35 leading-none mt-0.5">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 text-[11px] text-foreground/30">
        <Route className="w-3 h-3 text-indigo-400/50" />
        Origine, poids, qualité et destination
      </div>
    </div>
  );
}

// ─── BLOC 4 : LE BIODIGESTEUR (col-span-4) ───────────────────────────────────
const READINGS = [
  { value: "1 250 kg", label: "Matière introduite" },
  { value: "118 m³",   label: "Biogaz produit" },
  { value: "62 %",     label: "Méthane (CH₄)" },
  { value: "36 °C",    label: "Température" },
  { value: "640 kg",   label: "Digestat produit" },
  { value: "212 kWh",  label: "Électricité estimée" },
];

function BlockDigester() {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AnimIcon icon={Gauge} color="#34d399" bgColor="rgba(52,211,153,0.1)" size="lg" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-emerald-500/70 mb-0.5">
              Cœur technologique
            </p>
            <h3 className="text-xl font-bold text-foreground leading-tight">
              Le biodigesteur
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                suivi en continu
              </span>
            </h3>
          </div>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase text-amber-300/80 border border-amber-500/25 bg-amber-950/25">
          Simulé
        </span>
      </div>

      {/* Tableau de démonstration */}
      <div className="grid grid-cols-2 gap-2">
        {READINGS.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.06, ease: EASE_OUT_EXPO }}
            className="px-3 py-2 rounded-xl border border-foreground/[0.06] bg-foreground/[0.03]"
          >
            <p className="text-[13px] font-bold text-foreground/90 tabular-nums leading-none">
              {r.value}
            </p>
            <p className="text-[9.5px] text-foreground/35 leading-tight mt-1">{r.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Alerte */}
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-amber-500/20 bg-amber-950/20">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-amber-300/90 leading-tight">
            Écart de production signalé
          </p>
          <p className="text-[10.5px] text-foreground/40 leading-tight mt-0.5">
            Attendu 32 m³ · mesuré 22,4 m³ · −30 %
          </p>
        </div>
      </div>

      <p className="mt-auto text-[12.5px] text-foreground/40 leading-relaxed">
        Le suivi relie en continu ce qui entre dans le digesteur à ce qu&apos;il
        en sort — pour transformer un processus biologique en donnée pilotable.
      </p>
    </div>
  );
}

// ─── BLOC 5 : ORIENTATION DES FLUX (col-span-4) ──────────────────────────────
const SECTEURS = [
  { name: "Secteur Nord",  site: "Site A" },
  { name: "Secteur Est",   site: "Site B" },
  { name: "Secteur Ouest", site: "Site C" },
];

function BlockOrientation({ trigger }: { trigger: boolean }) {
  const segments = [
    { label: "Organique → biogaz", pct: 45, color: "#22c55e" },
    { label: "Biomasse → chaleur", pct: 25, color: "#4ade80" },
    { label: "Recyclables",        pct: 30, color: "#86efac" },
  ];

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AnimIcon icon={Recycle} color="#fb923c" bgColor="rgba(251,146,60,0.1)" size="lg" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-orange-500/70 mb-0.5">
              Orientation
            </p>
            <h3 className="text-xl font-bold text-foreground leading-tight">
              Trois filières,
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                trois valorisations
              </span>
            </h3>
          </div>
        </div>
        <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase text-foreground/40 border border-foreground/[0.1] bg-foreground/[0.03]">
          Illustratif
        </span>
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
              <span className="text-[11px] text-foreground/55 flex-1 truncate">{s.label}</span>
              <span className="text-[11px] font-semibold text-foreground/70 tabular-nums">
                {s.pct}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Affectation des sites */}
      <div className="mt-auto flex flex-col gap-1.5">
        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/30">
          Affectation des sites
        </p>
        {SECTEURS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, x: 8 }}
            animate={trigger ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
            transition={{ duration: 0.4, delay: 0.65 + i * 0.08, ease: EASE_OUT_EXPO }}
            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border border-foreground/[0.06] bg-foreground/[0.02]"
          >
            <span className="flex items-center gap-2 text-[11.5px] text-foreground/60">
              <MapPin className="w-3 h-3 text-orange-400/60" />
              {s.name}
            </span>
            <span className="text-[10px] font-semibold text-orange-300/80 px-2 py-0.5 rounded-full border border-orange-500/20 bg-orange-950/20">
              {s.site}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── BLOC 6 : BANDE PLEINE LARGEUR ───────────────────────────────────────────
function BlockBanner() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      {/* Côté gauche */}
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-green-500/70">
          Du déchet à la ressource
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          Collecter · tracer · orienter.{" "}
          <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
            Chaque flux compte.
          </span>
        </h3>
      </div>

      {/* Séparateur vertical */}
      <div className="hidden sm:block w-px self-stretch bg-foreground/[0.07]" />

      {/* Métriques rapides */}
      <div className="flex items-center gap-8 md:gap-12">
        {[
          { val: "1 t",     label: "≈ 100 m³ de biogaz" },
          { val: "170 kWh", label: "d'électricité / tonne" },
          { val: "3",       label: "sites de méthanisation" },
        ].map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-0.5">
            <span className="text-xl md:text-2xl font-black text-foreground">{m.val}</span>
            <span className="text-[10px] text-foreground/35 text-center leading-tight">{m.label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <motion.a
        href={APP_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl shrink-0",
          "bg-green-600 hover:bg-green-500 text-white font-semibold text-sm",
          "shadow-[0_0_24px_rgba(22,163,74,0.35)] hover:shadow-[0_0_40px_rgba(22,163,74,0.55)]",
          "border border-green-500/25 transition-all duration-300"
        )}
      >
        Télécharger l&apos;app
        <Download className="w-4 h-4" />
      </motion.a>
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
      id="pourquoi-greengas"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-background overflow-hidden"
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
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
              Pourquoi GreenGas
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-foreground">Une solution conçue pour </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              alimenter la méthanisation
            </span>
          </h2>

          <p className="text-base md:text-lg text-foreground/45 max-w-[540px] mx-auto leading-relaxed">
            GreenGas réunit collecte, traçabilité et suivi énergétique dans une
            plateforme pensée pour sécuriser l&apos;approvisionnement d&apos;un
            site de méthanisation.
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
          {/* ── BLOC 1 : Chaîne énergétique (7 col) ─────────────────────── */}
          <div className="lg:col-span-7">
            <GlowCard
              className="h-full min-h-[360px] p-7"
              glowColor="#22c55e"
              delay={STAGGER_DELAYS[0]}
            >
              <BlockEcological trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 2 : GreenPoints (5 col) ────────────────────────────── */}
          <div className="lg:col-span-5">
            <GlowCard
              className="h-full min-h-[360px] p-7"
              glowColor="#fbbf24"
              delay={STAGGER_DELAYS[1]}
            >
              <BlockRewards trigger={inView} />
            </GlowCard>
          </div>

          {/* ── BLOC 3 : Traçabilité (4 col) ────────────────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#818cf8"
              delay={STAGGER_DELAYS[2]}
            >
              <BlockTraceability />
            </GlowCard>
          </div>

          {/* ── BLOC 4 : Le biodigesteur (4 col) ────────────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#34d399"
              delay={STAGGER_DELAYS[3]}
            >
              <BlockDigester />
            </GlowCard>
          </div>

          {/* ── BLOC 5 : Orientation des flux (4 col) ───────────────────── */}
          <div className="lg:col-span-4">
            <GlowCard
              className="h-full min-h-[300px] p-7"
              glowColor="#fb923c"
              delay={STAGGER_DELAYS[4]}
            >
              <BlockOrientation trigger={inView} />
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