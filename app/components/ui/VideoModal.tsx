"use client";

import { useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X, Play, Film, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { VIDEO, hasVideo, type VideoSource } from "@/app/lib/video";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Détermine le type MIME d'un fichier auto-hébergé. */
function videoMime(src: string): string {
  const clean = src.split("?")[0].toLowerCase();
  if (clean.endsWith(".webm")) return "video/webm";
  if (clean.endsWith(".ogv") || clean.endsWith(".ogg")) return "video/ogg";
  return "video/mp4";
}

/** Extrait l'ID d'une URL YouTube (tous formats) et renvoie l'URL d'embed. */
function youtubeEmbed(src: string): string {
  const trimmed = src.trim();
  const patterns = [
    /youtu\.be\/([\w-]{6,})/i,
    /youtube\.com\/watch\?[^#]*\bv=([\w-]{6,})/i,
    /youtube\.com\/embed\/([\w-]{6,})/i,
    /youtube\.com\/shorts\/([\w-]{6,})/i,
  ];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  // L'utilisateur a peut-être collé directement l'ID
  if (/^[\w-]{6,}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  return src;
}

/** Extrait l'ID d'une URL Vimeo (tous formats) et renvoie l'URL d'embed. */
function vimeoEmbed(src: string): string {
  const trimmed = src.trim();
  const match = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  if (/^\d+$/.test(trimmed)) return `https://player.vimeo.com/video/${trimmed}`;
  return src;
}

/** Ajoute les paramètres de lecture (autoplay, etc.) à l'URL d'embed. */
function withAutoplay(url: string, type: VideoSource): string {
  const separator = url.includes("?") ? "&" : "?";
  const params =
    type === "youtube"
      ? "autoplay=1&rel=0&modestbranding=1"
      : "autoplay=1&title=0&byline=0&portrait=0";
  return `${url}${separator}${params}`;
}

/** Construit l'URL d'embed finale selon le type de source. */
function buildEmbedSrc(): string {
  if (!hasVideo) return "";
  if (VIDEO.type === "file") return VIDEO.src;

  const base =
    VIDEO.type === "youtube" ? youtubeEmbed(VIDEO.src) : vimeoEmbed(VIDEO.src);
  return withAutoplay(base, VIDEO.type);
}

export function VideoModal({
  open,
  onOpenChange,
  onFallback,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Appelé quand aucun vidéo n'est configurée et que l'utilisateur veut voir les étapes. */
  onFallback?: () => void;
}) {
  const id = useId();
  const embedSrc = buildEmbedSrc();

  const handleFallback = () => {
    onOpenChange(false);
    onFallback?.();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[9998] bg-[#030a06]/85 backdrop-blur-md"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.4, ease: EASE }}
            aria-describedby={`${id}-desc`}
            className={cn(
              "fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100%-2rem)] max-w-3xl overflow-hidden",
              "rounded-2xl border border-white/[0.1] bg-[#051009]",
              "shadow-[0_40px_120px_rgba(0,0,0,0.7)] focus:outline-none"
            )}
          >
            {/* Glow décoratif */}
            <div
              className="absolute -top-24 -right-16 w-56 h-56 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(22,163,74,0.16) 0%, transparent 65%)",
                filter: "blur(30px)",
              }}
              aria-hidden
            />

            {/* En-tête */}
            <div className="relative z-10 flex items-center gap-3 px-5 py-4 md:px-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/20 flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 text-green-400 fill-current ml-0.5" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="text-base md:text-lg font-bold text-white truncate">
                  {VIDEO.title}
                </Dialog.Title>
                <Dialog.Description
                  id={`${id}-desc`}
                  className="text-[12px] md:text-[13px] text-white/40 truncate"
                >
                  {VIDEO.description}
                </Dialog.Description>
              </div>

              {hasVideo && VIDEO.duration && (
                <span className="hidden sm:inline-flex items-center gap-1 ml-auto mr-10 px-2.5 py-1 rounded-full text-[11px] text-white/50 border border-white/[0.08] bg-white/[0.04] shrink-0">
                  <Clock className="w-3 h-3" />
                  {VIDEO.duration}
                </span>
              )}

              <Dialog.Close className="absolute top-4 right-4 w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            {/* Lecteur / visuel */}
            <div className="relative z-10 px-5 pb-5 md:px-6 md:pb-6">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                {hasVideo ? (
                  VIDEO.type === "file" ? (
                    <video
                      className="absolute inset-0 w-full h-full object-contain bg-black"
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      aria-label={VIDEO.title}
                    >
                      <source src={VIDEO.src} type={videoMime(VIDEO.src)} />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  ) : (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={embedSrc}
                      title={VIDEO.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )
                ) : (
                  <Placeholder onFallback={onFallback ? handleFallback : undefined} />
                )}
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Visuel affiché tant qu'aucune vidéo n'est configurée. */
function Placeholder({ onFallback }: { onFallback?: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
      {/* Fond */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(22,163,74,0.16) 0%, transparent 60%), linear-gradient(180deg, #04120a 0%, #030a06 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <span className="relative inline-flex items-center justify-center w-16 h-16 rounded-full border border-green-500/25 bg-green-500/10">
          <span className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
          <Film className="relative w-6 h-6 text-green-400" strokeWidth={1.6} />
        </span>
        <p className="text-white font-semibold text-sm md:text-base">
          Vidéo de présentation — bientôt disponible
        </p>
        <p className="text-white/40 text-[12px] md:text-[13px] max-w-md leading-relaxed">
          L&apos;équipe DEDSEC finalise la vidéo. En attendant, découvre les 4
          étapes de la chaîne GreenGas.
        </p>
        {onFallback && (
          <button
            onClick={onFallback}
            className={cn(
              "mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "font-semibold text-[13px] text-white cursor-pointer",
              "bg-green-600 hover:bg-green-500 transition-colors duration-300",
              "shadow-[0_0_24px_rgba(22,163,74,0.3)] border border-green-500/25",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/40"
            )}
          >
            Découvrir les 4 étapes
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
