"use client";

import { useId, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";

// ─── ÉQUIPE ───────────────────────────────────────────────────────────────────
// Note : les rôles ci-dessous sont provisoires et seront précisés par l'équipe.

const TEAM = [
  {
    name: "Ariel",
    role: "Chef de projet · Développeur full-stack",
    pole: "Direction",
    image: "/img_membres/ariel.png",
    color: "#4ade80",
  },
  {
    name: "Ashley",
    role: "Designer UI/UX",
    pole: "Design",
    image: "/img_membres/ashley.png",
    color: "#86efac",
  },
  {
    name: "Edgar",
    role: "Développeur back-end",
    pole: "Tech",
    image: "/img_membres/edgar.png",
    color: "#22c55e",
  },
  {
    name: "Pethuel",
    role: "Data & logistique de collecte",
    pole: "Data",
    image: "/img_membres/pethuel.png",
    color: "#16a34a",
  },
  {
    name: "Phanuel",
    role: "Communication & opérations",
    pole: "Com",
    image: "/img_membres/phanuel.png",
    color: "#4ade80",
  },
];

export function TeamSection() {
  const id = useId();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id="equipe"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-background overflow-hidden"
    >
      {/* Fond */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute top-[10%] right-[-15%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="h-px w-8 bg-green-500/40" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-green-500/80">
              Équipe DEDSEC
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-foreground">Ils font tourner </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              GreenGas
            </span>
          </h2>

          <p className="text-base md:text-lg text-foreground/45 max-w-[560px] mx-auto leading-relaxed">
            Cinq étudiants de l&apos;IIT derrière le prototype : du code à la
            collecte, une même équipe pour le concours SIREXE 2026.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden -mx-2 md:-mx-3" ref={emblaRef}>
            <div className="flex">
              {TEAM.map((m) => (
                <div
                  key={m.name}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 md:pl-6"
                >
                  <div
                    className={cn(
                      "group relative h-full rounded-[1.4rem] p-6 md:p-7",
                      "border border-foreground/[0.07] bg-foreground/[0.025] backdrop-blur-xl",
                      "hover:border-foreground/[0.12] transition-all duration-500",
                      "flex flex-col items-center text-center gap-5 min-h-[280px]"
                    )}
                  >
                    {/* Photo */}
                    <div className="relative shrink-0">
                      <div
                        className="absolute -inset-2 rounded-[1.4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                        style={{
                          background: `radial-gradient(circle, ${m.color}35, transparent 70%)`,
                        }}
                        aria-hidden
                      />
                      <div
                        className="relative w-24 h-24 rounded-2xl overflow-hidden ring-1 ring-foreground/[0.1]"
                        style={{ boxShadow: `0 0 0 1px ${m.color}22` }}
                      >
                        <Image
                          src={m.image}
                          alt={`Portrait de ${m.name} — ${m.role}`}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Identité */}
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-foreground">{m.name}</p>
                      <p className="text-[12px] text-foreground/45 mt-1 leading-relaxed">
                        {m.role}
                      </p>
                    </div>

                    {/* Pôle */}
                    <span
                      className="mt-auto inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-[0.14em] uppercase"
                      style={{
                        backgroundColor: `${m.color}12`,
                        color: m.color,
                        border: `1px solid ${m.color}25`,
                      }}
                    >
                      {m.pole}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.07] hover:border-foreground/[0.15] transition-all duration-300 cursor-pointer"
              aria-label="Membre précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {TEAM.map((m, i) => (
                <button
                  key={m.name}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="w-1.5 h-1.5 rounded-full bg-foreground/20 hover:bg-foreground/40 transition-all duration-300 cursor-pointer"
                  aria-label={`Aller au membre ${i + 1} (${m.name})`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-xl border border-foreground/[0.08] bg-foreground/[0.03] flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/[0.07] hover:border-foreground/[0.15] transition-all duration-300 cursor-pointer"
              aria-label="Membre suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
