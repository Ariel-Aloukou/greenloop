/**
 * Configuration de la vidéo « Voir comment ça marche ».
 *
 * C'est le SEUL fichier à modifier pour brancher la vraie vidéo.
 * Colle simplement le lien de ta vidéo dans `src` — tous les formats
 * courants sont reconnus et convertis automatiquement :
 *
 *   • YouTube →  https://youtu.be/XXXXXXXXXXX
 *                https://www.youtube.com/watch?v=XXXXXXXXXXX
 *                https://www.youtube.com/shorts/XXXXXXXXXXX
 *                (ou juste l'ID : XXXXXXXX)
 *   • Vimeo   →  https://vimeo.com/XXXXXXXXX   (mets alors type: "vimeo")
 *   • Fichier →  /videos/mon-fichier.mp4        (mets alors type: "file")
 *                ⚠️ Non recommandé sur Vercel : le fichier devrait être
 *                versionné (> 100 Mo impossible sur GitHub) ou hébergé ailleurs.
 *
 * Tant que `src` est vide, la modale affiche un visuel soigné
 * « vidéo bientôt disponible » — la structure est déjà en place.
 *
 * Astuce : pour tester en local avec le fichier fourni, utilise
 *   type: "file", src: "/videos/greengas-demo.mp4"
 */

export type VideoSource = "youtube" | "vimeo" | "file";

export interface VideoConfig {
  /** Type de source. Ignoré si `src` est vide. */
  type: VideoSource;
  /** Lien de la vidéo (YouTube / Vimeo) ou chemin du fichier (auto-hébergé). */
  src: string;
  /** Titre affiché dans l'en-tête de la modale. */
  title: string;
  /** Description courte affichée sous le titre. */
  description: string;
  /** Durée indicative (badge). Laisse vide pour masquer. */
  duration: string;
}

export const VIDEO: VideoConfig = {
  type: "youtube",
  // ↓ Colle ici le lien de ta vidéo (n'importe quel format YouTube/Vimeo)
  src: "",
  title: "Présentation de GreenGas en 2 minutes",
  description:
    "Du bac de tri du citoyen à l'énergie injectée sur le réseau : suivez le parcours d'un dépôt, du scan à la valorisation.",
  duration: "3 min",
};

/** La vidéo est-elle prête à être diffusée ? */
export const hasVideo = VIDEO.src.trim().length > 0;
