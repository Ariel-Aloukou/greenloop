"use client";

import { useRef, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";
import { useState } from "react";
import {
  UserPlus,
  QrCode,
  Truck,
  Coins,
  ArrowRight,
  Check,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

// ─── DONNÉES ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    index: 0,
    number: "01",
    label: "Je crée mon compte",
    description:
      "J'ouvre un compte GreenGas et je rejoins le bac de mon foyer ou de mon immeuble — un point fixe partagé par un petit groupe de ménages, identifié par un code unique.",
    detail: "Compte GreenGas · Rattaché à un bac",
    Icon: UserPlus,
    accent: "#4ade80",
    tag: "Inscription",
    bullets: [
      "Compte citoyen gratuit",
      "Rattachement à un bac partagé",
      "Un code unique par bac",
    ],
  },
  {
    index: 1,
    number: "02",
    label: "Je scanne mon dépôt",
    description:
      "Avant de jeter mes déchets, je scanne le code du bac depuis mon téléphone. C'est la seule action demandée au quotidien : pas de tri à faire, pas de matériel à récupérer, pas d'agent à croiser.",
    detail: "Scan du bac · 2 scans/jour maximum",
    Icon: QrCode,
    accent: "#22c55e",
    tag: "Dépôt",
    bullets: [
      "Un scan avant de déposer",
      "Aucun tri à faire chez soi",
      "Le scan mesure la participation",
    ],
  },
  {
    index: 2,
    number: "03",
    label: "GreenGas relève et pèse",
    description:
      "Quand le bac est plein, l'équipe de collecte GreenGas le relève et le pèse globalement. La tournée est automatiquement rattachée au site de son secteur, sans calcul supplémentaire.",
    detail: "Relève · Pesée globale du bac",
    Icon: Truck,
    accent: "#16a34a",
    tag: "Collecte",
    bullets: [
      "Le bac est pesé une seule fois",
      "Orientation vers un site de méthanisation",
      "Poids capturé par le simulateur de pesée",
    ],
  },
  {
    index: 3,
    number: "04",
    label: "Les points sont répartis",
    description:
      "Le poids du bac est réparti entre les affiliés au prorata de leurs dépôts scannés, puis multiplié par le coefficient de la filière et la qualité du lot. Celui qui a déposé tous les jours reçoit une part proportionnelle à sa contribution.",
    detail: "GreenPoints · Au prorata des dépôts",
    Icon: Coins,
    accent: "#86efac",
    tag: "Répartition",
    bullets: [
      "Répartition selon les dépôts réels",
      "Un plafond quotidien évite les abus",
      "Crédit automatique après le tri",
    ],
  },
] as const;

// Plage de scroll dédiée à chaque étape dans la fenêtre [0, 1]
// L'étape i est "active" entre i/4 et (i+1)/4, avec transition sur 0.06 de chaque côté
const stepRange = (i: number): [number, number] => [i / 4, (i + 1) / 4];
const activationThreshold = (i: number): number => i / 4 + 0.04;

// ─── LIGNE DE TIMELINE ────────────────────────────────────────────────────────

function TimelineLine({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const scaleY = useTransform(scrollProgress, [0, 0.95], [0, 1]);
  const smoothScaleY = useSpring(scaleY, { stiffness: 80, damping: 24, mass: 0.6 });

  return (
    <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
      {/* Fond statique de la ligne */}
      <div className="absolute inset-0 bg-foreground/[0.05]" />
      {/* Ligne animée qui descend */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{
          scaleY: smoothScaleY,
          background:
            "linear-gradient(to bottom, #4ade80, #22c55e 40%, #16a34a 75%, #14532d)",
          boxShadow: "0 0 8px rgba(74,222,128,0.35)",
        }}
      />
    </div>
  );
}

// ─── ICÔNE ANIMÉE ─────────────────────────────────────────────────────────────

function AnimatedIcon({
  Icon,
  accent,
  isActive,
  isComplete,
}: {
  Icon: (typeof STEPS)[number]["Icon"];
  accent: string;
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <motion.div
      animate={
        isActive
          ? { scale: 1.08, rotate: 0 }
          : isComplete
          ? { scale: 1, rotate: 0 }
          : { scale: 0.94, rotate: -4 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="relative"
    >
      {/* Halo pulsant quand actif */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `${accent}30` }}
        />
      )}

      {/* Conteneur de l'icône */}
      <motion.div
        className={cn(
          "relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center",
          "border transition-all duration-500"
        )}
        animate={{
          backgroundColor: isActive
            ? `${accent}18`
            : isComplete
            ? `${accent}0e`
            : "rgba(255,255,255,0.03)",
          borderColor: isActive
            ? `${accent}60`
            : isComplete
            ? `${accent}35`
            : "rgba(255,255,255,0.07)",
          boxShadow: isActive
            ? `0 0 24px ${accent}25, inset 0 1px 0 ${accent}20`
            : "none",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          animate={{
            color: isActive ? accent : isComplete ? `${accent}cc` : "#ffffff55",
          }}
          transition={{ duration: 0.4 }}
        >
          <Icon
            className="w-6 h-6"
            strokeWidth={isActive ? 2 : 1.6}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── POINT DE TIMELINE ────────────────────────────────────────────────────────

function TimelineDot({
  isActive,
  isComplete,
  accent,
}: {
  isActive: boolean;
  isComplete: boolean;
  accent: string;
  number: string;
}) {
  return (
    <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
      {/* Cercle extérieur pulsant */}
      {isActive && (
        <motion.div
          className="absolute w-8 h-8 rounded-full"
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `${accent}40` }}
        />
      )}

      {/* Cercle principal */}
      <motion.div
        className="absolute w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center"
        animate={{
          borderColor: isActive ? accent : isComplete ? `${accent}aa` : "#ffffff20",
          backgroundColor: isActive
            ? `${accent}30`
            : isComplete
            ? `${accent}15`
            : "transparent",
          scale: isActive ? 1 : 0.85,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {isComplete && !isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check
              className="w-2.5 h-2.5"
              style={{ color: accent }}
              strokeWidth={3}
            />
          </motion.div>
        )}
        {isActive && (
          <motion.div
            className="w-2 h-2 rounded-full"
            animate={{ scale: [1, 0.7, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: accent }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ─── CARTE D'ÉTAPE ────────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  isActive,
  isComplete,
  isLeft,
  scrollProgress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  isActive: boolean;
  isComplete: boolean;
  isLeft: boolean;
  scrollProgress: MotionValue<number>;
}) {
  const [start, end] = stepRange(index);

  const rawOpacity = useTransform(
    scrollProgress,
    [Math.max(0, start - 0.05), start + 0.1, end + 0.08, end + 0.2],
    [0, 1, 1, 0.38]
  );
  const opacity = useSpring(rawOpacity, { stiffness: 70, damping: 22 });

  const rawY = useTransform(
    scrollProgress,
    [Math.max(0, start - 0.05), start + 0.1],
    [36, 0]
  );
  const y = useSpring(rawY, { stiffness: 70, damping: 20 });

  return (
    <motion.div
      style={{ opacity, y }}
      className="w-full min-w-0"
    >
      <div
        className={cn(
          "relative group rounded-[1.4rem] p-6 md:p-8 break-words",
          "border border-foreground/[0.07] bg-foreground/[0.025] backdrop-blur-xl",
          "transition-all duration-700",
          isActive && "border-foreground/[0.13] bg-foreground/[0.04]",
          isComplete && !isActive && "border-foreground/[0.07]"
        )}
        style={
          isActive
            ? {
                boxShadow: `0 0 0 1px ${step.accent}28, 0 24px 64px rgba(0,0,0,0.35), inset 0 1px 0 ${step.accent}12`,
              }
            : {}
        }
      >
        {/* Glow de fond sur la carte active */}
        <motion.div
          className="absolute inset-0 rounded-[1.4rem] pointer-events-none"
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(280px at ${isLeft ? "85% 20%" : "15% 20%"}, ${step.accent}10, transparent 70%)`,
          }}
        />

        {/* En-tête */}
        <div className="relative z-10 flex items-start gap-4 mb-5">
          <AnimatedIcon
            Icon={step.Icon}
            accent={step.accent}
            isActive={isActive}
            isComplete={isComplete}
          />

          <div className="flex-1 min-w-0 pt-1">
            {/* Tag + numéro */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <motion.span
                className="text-[10px] font-semibold tracking-[0.16em] uppercase px-2 py-0.5 rounded-full"
                animate={{
                  color: isActive ? step.accent : "#ffffff50",
                  backgroundColor: isActive ? `${step.accent}18` : "rgba(255,255,255,0.04)",
                  borderColor: isActive ? `${step.accent}40` : "rgba(255,255,255,0.07)",
                }}
                transition={{ duration: 0.45 }}
                style={{ border: "1px solid" }}
              >
                {step.tag}
              </motion.span>
              <span className="text-[11px] font-mono text-foreground/20">{step.number}</span>
            </div>

            {/* Titre */}
            <motion.h3
              className="text-lg md:text-[1.2rem] font-semibold leading-tight"
              animate={{ color: isActive ? "#ffffff" : isComplete ? "#ffffffcc" : "#ffffff80" }}
              transition={{ duration: 0.45 }}
            >
              {step.label}
            </motion.h3>
          </div>
        </div>

        {/* Description */}
        <motion.p
          className="relative z-10 text-sm md:text-[0.9rem] leading-[1.72] mb-5"
          animate={{ color: isActive ? "#ffffffaa" : "#ffffff50" }}
          transition={{ duration: 0.45 }}
        >
          {step.description}
        </motion.p>

        {/* Bullets */}
        <ul className="relative z-10 space-y-2">
          {step.bullets.map((bullet, bi) => (
            <motion.li
              key={bi}
              className="flex items-start gap-2.5 text-[12.5px]"
              animate={{ opacity: isActive ? 1 : isComplete ? 0.55 : 0.28 }}
              transition={{ duration: 0.45, delay: bi * 0.05 }}
            >
              <motion.span
                className="mt-[3px] w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                animate={{
                  backgroundColor: isActive ? `${step.accent}25` : "rgba(255,255,255,0.05)",
                  borderColor: isActive ? `${step.accent}60` : "rgba(255,255,255,0.1)",
                }}
                style={{ border: "1px solid" }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{ backgroundColor: isActive ? step.accent : "#ffffff40" }}
                  transition={{ duration: 0.4 }}
                />
              </motion.span>
              <span className="text-foreground/60 leading-relaxed">{bullet}</span>
            </motion.li>
          ))}
        </ul>

        {/* Pied de carte : métadonnée */}
        <motion.div
          className="relative z-10 mt-5 pt-4 flex items-center gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          animate={{ opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowRight
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: isActive ? step.accent : "#ffffff40" }}
          />
          <span className="text-[11.5px] font-medium text-foreground/45">{step.detail}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── NUMÉRO DE PAS FLOTTANT (desktop timeline center) ────────────────────────

function StepRow({
  step,
  isActive,
  isComplete,
  scrollProgress,
}: {
  step: (typeof STEPS)[number];
  isActive: boolean;
  isComplete: boolean;
  scrollProgress: MotionValue<number>;
}) {
  const isLeft = step.index % 2 === 0;

  return (
    <div className="relative flex items-start md:items-center gap-6 md:gap-0">
      {/* ── MOBILE : point + carte empilée ─────────────────────────────── */}
      <div className="flex md:hidden items-start gap-5 w-full">
        {/* Point de timeline mobile */}
        <div className="relative flex flex-col items-center pt-1 shrink-0">
          <TimelineDot
            isActive={isActive}
            isComplete={isComplete}
            accent={step.accent}
            number={step.number}
          />
        </div>

        {/* Carte mobile */}
        <StepCard
          step={step}
          index={step.index}
          isActive={isActive}
          isComplete={isComplete}
          isLeft={false}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* ── DESKTOP : alternance gauche / droite ─────────────────────── */}
      <div className="hidden md:flex w-full items-start relative">
        {/* Côté gauche (index pair) */}
        <div className="w-[calc(50%-2rem)] flex justify-end">
          {isLeft && (
            <StepCard
              step={step}
              index={step.index}
              isActive={isActive}
              isComplete={isComplete}
              isLeft={true}
              scrollProgress={scrollProgress}
            />
          )}
        </div>

        {/* Centre : point de timeline */}
        <div className="w-16 flex flex-col items-center shrink-0 pt-7 relative z-10">
          <TimelineDot
            isActive={isActive}
            isComplete={isComplete}
            accent={step.accent}
            number={step.number}
          />
        </div>

        {/* Côté droit (index impair) */}
        <div className="w-[calc(50%-2rem)] flex justify-start">
          {!isLeft && (
            <StepCard
              step={step}
              index={step.index}
              isActive={isActive}
              isComplete={isComplete}
              isLeft={false}
              scrollProgress={scrollProgress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION PRINCIPALE ───────────────────────────────────────────────────────

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const id = useId();

  // Scroll progress sur la section entière
  // offset: "start 85%" → la section commence à s'activer dès qu'elle entre
  //          "end 15%"  → se termine bien avant de quitter
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 15%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.8,
  });

  // État d'activation de chaque étape dérivé du scroll
  const [activeIndex, setActiveIndex] = useState(-1);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    // L'étape la plus récemment dépassée son seuil d'activation est l'active
    let current = -1;
    for (let i = 0; i < STEPS.length; i++) {
      if (v >= activationThreshold(i)) current = i;
    }
    setActiveIndex(current);
  });

  // Titre section : reveal depuis le bas
  const titleOpacity = useTransform(smoothProgress, [0, 0.08], [0, 1]);
  const titleY = useTransform(smoothProgress, [0, 0.08], [30, 0]);
  const titleOpacitySpring = useSpring(titleOpacity, { stiffness: 80, damping: 22 });
  const titleYSpring = useSpring(titleY, { stiffness: 80, damping: 22 });

  return (
    <section
      ref={sectionRef}
      id="comment-ca-marche"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-background overflow-hidden"
    >
      {/* ── FOND DÉCORATIF ──────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* Halo vert gauche */}
        <div
          className="absolute top-[15%] left-[-20%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,163,74,0.09) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Halo vert droit */}
        <div
          className="absolute bottom-[10%] right-[-15%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Séparateurs */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">

        {/* ── EN-TÊTE DE SECTION ──────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: titleOpacitySpring, y: titleYSpring }}
          className="text-center mb-20 md:mb-28"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-green-500/40" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-green-500/80">
              Processus
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-foreground">Comment ça </span>
            <span
              className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent"
            >
              marche ?
            </span>
          </h2>

          <p className="text-base md:text-lg text-foreground/45 max-w-[520px] mx-auto leading-relaxed">
            En quatre étapes, GreenGas transforme chaque dépôt en matière
            traçable et en GreenPoints, du bac du citoyen jusqu&apos;au
            biodigesteur.
          </p>
        </motion.div>

        {/* ── TIMELINE ────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Ligne verticale */}
          <TimelineLine scrollProgress={smoothProgress} />

          {/* Étapes */}
          <div className="relative flex flex-col gap-14 md:gap-20 pl-14 md:pl-0">
            {STEPS.map((step) => (
              <StepRow
                key={step.number}
                step={step}
                isActive={activeIndex === step.index}
                isComplete={activeIndex > step.index}
                scrollProgress={smoothProgress}
              />
            ))}
          </div>
        </div>

        {/* ── BANDE DE PROGRESSION EN BAS ─────────────────────────────────── */}
        <motion.div
          className="mt-20 md:mt-28 flex flex-col items-center gap-6"
          style={{
            opacity: useSpring(
              useTransform(smoothProgress, [0.7, 0.88], [0, 1]),
              { stiffness: 80, damping: 22 }
            ),
            y: useSpring(
              useTransform(smoothProgress, [0.7, 0.88], [20, 0]),
              { stiffness: 80, damping: 22 }
            ),
          }}
        >
          <div className="flex items-center gap-3 md:gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4">
                {/* Pill d'étape */}
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium"
                  animate={{
                    borderColor:
                      activeIndex >= i ? `${step.accent}50` : "rgba(255,255,255,0.08)",
                    backgroundColor:
                      activeIndex >= i ? `${step.accent}12` : "rgba(255,255,255,0.03)",
                    color: activeIndex >= i ? step.accent : "rgba(255,255,255,0.3)",
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    animate={{
                      backgroundColor: activeIndex >= i ? step.accent : "rgba(255,255,255,0.2)",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  {step.number}
                </motion.div>

                {/* Connecteur entre pills */}
                {i < STEPS.length - 1 && (
                  <motion.div
                    className="h-px w-5 md:w-8 rounded-full hidden sm:block"
                    animate={{
                      backgroundColor:
                        activeIndex > i ? "#22c55e60" : "rgba(255,255,255,0.08)",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
            ))}
          </div>

          <p className="text-[12px] text-foreground/28 text-center">
            {activeIndex < 0
              ? "Faites défiler pour découvrir le processus"
              : activeIndex < STEPS.length - 1
              ? `Étape ${activeIndex + 1} sur ${STEPS.length} — continuez à défiler`
              : "Processus complet — bienvenue dans GreenGas"}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
