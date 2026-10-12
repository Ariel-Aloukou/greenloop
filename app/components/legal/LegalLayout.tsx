import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Enveloppe commune aux pages légales (mentions, confidentialité, conditions).
 * Assure une mise en page cohérente avec la charte GreenGas.
 */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <article className="relative pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-green-400 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-sm text-white/35 mb-12">Dernière mise à jour : {updated}</p>

        <div className="space-y-10">{children}</div>
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-white/55">{children}</div>
    </section>
  );
}
