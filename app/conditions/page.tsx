import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Conditions d'utilisation du site vitrine GreenGas — projet SIREXE 2026 de l'équipe DEDSEC.",
};

export default function ConditionsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation" updated="12 octobre 2026">
      <LegalSection title="Objet">
        <p>
          Les présentes conditions encadrent l&apos;utilisation du site vitrine
          <strong className="text-white/80"> GreenGas</strong>, une démonstration
          pédagogique présentée dans le cadre du concours SIREXE 2026 par l&apos;équipe
          DEDSEC.
        </p>
      </LegalSection>

      <LegalSection title="Accès au site">
        <p>
          Le site est accessible gratuitement, sans garantie de disponibilité continue.
          L&apos;équipe DEDSEC peut le modifier, le suspendre ou l&apos;interrompre à tout
          moment, notamment à l&apos;issue du concours.
        </p>
      </LegalSection>

      <LegalSection title="Site vitrine et application">
        <p>
          Ce site est une <strong className="text-white/80">vitrine</strong> : il ne
          permet pas de créer un compte. L&apos;inscription et l&apos;espace citoyen se
          font dans l&apos;application mobile GreenGas, accessible via le lien de
          téléchargement. Les interfaces et chiffres présentés ici sont des
          <strong className="text-white/80"> simulations</strong> à but de démonstration
          et n&apos;ont aucune valeur contractuelle.
        </p>
      </LegalSection>

      <LegalSection title="Utilisation acceptable">
        <p>
          Vous vous engagez à ne pas perturber le fonctionnement du site, à ne pas tenter
          d&apos;en extraire des données de manière abusive et à respecter la législation
          en vigueur.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les éléments du site sont protégés. Toute réutilisation sans autorisation est
          interdite, sauf mention contraire ou usage pédagogique citant la source.
        </p>
      </LegalSection>

      <LegalSection title="Limitation de responsabilité">
        <p>
          Les informations publiées, y compris les chiffres et estimations, sont fournies
          à titre indicatif. L&apos;équipe DEDSEC ne saurait être tenue responsable d&apos;un
          dommage résultant de l&apos;utilisation du site ou de l&apos;interprétation de ses
          contenus.
        </p>
      </LegalSection>

      <LegalSection title="Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit ivoirien. Tout litige relève des
          juridictions compétentes d&apos;Abidjan, Côte d&apos;Ivoire.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
