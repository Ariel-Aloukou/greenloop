"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Veuillez entrer votre email")
    .email("Email invalide"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

const FOOTER_LINKS = [
  {
    title: "Produit",
    links: [
      { label: "Comment ça marche", href: "#comment-ca-marche" },
      { label: "Pourquoi GreenGas", href: "#pourquoi-greengas" },
      { label: "Espace citoyen", href: "#tableau-de-bord" },
      { label: "Réseau de collecte", href: "#tableau-de-bord" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Projet",
    links: [
      { label: "Équipe DEDSEC", href: "#equipe" },
      { label: "SIREXE 2026", href: "#" },
      { label: "Modèle économique", href: "#faq" },
      { label: "Partenaires", href: "#" },
      { label: "Presse", href: "#" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Conditions", href: "/conditions" },
      { label: "Cookies", href: "/confidentialite" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export function Footer() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  // Note: C'est un placeholder frontend — aucune donnée n'est envoyée.
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Merci de votre inscription !", {
      description: "Vous recevrez bientôt nos actualités.",
    });
    reset();
  };

  return (
    <footer
      id="footer"
      className="relative bg-[#030a06] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand + Newsletter — 2 colonnes */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4">
                <Image
                  src="/logo.png"
                  alt="GreenGas"
                  width={982}
                  height={148}
                  className="h-7 md:h-8 w-auto rounded-md"
                />
              </div>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                GreenGas est la chaîne d&apos;approvisionnement numérique de la
                méthanisation : collecter, tracer et orienter la matière
                organique, du bac du citoyen au kilowattheure produit.
              </p>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-3">
                Newsletter
              </h3>
              <p className="text-xs text-white/30 mb-4 leading-relaxed">
                Recevez les actualités GreenGas et l&apos;avancement du projet
                de méthanisation.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-2"
              >
                <div className="relative">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="votre@email.com"
                    className={cn(
                      "w-full px-4 py-3 pr-12 rounded-xl text-sm bg-white/[0.04] border text-white/80 placeholder:text-white/20",
                      "focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all duration-300",
                      errors.email
                        ? "border-red-500/40 focus:ring-red-500/30"
                        : "border-white/[0.08] hover:border-white/[0.15]"
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "absolute right-1.5 top-1/2 -translate-y-1/2",
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      "bg-green-500/80 hover:bg-green-500 disabled:opacity-40",
                      "transition-all duration-300"
                    )}
                    aria-label="S'inscrire à la newsletter"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400/80"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>

          {/* Liens — 3 colonnes */}
          {FOOTER_LINKS.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h3 className="text-[13px] font-semibold tracking-[0.15em] uppercase text-white/50 mb-4">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-white/35 hover:text-white/70",
                        "transition-colors duration-200"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Barre inférieure */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cn(
            "pt-8 mt-8 border-t border-white/[0.06]",
            "flex flex-col md:flex-row items-center justify-between gap-4"
          )}
        >
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} GreenGas — Équipe DEDSEC · SIREXE
            2026. Tous droits réservés.
          </p>

          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-white/25 hover:text-white/50 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
