/**
 * Configuration de la vidéo « Voir comment ça marche ».
 *
 * C'est le SEUL fichier à modifier pour brancher la vraie vidéo.
 * Renseigne `src` ci-dessous selon la source :
 *
 *   • YouTube  →  type: "youtube", src: "https://www.youtube.com/embed/VIDEO_ID"
 *   • Vimeo    →  type: "vimeo",   src: "https://player.vimeo.com/video/VIDEO_ID"
 *   • Fichier  →  type: "file",    src: "/videos/greengas-demo.mp4"
 *                 (place alors le fichier dans public/videos/)
 *
 * Tant que `src` est vide, la modale affiche un visuel soigné
 * « vidéo bientôt disponible » — la structure est déjà en place.
 */

export type VideoSource = "youtube" | "vimeo" | "file";

export interface VideoConfig {
  /** Type de source. Ignoré si `src` est vide. */
  type: VideoSource;
  /** URL d'embed (YouTube / Vimeo) ou chemin du fichier (auto-hébergé). */
  src: string;
  /** Titre affiché dans l'en-tête de la modale. */
  title: string;
  /** Description courte affichée sous le titre. */
  description: string;
  /** Durée indicative (badge). Laisse vide pour masquer. */
  duration: string;
}

export const VIDEO: VideoConfig = {
  type: "file",
  src: "/videos/greengas-demo.mp4", // ← colle ici le lien ou le chemin de la vidéo
  title: "Présentation de GreenGas en 2 minutes",
  description:
    "Du bac de tri du citoyen à l'énergie injectée sur le réseau : suivez le parcours d'un dépôt, du scan à la valorisation.",
  duration: "3 min",
};

/** La vidéo est-elle prête à être diffusée ? */
export const hasVideo = VIDEO.src.trim().length > 0;
