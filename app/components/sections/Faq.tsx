"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Flame } from "lucide-react";
import { cn } from "@/app/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne GreenGas ?",
    answer:
      "Vous ouvrez un compte gratuit et vous êtes rattaché à un bac partagé, identifié par un code unique. Avant de déposer, vous scannez ce code (deux scans par jour maximum). Quand le bac est plein, l'équipe de collecte le relève et le pèse, puis l'opérateur saisit les poids triés par filière. Cette saisie déclenche automatiquement le calcul des GreenPoints de chaque bac et l'envoi de la matière organique vers le site de méthanisation du secteur.",
  },
  {
    question: "À quoi servent les GreenPoints ?",
    answer:
      "Les GreenPoints récompensent la participation régulière au geste de dépôt. Le poids d'un bac est réparti entre ses affiliés au prorata de leurs dépôts scannés, puis ajusté selon la filière et la qualité du lot. Ils s'échangent contre des récompenses : crédit téléphonique, forfaits internet, réductions et bons chez des partenaires. Un catalogue de démonstration est disponible dans l'interface citoyen.",
  },
  {
    question: "Le scan prouve-t-il que j'ai réellement déposé ?",
    answer:
      "Non — et nous le disons clairement : le scan mesure la participation, pas la preuve physique du dépôt. Pour limiter les abus, un compte par foyer avec vérification par téléphone, la validation par un référent de résidence et un indicateur « kg par scan » par bac signalent les comportements incohérents. En V2, un couvercle qui s'ouvre au scan liera directement le geste au dépôt.",
  },
  {
    question: "D'où viennent les chiffres d'énergie affichés ?",
    answer:
      "Ce sont des hypothèses de démonstration, entièrement paramétrables dans le système : 0,1 m³ de biogaz par kg de matière organique, une répartition de 70 % en cogénération, 20 % en cuisson et 10 % non valorisé, puis de l'électricité et de la chaleur selon des coefficients ajustables. Notre objectif est la traçabilité de bout en bout, pas la précision d'un site donné : chaque coefficient est à sourcer puis à calibrer sur un pilote réel.",
  },
  {
    question: "Qu'est-ce qui est réel et qu'est-ce qui est simulé ?",
    answer:
      "Le calcul, les règles métier et le tableau de bord sont réels. La pesée embarquée au moment de la collecte et les mesures des digesteurs sont simulées dans le prototype. Chaque indicateur est étiqueté Mesuré, Estimé ou Simulé, avec une légende visible : nous préférons l'annoncer plutôt que de laisser le doute s'installer.",
  },
  {
    question: "Comment détectez-vous une panne de digesteur ?",
    answer:
      "En comparant la production mesurée à la production attendue, calculée à partir de la matière organique reçue. Si l'écart dépasse le seuil du site, une alerte est créée automatiquement — par exemple 32 m³ attendus contre 22,4 m³ mesurés, soit −30 %. Les alertes persistantes sont regroupées sous une même alerte tant qu'elles ne sont pas résolues. En démo, le compteur de gaz est simulé ; en réel, ce sera un capteur.",
  },
  {
    question: "Comment le projet sera-t-il financé ?",
    answer:
      "Plusieurs pistes structurent le modèle économique : un partenaire institutionnel, des industriels engagés et la revente de l'énergie ou des matières valorisables (électricité, chaleur, digestat agricole). Le prototype ne fait aucune promesse de distribution : la distribution et la vente d'énergie supposent des autorisations qui restent à confirmer.",
  },
  {
    question: "Qui porte GreenGas ?",
    answer:
      "GreenGas est un projet de l'équipe DEDSEC présenté au SIREXE Hackathon 2026, à Abidjan, en Côte d'Ivoire. La ville pilote est découpée en trois secteurs de collecte fixes, chacun rattaché en permanence à l'un des trois sites de méthanisation : Secteur Nord → Site A, Secteur Est → Site B, Secteur Ouest → Site C.",
  },
];

export function Faq() {
  const id = useId();

  return (
    <section
      id="faq"
      aria-labelledby={`${id}-title`}
      className="relative py-28 md:py-40 bg-[#030a06] overflow-hidden"
    >
      {/* Fond */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        <div
          className="absolute bottom-[15%] left-[-20%] w-[550px] h-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(22,163,74,0.07) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10">
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
              Questions fréquentes
            </span>
            <div className="h-px w-8 bg-green-500/40" />
          </div>

          <h2
            id={`${id}-title`}
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight mb-5"
          >
            <span className="text-white">Vous avez des questions ? </span>
            <span className="bg-gradient-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
              Nous avons les réponses
            </span>
          </h2>

          <p className="text-base md:text-lg text-white/45 max-w-[500px] mx-auto leading-relaxed">
            Tout ce que vous devez savoir avant de découvrir l&apos;écosystème
            GreenGas.
          </p>
        </motion.div>

        {/* Accordéon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion.Root
            type="single"
            collapsible
            className="flex flex-col gap-3"
          >
            {FAQ_ITEMS.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className={cn(
                  "group rounded-[1.2rem] border border-white/[0.07] bg-white/[0.02]",
                  "transition-all duration-300",
                  "data-[state=open]:border-green-500/25 data-[state=open]:bg-green-950/15"
                )}
              >
                <Accordion.Header>
                  <Accordion.Trigger
                    className={cn(
                      "flex items-center justify-between w-full px-6 py-5 md:px-7 md:py-5",
                      "text-left cursor-pointer",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40 rounded-[1.2rem]"
                    )}
                  >
                    <span className="text-sm md:text-base font-semibold text-white/80 group-data-[state=open]:text-white transition-colors duration-300 pr-4">
                      {item.question}
                    </span>
                    <motion.div
                      className="shrink-0 w-6 h-6 rounded-lg border border-white/[0.1] flex items-center justify-center group-data-[state=open]:border-green-500/30 group-data-[state=open]:bg-green-500/10 transition-all duration-300"
                    >
                      <Plus className="w-3.5 h-3.5 text-white/40 group-data-[state=open]:text-green-400 group-data-[state=open]:rotate-45 transition-all duration-300" />
                    </motion.div>
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                  <div className="px-6 pb-6 md:px-7 md:pb-6 pt-0">
                    <p className="text-sm md:text-[0.95rem] text-white/50 leading-[1.8] max-w-[680px]">
                      {item.answer}
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          {/* Pied de section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-3 mt-12"
          >
            <Flame className="w-4 h-4 text-green-500/50" strokeWidth={1.6} />
            <p className="text-[13px] text-white/35 text-center">
              Pas de réponse à votre question ? Contactez-nous sur{" "}
              <a
                href="mailto:contact@greengas.ci"
                className="text-green-400/70 hover:text-green-400 underline underline-offset-2 transition-colors"
              >
                contact@greengas.ci
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Keyframes pour les animations slideUp/slideDown */}
      <style>{`
        @keyframes slideDown {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes slideUp {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
        [data-state="open"] { animation: slideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
        [data-state="closed"] { animation: slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
      `}</style>
    </section>
  );
}
