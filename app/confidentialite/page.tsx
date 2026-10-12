import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment GreenGas traite vos données : simulation locale, absence de traceurs publicitaires et exercice de vos droits.",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="12 octobre 2026">
      <LegalSection title="En résumé">
        <p>
          GreenGas est une <strong className="text-white/80">démonstration</strong>. Les
          informations que vous saisissez dans le formulaire d&apos;inscription ou dans
          l&apos;espace citoyen restent <strong className="text-white/80">dans votre
          navigateur</strong> et ne sont transmises à aucun serveur.
        </p>
      </LegalSection>

      <LegalSection title="Données collectées">
        <p>
          Lorsque vous utilisez le formulaire d&apos;inscription, les champs suivants
          peuvent être saisis : nom, adresse e-mail et numéro de téléphone (facultatif).
          Ces données sont enregistrées uniquement dans le stockage local de votre
          navigateur (<code className="text-green-400/80">localStorage</code>) afin de faire
          fonctionner la simulation d&apos;espace citoyen.
        </p>
        <p>
          Aucune base de données distante n&apos;est alimentée et aucune donnée n&apos;est
          partagée avec des tiers.
        </p>
      </LegalSection>

      <LegalSection title="Finalité et base légale">
        <p>
          Les données servent exclusivement à illustrer le parcours utilisateur (points de
          fidélité, historique simulé). Le traitement repose sur votre consentement, que
          vous pouvez retirer à tout moment en vous déconnectant ou en effaçant les données
          de votre navigateur.
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les données persistent dans votre navigateur jusqu&apos;à votre déconnexion
          (« Se déconnecter ») ou la suppression manuelle du stockage local. Nous
          n&apos;en conservons aucune copie de notre côté.
        </p>
      </LegalSection>

      <LegalSection title="Cookies et traceurs">
        <p>
          Le site n&apos;utilise ni cookie publicitaire ni traceur d&apos;analyse tiers.
          Seul le stockage local strictement nécessaire au fonctionnement de la
          démonstration est utilisé.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement
          des informations vous concernant. Comme elles restent sur votre appareil, vous
          pouvez les exercer directement (déconnexion, effacement du stockage local).
          Pour toute question :
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
