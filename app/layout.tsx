import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/app/components/layout/SmoothScroll";
import { Navbar } from "@/app/components/layout/Navbar";
import { MotionProvider } from "@/app/components/layout/MotionProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GreenGas — Transformer nos déchets en énergie",
    template: "%s | GreenGas",
  },
  description:
    "GreenGas est la chaîne d'approvisionnement numérique de la méthanisation : collecter, peser et tracer la matière organique du bac du citoyen jusqu'au kilowattheure produit. Projet SIREXE 2026 — équipe DEDSEC, Abidjan.",
  keywords: [
    "GreenGas",
    "méthanisation",
    "biogaz",
    "biodigesteur",
    "infrastructure énergétique",
    "économie circulaire",
    "valorisation déchets",
    "GreenPoints",
    "Côte d'Ivoire",
    "Abidjan",
    "SIREXE 2026",
    "DEDSEC",
    "énergie",
    "traceabilité",
  ],
  authors: [{ name: "DEDSEC" }],
  creator: "DEDSEC",
  publisher: "GreenGas",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "GreenGas — La chaîne d'approvisionnement de la méthanisation",
    description:
      "Du bac du citoyen au kilowattheure produit : GreenGas garantit au biodigesteur une matière qualifiée, régulière et traçable. Abidjan, Côte d'Ivoire.",
    locale: "fr_CI",
    type: "website",
    siteName: "GreenGas",
  },
  twitter: {
    card: "summary_large_image",
    title: "GreenGas — La chaîne d'approvisionnement de la méthanisation",
    description:
      "Du bac du citoyen au kilowattheure produit : une matière organique qualifiée, régulière et traçable. Abidjan, Côte d'Ivoire.",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030a06] text-[#f8fafc] overflow-x-hidden">
        <MotionProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </SmoothScroll>
          <Toaster />
        </MotionProvider>
      </body>
    </html>
  );
}
