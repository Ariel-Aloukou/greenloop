import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Halos décoratifs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-green-600/10 blur-3xl"
      />

      <div className="relative text-center max-w-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-600/15 border border-green-500/30 mb-6">
          <Flame className="w-7 h-7 text-green-400" strokeWidth={1.8} />
        </div>

        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-400 mb-3">
          Erreur 404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
          Cette page s&apos;est volatilisée
        </h1>
        <p className="text-white/50 leading-relaxed mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Revenez à
          l&apos;accueil pour explorer la chaîne de valeur GreenGas.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
