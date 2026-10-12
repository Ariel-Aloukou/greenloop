"use client";

import { useRef, useState, useId, useCallback, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  LayoutDashboard,
  History,
  Gift,
  Map,
  User,
  Settings,
  Bell,
  Search,
  Coins,
  PackageCheck,
  Loader2,
  CheckCircle2,
  Sparkles,
  Calendar,
  Flame,
  QrCode,
  TrendingUp,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
  Mail,
  Phone,
  LogOut,
  Shield,
  Smartphone,
  Zap,
  CircleDot,
  Users,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import type { ActivityEntry } from "@/app/lib/auth-context";

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface InteractiveDashboardProps {
  userName?: string;
  userPoints?: number;
  userActivity?: ActivityEntry[];
  onCollectionComplete?: (pts: number) => void;
}

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

type CollectionState = "idle" | "searching" | "validating" | "success";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Tableau de bord", active: true },
  { icon: History,         label: "Historique",       active: false },
  { icon: Gift,            label: "Récompenses",       active: false },
  { icon: Map,             label: "Réseau",            active: false },
  { icon: User,            label: "Profil",            active: false },
  { icon: Settings,        label: "Paramètres",        active: false },
] as const;

const CHART_DATA = [
  { month: "Jan", depots: 24, poids: 14 },
  { month: "Fév", depots: 30, poids: 18 },
  { month: "Mar", depots: 27, poids: 16 },
  { month: "Avr", depots: 38, poids: 22 },
  { month: "Mai", depots: 34, poids: 20 },
  { month: "Jun", depots: 44, poids: 26 },
  { month: "Jul", depots: 41, poids: 24 },
] as const;

const CHART_MAX = 50;

const COLLECTION_STEPS: Record<
  Exclude<CollectionState, "idle">,
  { label: string; duration: number }
> = {
  searching:  { label: "Localisation du bac…",           duration: 1450 },
  validating: { label: "Enregistrement du dépôt…",       duration: 1100 },
  success:    { label: "Dépôt enregistré",               duration: 0    },
};

const RECENT_ACTIVITY: ActivityEntry[] = [
  { label: "Dépôt scanné",    zone: "BAC-014 · Résidence Atlantic", pts: "+186 pts", time: "Il y a 2h", iconName: "QrCode", color: "#4ade80" },
  { label: "Points échangés", zone: "Crédit téléphonique",          pts: "−1200 pts", time: "Hier",      iconName: "Gift",   color: "#fbbf24" },
  { label: "Dépôt scanné",    zone: "BAC-014 · Résidence Atlantic", pts: "+142 pts", time: "Il y a 6j", iconName: "QrCode", color: "#4ade80" },
];

// ─── UTILITAIRE : COMPTEUR ANIMÉ ─────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1.2) {
  const mv = useMotionValue(target);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString("fr-FR"));
  const [display, setDisplay] = useState(() => Math.round(target).toLocaleString("fr-FR"));

  useEffect(() => {
    const controls = animate(mv, target, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", setDisplay);
    return () => { controls.stop(); unsub(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

// ─── QR CODE SVG GÉNÉRÉ (pattern déterministe pseudo-aléatoire) ──────────────

function generateQrMatrix(seed: string, size = 21): boolean[][] {
  // Générateur pseudo-aléatoire déterministe basé sur le seed (LCG simple)
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const next = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };

  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Motifs de positionnement (coins façon vrai QR code)
  const drawFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
        const isCore = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        matrix[oy + y][ox + x] = isBorder || isCore;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Remplissage pseudo-aléatoire du reste, en évitant les zones des finders
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inTopLeft     = x < 8 && y < 8;
      const inTopRight    = x >= size - 8 && y < 8;
      const inBottomLeft  = x < 8 && y >= size - 8;
      if (inTopLeft || inTopRight || inBottomLeft) continue;
      matrix[y][x] = next() > 0.56;
    }
  }

  return matrix;
}

function QrCodeSvg({ seed, size = 156 }: { seed: string; size?: number }) {
  const gridSize = 21;
  const matrix = useMemo(() => generateQrMatrix(seed, gridSize), [seed]);
  const cell = size / gridSize;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg overflow-hidden"
      role="img"
      aria-label="Code du bac (simulation)"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {matrix.map((row, y) =>
        row.map((filled, x) =>
          filled ? (
            <motion.rect
              key={`${x}-${y}`}
              x={x * cell}
              y={y * cell}
              width={cell}
              height={cell}
              fill="#052e16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.25,
                delay: (x + y) * 0.0035,
                ease: "easeOut",
              }}
            />
          ) : null
        )
      )}
    </svg>
  );
}

// ─── TOOLTIP DE GRAPHIQUE ─────────────────────────────────────────────────────

interface TooltipData {
  x: number;
  y: number;
  month: string;
  depots: number;
  poids: number;
}

function ChartTooltip({ data }: { data: TooltipData | null }) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.94 }}
          transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
          className={cn(
            "absolute z-20 pointer-events-none px-3.5 py-2.5 rounded-xl",
            "border border-white/[0.1] bg-[#051009]/95 backdrop-blur-xl",
            "shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          )}
          style={{
            left: data.x,
            top: data.y,
            transform: "translate(-50%, -115%)",
          }}
        >
          <p className="text-[11px] font-semibold text-white/85 mb-1.5">{data.month} 2026</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="text-[11px] text-white/55">Dépôts scannés</span>
            <span className="text-[11px] font-bold text-green-400 ml-auto tabular-nums">
              {data.depots}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] text-white/55">Poids collecté</span>
            <span className="text-[11px] font-bold text-amber-400 ml-auto tabular-nums">
              {data.poids} kg
            </span>
          </div>
          {/* Pointe du tooltip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-2.5 h-2.5 rotate-45 -mt-1.5"
            style={{
              background: "#051009",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── GRAPHIQUE D'IMPACT (BARRES DOUBLES INTERACTIVES) ────────────────────────

function ImpactChart({ inView }: { inView: boolean }) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(
    (index: number, e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const groupRect = e.currentTarget.getBoundingClientRect();
      setHoveredIndex(index);
      setTooltip({
        x: groupRect.left - containerRect.left + groupRect.width / 2,
        y: groupRect.top - containerRect.top,
        month: CHART_DATA[index].month,
        depots: CHART_DATA[index].depots,
        poids: CHART_DATA[index].poids,
      });
    },
    []
  );

  const handleLeave = useCallback(() => {
    setHoveredIndex(null);
    setTooltip(null);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <ChartTooltip data={tooltip} />

      {/* Lignes de grille horizontales */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full h-px bg-white/[0.05]" />
        ))}
      </div>

      <div className="relative flex items-end justify-between gap-2 md:gap-4 h-52 px-1">
        {CHART_DATA.map((d, i) => {
          const isHovered = hoveredIndex === i;
          const depotsPct = (d.depots / CHART_MAX) * 100;
          const poidsPct = (d.poids / CHART_MAX) * 100;

          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-2.5 cursor-pointer group h-full justify-end"
              onMouseEnter={(e) => handleEnter(i, e)}
              onMouseLeave={handleLeave}
              onMouseMove={(e) => handleEnter(i, e)}
            >
              {/* Paire de barres */}
              <div className="flex items-end gap-1 w-full justify-center h-44">
                <motion.div
                  className="w-[34%] max-w-[16px] rounded-t-[3px] origin-bottom relative"
                  style={{
                    background: isHovered
                      ? "linear-gradient(to top, #16a34a, #4ade80)"
                      : "linear-gradient(to top, #15803d, #22c55e)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: depotsPct / 100 } : { scaleY: 0 }}
                  transition={{ duration: 0.65, delay: 0.15 + i * 0.06, ease: EASE_OUT_EXPO }}
                  whileHover={{ filter: "brightness(1.15)" }}
                />
                <motion.div
                  className="w-[34%] max-w-[16px] rounded-t-[3px] origin-bottom"
                  style={{
                    background: isHovered
                      ? "linear-gradient(to top, #d97706, #fbbf24)"
                      : "linear-gradient(to top, #b45309, #f59e0b)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: poidsPct / 100 } : { scaleY: 0 }}
                  transition={{ duration: 0.65, delay: 0.2 + i * 0.06, ease: EASE_OUT_EXPO }}
                  whileHover={{ filter: "brightness(1.15)" }}
                />
              </div>

              {/* Label mois */}
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isHovered ? "text-white" : "text-white/35"
                )}
              >
                {d.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-5 mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-green-700 to-green-400" />
          <span className="text-[11px] text-white/45">Dépôts scannés</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-amber-700 to-amber-400" />
          <span className="text-[11px] text-white/45">Poids (kg)</span>
        </div>
      </div>
    </div>
  );
}

// ─── SIMULATEUR : SCANNER UN DÉPÔT ───────────────────────────────────────────

function ScanDepositSimulator({
  state,
  onLaunch,
  onReset,
  qrSeed,
}: {
  state: CollectionState;
  onLaunch: () => void;
  onReset: () => void;
  qrSeed: string;
}) {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 overflow-hidden min-h-[280px] flex flex-col">
      {/* Glow décoratif de fond */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="relative z-10 flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-green-500/12 border border-green-500/25 flex items-center justify-center shrink-0">
          <QrCode className="w-4.5 h-4.5 text-green-400" strokeWidth={1.8} />
        </div>
        <div>
          <h4 className="text-[13.5px] font-semibold text-white leading-tight">
            Scanner un dépôt
          </h4>
          <p className="text-[11px] text-white/35 leading-tight">2 scans par jour · simulation</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {/* ── ÉTAT : IDLE ─────────────────────────────────────────────── */}
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between gap-5"
            >
              <p className="text-[12.5px] text-white/45 leading-relaxed">
                Avant de déposer vos déchets, scannez le code du bac. Vos
                GreenPoints sont répartis au prorata de vos dépôts scannés sur
                la période de collecte.
              </p>

              <motion.button
                onClick={onLaunch}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={cn(
                  "inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl",
                  "bg-green-600 hover:bg-green-500 text-white font-semibold text-sm",
                  "shadow-[0_0_24px_rgba(22,163,74,0.3)] hover:shadow-[0_0_36px_rgba(22,163,74,0.5)]",
                  "border border-green-500/25 transition-all duration-300"
                )}
              >
                <QrCode className="w-4 h-4" />
                Scanner le bac
              </motion.button>
            </motion.div>
          )}

          {/* ── ÉTAT : SEARCHING / VALIDATING ──────────────────────────── */}
          {(state === "searching" || state === "validating") && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center justify-center gap-5 py-4"
            >
              <div className="relative w-16 h-16 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-500/20"
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Loader2 className="w-6 h-6 text-green-400 animate-pulse" strokeWidth={1.8} />
              </div>

              <div className="text-center">
                <p className="text-[13px] font-medium text-white/80 mb-1">
                  {COLLECTION_STEPS[state].label}
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  {(["searching", "validating"] as const).map((s) => (
                    <span
                      key={s}
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        s === state ? "w-6 bg-green-400" : "w-1.5 bg-white/15"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAT : SUCCESS ──────────────────────────────────────────── */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex-1 flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4 w-full">
                {/* QR Code */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_EXPO }}
                  className="p-2 bg-white rounded-xl shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                >
                  <QrCodeSvg seed={qrSeed} size={88} />
                </motion.div>

                {/* Statut */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="flex items-center gap-1.5 mb-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-[12.5px] font-semibold text-green-400">
                      Validé
                    </span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32, duration: 0.4 }}
                    className="text-[12px] text-white/65 leading-snug mb-2"
                  >
                    Dépôt enregistré — BAC-014 · Résidence Atlantic
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.38, duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/25"
                  >
                    <span className="text-[13px] font-bold text-green-400 tabular-nums">2</span>
                    <span className="text-[10px] text-white/40">scans / jour</span>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11.5px] text-amber-300/90">
                  +186 GreenPoints estimés, répartis après le tri
                </span>
              </motion.div>

              <motion.button
                onClick={onReset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl mt-1",
                  "border border-white/[0.09] text-white/55 hover:text-white/85",
                  "bg-white/[0.03] hover:bg-white/[0.06] text-[12px] font-medium",
                  "transition-all duration-300"
                )}
              >
                Scanner un nouveau dépôt
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── WIDGET SOLDE DE POINTS ───────────────────────────────────────────────────

function PointsBalanceWidget({ balance }: { balance: number }) {
  const display = useAnimatedCounter(balance, 1.1);

  return (
    <div className="relative rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-950/25 to-transparent p-5 overflow-hidden">
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/25 flex items-center justify-center">
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[11.5px] font-medium text-white/50">Solde GreenPoints</span>
        </div>
      </div>

      <div className="relative z-10 flex items-baseline gap-1.5">
        <motion.span
          key={balance}
          initial={{ y: -4, opacity: 0.6 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-black text-white tabular-nums"
        >
          {display}
        </motion.span>
        <span className="text-[13px] font-medium text-amber-400/80">pts</span>
      </div>

      <div className="relative z-10 flex items-center gap-1.5 mt-2">
        <TrendingUp className="w-3 h-3 text-green-400" />
        <span className="text-[11px] text-green-400 font-medium">≈ {Math.round(balance / 50)} FCFA</span>
        <span className="text-[10px] text-white/30">valeur estimée</span>
      </div>
    </div>
  );
}

// ─── SIDEBAR DE NAVIGATION ────────────────────────────────────────────────────

function DashboardSidebar({ active, onChange }: { active: number; onChange: (i: number) => void }) {
  return (
    <div className="hidden md:flex flex-col items-center gap-1 w-16 shrink-0 py-5 border-r border-white/[0.06]">
      {/* Logo */}
      <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
        <Flame className="w-4.5 h-4.5 text-green-400" />
      </div>

      {NAV_ITEMS.map((item, i) => {
        const Icon = item.icon;
        const isActive = active === i;
        return (
          <button
            key={item.label}
            onClick={() => onChange(i)}
            className="relative w-10 h-10 rounded-xl flex items-center justify-center group"
            aria-label={item.label}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-xl bg-green-500/15 border border-green-500/25"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              className={cn(
                "w-4.5 h-4.5 relative z-10 transition-colors duration-300",
                isActive ? "text-green-400" : "text-white/30 group-hover:text-white/60"
              )}
              strokeWidth={1.8}
            />

            {/* Tooltip label au survol */}
            <span
              className={cn(
                "absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap",
                "bg-[#0a1810] border border-white/10 text-white/80",
                "opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-30"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── BARRE DE STATUT "MACBOOK" ────────────────────────────────────────────────

function DeviceTopBar() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
        <Search className="w-3 h-3 text-white/30" />
        <span className="text-[10.5px] text-white/30">app.greengas.ci/dashboard</span>
      </div>

      <div className="flex items-center gap-3">
        <Signal className="w-3 h-3 text-white/30" />
        <Wifi className="w-3 h-3 text-white/30" />
        <Battery className="w-3.5 h-3.5 text-white/30" />
      </div>
    </div>
  );
}

// ─── HEADER DU TABLEAU DE BORD ────────────────────────────────────────────────

function DashboardHeader({ userName = "Aminata" }: { pointsBalance: number; userName?: string }) {
  const initial = userName.charAt(0).toUpperCase();
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h3 className="text-lg font-bold text-white leading-tight">
          Bonjour, {userName} 👋
        </h3>
        <p className="text-[12px] text-white/35 mt-0.5">
          Voici un aperçu de votre activité GreenGas
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.07] transition-colors duration-200">
          <Bell className="w-4 h-4 text-white/50" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-green-400" />
        </button>

        <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.07]">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            {initial}
          </div>
          <span className="text-[12px] font-medium text-white/70 hidden sm:block">
            {userName}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVITÉ RÉCENTE ─────────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>> = {
  PackageCheck,
  QrCode,
  Gift,
};

function RecentActivity({ items }: { items?: ActivityEntry[] }) {
  const data = items ?? RECENT_ACTIVITY;
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <h4 className="text-[13px] font-semibold text-white/80 mb-4">Activité récente</h4>
      <div className="flex flex-col gap-1">
        {data.map((a, i) => {
          const Icon = ACTIVITY_ICONS[a.iconName];
          return (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 py-2.5",
                i < data.length - 1 && "border-b border-white/[0.05]"
              )}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${a.color}15`, border: `1px solid ${a.color}30` }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" style={{ color: a.color }} strokeWidth={1.8} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-white/75 truncate">{a.label}</p>
                <p className="text-[10.5px] text-white/30 truncate">{a.zone}</p>
              </div>
              <div className="text-right shrink-0">
                <p
                  className="text-[12px] font-semibold tabular-nums"
                  style={{ color: a.pts.startsWith("+") ? "#4ade80" : "#fbbf24" }}
                >
                  {a.pts}
                </p>
                <p className="text-[10px] text-white/25">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VUE HISTORIQUE ────────────────────────────────────────────────────────

function HistoryView({ activities }: { activities?: ActivityEntry[] }) {
  const data = activities ?? RECENT_ACTIVITY;
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
        <h4 className="text-[13.5px] font-semibold text-white/85 mb-1">Historique complet</h4>
        <p className="text-[11px] text-white/35 mb-5">Tous vos dépôts et échanges</p>
        <div className="relative">
          {/* Ligne verticale timeline */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.06]" />
          <div className="flex flex-col gap-0">
            {data.map((a, i) => {
              return (
                <div key={i} className="relative flex items-start gap-4 pb-4 last:pb-0">
                  <div
                    className="relative z-10 w-[15px] h-[15px] rounded-full mt-1.5 shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: `${a.color}20`, border: `2px solid ${a.color}60` }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: a.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium text-white/75">{a.label}</p>
                      <p
                        className="text-[11px] font-semibold tabular-nums"
                        style={{ color: a.pts.startsWith("+") ? "#4ade80" : "#fbbf24" }}
                      >
                        {a.pts}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10.5px] text-white/35">{a.zone}</p>
                      <span className="w-1 h-1 rounded-full bg-white/[0.15]" />
                      <p className="text-[10.5px] text-white/35">{a.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VUE RÉCOMPENSES ───────────────────────────────────────────────────────

const REWARDS = [
  { name: "Crédit Téléphonique 5 000 F", cost: 500, icon: Smartphone, desc: "Valable chez tous les opérateurs" },
  { name: "Recharge Internet 2 Go", cost: 300, icon: Wifi, desc: "Valable 30 jours sur tout réseau" },
  { name: "Bon d'achat alimentaire", cost: 1000, icon: Gift, desc: "Dans les enseignes partenaires" },
  { name: "Batterie Externe 10 000 mAh", cost: 400, icon: Battery, desc: "Charge rapide 18 W" },
];

function RewardsView({ balance }: { balance: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-[13.5px] font-semibold text-white/85">Catalogue Récompenses</h4>
            <p className="text-[11px] text-white/35 mt-0.5">Échangez vos GreenPoints</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <Coins className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[11px] font-bold text-green-400 tabular-nums">{balance} pts</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {REWARDS.map((r, i) => {
            const Icon = r.icon;
            const canAfford = balance >= r.cost;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-xl border p-4 transition-opacity duration-300",
                  canAfford
                    ? "border-white/[0.08] bg-white/[0.025]"
                    : "border-white/[0.04] bg-white/[0.01] opacity-50"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-green-400" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white/80">{r.name}</p>
                    <p className="text-[10px] text-white/35 mt-0.5">{r.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-400 tabular-nums">{r.cost}</span>
                  </div>
                  <button
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10.5px] font-semibold transition-all duration-300",
                      canAfford
                        ? "bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25"
                        : "bg-white/[0.03] text-white/20 border border-white/[0.06] cursor-not-allowed"
                    )}
                    disabled={!canAfford}
                  >
                    {canAfford ? "Échanger" : "Indisponible"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── VUE CARTE ─────────────────────────────────────────────────────────────

const SECTEURS = [
  { name: "Secteur Nord",  site: "Site A", active: true },
  { name: "Secteur Est",   site: "Site B", active: true },
  { name: "Secteur Ouest", site: "Site C", active: true },
];

function MapView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-[13.5px] font-semibold text-white/85">Réseau de collecte</h4>
            <p className="text-[11px] text-white/35 mt-0.5">Secteurs rattachés aux sites · Abidjan</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <CircleDot className="w-3 h-3 text-green-400" />
            <span className="text-[10.5px] font-semibold text-green-400">3 secteurs</span>
          </div>
        </div>

        {/* Carte stylisée */}
        <div className="relative rounded-xl bg-gradient-to-b from-green-950/60 to-emerald-950/40 border border-white/[0.06] overflow-hidden mb-4 aspect-[4/3]">
          {/* Grille décorative */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden>
            <defs>
              <pattern id="grid-map" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-map)" />
          </svg>

          {/* Points lumineux */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/4 h-3/4">
              {SECTEURS.map((z, i) => {
                const x = 15 + (i * 25) % 70;
                const y = 15 + (i * 28 + 7) % 65;
                return (
                  <div
                    key={i}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      z.active
                        ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.4)]"
                        : "bg-white/[0.12]"
                    )} />
                    <span className={cn(
                      "mt-1 text-[9px] font-semibold whitespace-nowrap",
                      z.active ? "text-green-400/80" : "text-white/25"
                    )}>
                      {z.site}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liste des secteurs */}
        <div className="flex flex-col gap-1">
          {SECTEURS.map((z, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  z.active ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" : "bg-white/[0.12]"
                )} />
                <span className="text-[12px] font-medium text-white/70">{z.name}</span>
              </div>
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                z.active
                  ? "text-green-400 bg-green-500/10 border border-green-500/20"
                  : "text-white/20 bg-white/[0.03] border border-white/[0.06]"
              )}>
                {z.active ? z.site : "À venir"}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[10.5px] text-white/30 leading-relaxed">
          Chaque tournée est rattachée au site de son secteur, sans calcul
          supplémentaire.
        </p>
      </div>
    </div>
  );
}

// ─── VUE PROFIL ────────────────────────────────────────────────────────────

function ProfileView({ userName, userActivity }: { userName: string; userActivity?: ActivityEntry[] }) {
  const activities = userActivity ?? RECENT_ACTIVITY;
  const totalCollected = activities.reduce((sum, a) => {
    const pts = parseInt(a.pts);
    return sum + (isNaN(pts) ? 0 : Math.abs(pts));
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
        <h4 className="text-[13.5px] font-semibold text-white/85 mb-5">Mon Profil</h4>

        {/* Avatar + infos */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white/90">{userName}</p>
            <p className="text-[11px] text-white/40">Membre depuis mars 2026</p>
          </div>
        </div>

        {/* Grille d'infos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Email", value: `${userName.toLowerCase().replace(/\s+/g, ".")}@greengas.ci`, icon: Mail },
            { label: "Téléphone", value: "+225 05 12 34 567", icon: Phone },
            { label: "Membre depuis", value: "14 mars 2026", icon: Calendar },
            { label: "Statut", value: "Actif · Vérifié", icon: Shield },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-green-400" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/35">{item.label}</p>
                  <p className="text-[11.5px] font-medium text-white/70 truncate">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mon bac */}
        <div className="mb-4 p-3.5 rounded-xl bg-green-950/20 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <QrCode className="w-3.5 h-3.5 text-green-400" strokeWidth={1.8} />
            </div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-green-500/70">
              Mon bac
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Code", value: "BAC-014" },
              { label: "Résidence", value: "Atlantic · Secteur Nord" },
              { label: "Site de méthanisation", value: "Site A" },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] text-white/35">{item.label}</p>
                <p className="text-[11.5px] font-medium text-white/75">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Dépôts scannés", value: activities.length, icon: QrCode },
            { label: "Points cumulés", value: totalCollected, icon: BarChart3 },
            { label: "Électricité est.", value: `${Math.round(totalCollected * 0.05)} kWh`, icon: Zap },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <Icon className="w-4 h-4 text-green-400 mx-auto mb-1.5" strokeWidth={1.8} />
                <p className="text-[16px] font-bold text-white/90 tabular-nums">{s.value}</p>
                <p className="text-[9.5px] text-white/35 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── VUE PARAMÈTRES ────────────────────────────────────────────────────────

function SettingsView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6">
        <h4 className="text-[13.5px] font-semibold text-white/85 mb-5">Paramètres</h4>

        <div className="flex flex-col gap-1">
          {[
            { label: "Notifications push", desc: "Alertes de collecte et rappels", icon: Bell, toggled: true },
            { label: "Rappels hebdomadaires", desc: "Récapitulatif de votre activité", icon: RefreshCw, toggled: true },
            { label: "Double authentification", desc: "Sécurité renforcée", icon: Shield, toggled: false },
            { label: "Partager mes statistiques", desc: "Classement communautaire", icon: Users, toggled: false },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.025] transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-green-400" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white/75">{item.label}</p>
                    <p className="text-[10px] text-white/35">{item.desc}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-300",
                  item.toggled ? "bg-green-500" : "bg-white/[0.1]"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                    item.toggled ? "left-[18px]" : "left-0.5"
                  )} />
                </div>
              </div>
            );
          })}
        </div>

        <hr className="border-white/[0.06] my-4" />

        {/* Déconnexion */}
        <button className="flex items-center gap-3 w-full py-3 px-3 rounded-xl hover:bg-red-500/5 transition-colors duration-200 group">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <LogOut className="w-3.5 h-3.5 text-red-400" strokeWidth={1.8} />
          </div>
          <span className="text-[12px] font-medium text-red-400">Déconnexion</span>
        </button>

        <p className="text-[10px] text-white/20 text-center mt-4">GreenGas v2.1.0 · données simulées</p>
      </div>
    </div>
  );
}

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────

export function InteractiveDashboard({
  userName: propUserName,
  userPoints,
  userActivity,
  onCollectionComplete,
}: InteractiveDashboardProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const inViewChart = useInView(chartRef, { once: true, margin: "-50px" });

  const userName = propUserName ?? "Aminata";
  const BASE_BALANCE = userPoints ?? 2480;
  const [collectionState, setCollectionState] = useState<CollectionState>("idle");
  const [pointsBalance, setPointsBalance] = useState(BASE_BALANCE);
  const [qrSeed, setQrSeed] = useState("greengas-init");
  const [activeView, setActiveView] = useState(0);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const launchCollection = useCallback(() => {
    clearTimers();
    setCollectionState("searching");

    const t1 = setTimeout(() => {
      setCollectionState("validating");
    }, COLLECTION_STEPS.searching.duration);

    const t2 = setTimeout(() => {
      setCollectionState("success");
      setQrSeed(`greengas-${Date.now()}`);
      const earned = 186;
      setPointsBalance((prev) => prev + earned);
      onCollectionComplete?.(earned);
    }, COLLECTION_STEPS.searching.duration + COLLECTION_STEPS.validating.duration);

    timersRef.current.push(t1, t2);
  }, [clearTimers, onCollectionComplete]);

  const resetCollection = useCallback(() => {
    clearTimers();
    setCollectionState("idle");
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <section
      ref={sectionRef}
      id="tableau-de-bord"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-[#030a06] overflow-hidden"
    >
      {/* ── FOND DÉCORATIF ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(22,163,74,0.1) 0%, transparent 65%)",
            filter: "blur(100px)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* ── EN-TÊTE DE SECTION ──────────────────────────────────────────── */}
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
              Espace citoyen · simulation
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-white">L&apos;application citoyen, </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              en un coup d&apos;œil
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/45 max-w-[560px] mx-auto leading-relaxed">
            Suivez vos dépôts scannés, vos GreenPoints et votre impact estimé
            depuis une interface pensée pour la simplicité. Interface de
            démonstration — données simulées.
          </p>
        </motion.div>

        {/* ── MOCKUP D'APPLICATION ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Glow périphérique du mockup */}
          <div
            className="absolute -inset-4 rounded-[2rem] pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 0%, rgba(22,163,74,0.15), transparent 60%)",
              filter: "blur(30px)",
            }}
          />

          <div
            className={cn(
              "relative rounded-[1.5rem] overflow-hidden",
              "border border-white/[0.1] bg-[#051009]/95 backdrop-blur-2xl",
              "shadow-[0_30px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
            )}
          >
            <DeviceTopBar />

            <div className="flex">
              <DashboardSidebar active={activeView} onChange={setActiveView} />

              {/* ── CONTENU PRINCIPAL DU DASHBOARD ─────────────────────── */}
              <div className="flex-1 min-w-0 p-5 md:p-7">

                {activeView === 0 && (
                  <>
                    <DashboardHeader pointsBalance={pointsBalance} userName={userName} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      {/* Colonne gauche : graphique + activité */}
                      <div className="lg:col-span-2 flex flex-col gap-5">
                        <div
                          ref={chartRef}
                          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 md:p-6"
                        >
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h4 className="text-[13.5px] font-semibold text-white/85">
                                Dépôts scannés et poids collecté
                              </h4>
                              <p className="text-[11px] text-white/35 mt-0.5">
                                Survolez les barres pour le détail
                              </p>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                              <TrendingUp className="w-3 h-3 text-green-400" />
                              <span className="text-[10.5px] font-semibold text-green-400">
                                +24% vs S1
                              </span>
                            </div>
                          </div>
                          <ImpactChart inView={inViewChart} />
                        </div>
                        <RecentActivity items={userActivity} />
                      </div>
                      {/* Colonne droite : points + simulateur */}
                      <div className="flex flex-col gap-5">
                        <PointsBalanceWidget balance={pointsBalance} />
                        <ScanDepositSimulator
                          state={collectionState}
                          onLaunch={launchCollection}
                          onReset={resetCollection}
                          qrSeed={qrSeed}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeView === 1 && <HistoryView activities={userActivity} />}

                {activeView === 2 && <RewardsView balance={pointsBalance} />}

                {activeView === 3 && <MapView />}

                {activeView === 4 && <ProfileView userName={userName} userActivity={userActivity} />}

                {activeView === 5 && <SettingsView />}

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}