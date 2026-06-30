import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/app/components/layout/SmoothScroll";
import { Navbar } from "@/app/components/layout/Navbar";
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
  title: "GreenLoop — Transformons les déchets en opportunités",
  description:
    "GreenLoop récompense les habitants qui trient leurs déchets et participe à construire des villes africaines plus propres. Rejoignez le mouvement.",
  openGraph: {
    title: "GreenLoop — Économie circulaire & collecte intelligente",
    description:
      "La première plateforme qui transforme vos déchets en récompenses. Abidjan, Côte d'Ivoire.",
    locale: "fr_CI",
    type: "website",
  },
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
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
