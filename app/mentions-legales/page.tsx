import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/app/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site vitrine GreenGas — projet SIREXE 2026 de l'équipe DEDSEC, Abidjan, Côte d'Ivoire.",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updated="12 octobre 2026">
      <LegalSection title="Éditeur du site">
        <p>
          Le site <strong className="text-white/80">greengas.ci</strong> est un site vitrine
          de présentation du projet <strong className="text-white/80">GreenGas</strong>,
          développé par l&apos;équipe <strong className="text-white/80">DEDSEC</strong> dans le
          cadre du concours étudiant <strong className="text-white/80">SIREXE 2026</strong>.
        </p>
        <p>
          Projet à vocation pédagogique et de démonstration. Les contenus, chiffres et
          interfaces présentés ont une valeur illustrative et ne constituent pas une offre
          commerciale.
        </p>
      </LegalSection>

      <LegalSection title="Responsable de la publication">
        <p>
          L&apos;équipe DEDSEC, en qualité de porteuse du projet. Contact :
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

      <LegalSection title="Hébergement">
        <p>
          Le site est hébergé par <strong className="text-white/80">Vercel Inc.</strong>,
          340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis —
          {" "}
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400/80 hover:text-green-400 underline underline-offset-2"
          >
            vercel.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments graphiques, textuels et logiciels du site
          (hors contenus tiers explicitement cités) est produit par l&apos;équipe DEDSEC.
          Toute reproduction sans autorisation est interdite, sauf usage pédagogique avec
          mention de la source.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles et cookies">
        <p>
          Le traitement des données est décrit dans notre politique de confidentialité.
          Le site n&apos;utilise pas de cookies publicitaires ni de traceurs tiers à des
          fins de profilage.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour toute question relative au site ou au projet, écrivez à
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
