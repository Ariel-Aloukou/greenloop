"use client";

import { useId, useCallback, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/app/lib/utils";

const TESTIMONIALS = [
  {
    name: "Aminata Koné",
    role: "Citoyenne, Yopougon",
    avatar: "AK",
    color: "#4ade80",
    text: "Depuis que je trie mes déchets avec GreenLoop, j'ai économisé assez de points pour recharger mon téléphone pendant 3 mois. Mes enfants aussi participent, c'est devenu un jeu familial.",
    impact: "+2 450 points cumulés",
  },
  {
    name: "Jean-Pierre Kouamé",
    role: "Commerçant, Cocody",
    avatar: "JK",
    color: "#22c55e",
    text: "Avant, je voyais mes déchets s'accumuler sans solution. Maintenant, je sais qu'ils sont recyclés et en plus je reçois des bons d'achat pour mon commerce. Tout le monde y gagne.",
    impact: "12 collectes effectuées",
  },
  {
    name: "Fatou Diallo",
    role: "Enseignante, Plateau",
    avatar: "FD",
    color: "#86efac",
    text: "GreenLoop est venu présenter le tri dans mon école. Aujourd'hui, mes élèves collectent et recyclent. Voir leur fierté quand ils gagnent des points, c'est incroyable.",
    impact: "+3 classes participantes",
  },
  {
    name: "Dr. Koffi N'Guessan",
    role: "Centre de recyclage, Abobo",
    avatar: "KN",
    color: "#16a34a",
    text: "En tant que partenaire recycleur, GreenLoop nous fournit un flux régulier de matières triées. La qualité est bien meilleure qu'avant, ce qui simplifie notre travail de transformation.",
    impact: "4,2 t de matière reçue",
  },
  {
    name: "Mariam Traoré",
    role: "Mère de famille, Adjamé",
    avatar: "MT",
    color: "#4ade80",
    text: "Ce qui me plaît, c'est la simplicité. Je sors mes sacs le matin, et le soir j'ai des points. Pas de paperasse, pas de complications. GreenLoop, c'est la solution qu'il nous fallait.",
    impact: "18 kg de déchets triés",
  },
  {
    name: "Lacina Ouattara",
    role: "Agent de collecte, Marcory",
    avatar: "LO",
    color: "#22c55e",
    text: "Avant je roulais au hasard pour ramasser les déchets. Maintenant, l'app me donne un itinéraire optimisé. Je gagne du temps, je consomme moins de carburant et je suis mieux payé.",
    impact: "3,5 L économisés/jour",
  },
];

export function Testimonials() {
  const id = useId();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: true,
  });
  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id="temoignages"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-[#030a06] overflow-hidden"
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
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
              Témoignages
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-white">Ils ont adopté </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              GreenLoop
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/45 max-w-[520px] mx-auto leading-relaxed">
            Découvrez comment nos utilisateurs transforment leurs déchets en
            valeur au quotidien.
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
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 md:pl-6"
                >
                  <div
                    className={cn(
                      "relative h-full rounded-[1.4rem] p-6 md:p-7",
                      "border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl",
                      "hover:border-white/[0.12] transition-all duration-500",
                      "flex flex-col gap-5 min-h-[300px]"
                    )}
                  >
                    {/* Quote icon */}
                    <Quote
                      className="w-8 h-8 opacity-10 text-white shrink-0"
                      strokeWidth={1.2}
                    />

                    {/* Texte */}
                    <p className="text-sm md:text-[0.95rem] text-white/65 leading-[1.8] flex-1">
                      {t.text}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center gap-4 pt-1">
                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          backgroundColor: `${t.color}18`,
                          color: t.color,
                          border: `1px solid ${t.color}30`,
                        }}
                      >
                        {t.avatar}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-white/85 truncate">
                          {t.name}
                        </p>
                        <p className="text-[11px] text-white/40 truncate">
                          {t.role}
                        </p>
                      </div>

                      {/* Badge impact */}
                      <div
                        className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                        style={{
                          backgroundColor: `${t.color}12`,
                          color: t.color,
                          border: `1px solid ${t.color}25`,
                        }}
                      >
                        {t.impact}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={scrollPrev}
              className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300 cursor-pointer"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300 cursor-pointer"
                  aria-label={`Aller au témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300 cursor-pointer"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
