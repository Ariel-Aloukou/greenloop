"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus, Recycle } from "lucide-react";
import { cn } from "@/app/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Comment fonctionne GreenLoop ?",
    answer:
      "Vous vous inscrivez gratuitement sur l'application, vous triez vos déchets chez vous (plastique, carton, organique), et GreenLoop les collecte selon le calendrier de votre quartier. Chaque kilogramme collecté vous rapporte des GreenPoints échangeables contre des récompenses.",
  },
  {
    question: "Combien de points puis-je gagner par mois ?",
    answer:
      "Un foyer actif peut gagner entre 500 et 2 000 GreenPoints par mois selon la quantité et la qualité du tri. À titre indicatif, 25 points sont attribués par kilogramme de déchets correctement triés. Les participants réguliers reçoivent également des bonus de fidélité.",
  },
  {
    question: "Que puis-je faire avec mes GreenPoints ?",
    answer:
      "Les GreenPoints s'échangent contre du crédit téléphonique (MTN, Orange, Moov), des bons d'achat chez nos partenaires locaux, des réductions chez les commerçants du quartier, des tickets de transport, ou des arbres plantés en votre nom. Un catalogue évolutif est disponible dans l'application.",
  },
  {
    question: "Quels types de déchets sont acceptés ?",
    answer:
      "Nous acceptons le plastique (bouteilles, emballages), le carton et le papier, le verre, le métal, et les déchets organiques (épluchures, restes alimentaires). Un guide de tri détaillé est fourni dans votre kit de bienvenue et sur l'application GreenLoop.",
  },
  {
    question: "Y a-t-il un coût pour utiliser GreenLoop ?",
    answer:
      "Non, l'inscription et l'utilisation de GreenLoop sont entièrement gratuites pour les citoyens. Le kit de tri de démarrage est offert dès votre première collecte. GreenLoop est financée par la vente des matières recyclées et les partenariats avec les collectivités et entreprises.",
  },
  {
    question: "Comment se passe la collecte ?",
    answer:
      "Vous recevez une notification la veille du passage de l'équipe de collecte. Il vous suffit de déposer vos sacs triés devant votre porte le matin de la collecte. L'agent scanne un QR code pour valider la collecte, et les points sont crédités instantanément sur votre compte.",
  },
  {
    question: "GreenLoop est-il disponible dans toute l'Afrique ?",
    answer:
      "GreenLoop a été lancé à Abidjan, en Côte d'Ivoire, et couvre actuellement les communes de Yopougon, Cocody, Adjamé, Marcory et Treichville. Nous prévoyons d'étendre le service à d'autres villes africaines d'ici 2027.",
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
            Tout ce que vous devez savoir avant de rejoindre l&apos;aventure GreenLoop.
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
            <Recycle className="w-4 h-4 text-green-500/50" strokeWidth={1.6} />
            <p className="text-[13px] text-white/35 text-center">
              Pas de réponse à votre question ? Contactez-nous sur{" "}
              <a
                href="mailto:contact@greenloop.ci"
                className="text-green-400/70 hover:text-green-400 underline underline-offset-2 transition-colors"
              >
                contact@greenloop.ci
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
