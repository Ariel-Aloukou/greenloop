import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "GreenGas est un site vitrine : aucune donnée personnelle n'est collectée, pas de traceurs publicitaires.",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="12 octobre 2026">
      <LegalSection title="En résumé">
        <p>
          GreenGas est une <strong className="text-white/80">démonstration</strong>. Ce
          site vitrine ne permet pas de créer un compte et ne collecte aucune donnée
          personnelle : rien n&apos;est transmis à un serveur. L&apos;inscription se fait
          dans l&apos;application mobile.
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>
          Le site ne propose ni formulaire d&apos;inscription ni espace connecté. Le champ
          de la newsletter en pied de page est un simple{" "}
          <strong className="text-white/80">exemple d&apos;interface</strong> : la valeur
          saisie n&apos;est ni envoyée ni conservée.
        </p>
        <p>
          Aucune base de données distante n&apos;est alimentée et aucune donnée n&apos;est
          partagée avec des tiers.
        </p>
      </LegalSection>

      <LegalSection title="Finalité et base légale">
        <p>
          Aucun traitement de données personnelles n&apos;est réalisé sur ce site. Les
          contenus présentés servent uniquement à illustrer le projet (parcours utilisateur,
          points de fidélité simulés) dans le cadre du concours SIREXE 2026.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Aucune donnée personnelle n&apos;étant collectée, aucune conservation n&apos;est
          effectuée de notre côté.
        </p>
      </LegalSection>

      <LegalSection title="Cookies et traceurs">
        <p>
          Le site n&apos;utilise ni cookie publicitaire ni traceur d&apos;analyse tiers.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Aucune donnée personnelle n&apos;étant traitée par nos services, il n&apos;y a
          pas de données à consulter, rectifier ou effacer de notre côté. Pour toute
          question :
          {" "}
          <a
            href="mailto:contact@greengas.ci"
            className="text-green-400/80 hover:text-green-400 underline underline-offset-2"
          >
            contact@greengas.ci
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
