# 🔄 GreenLoop — Workflow de Développement Premium

Ce document retrace la feuille de route modulaire pour le développement du site vitrine de **GreenLoop**. L'objectif est d'atteindre un niveau d'interaction et de finition digne de *Stripe*, *Linear* ou *Vercel*, en procédant section par section pour garantir un code 100% complet (sans `TODO`).

---

## 📈 État d'Avancement Global
- [x] **Étape 1 :** Initialisation & Architecture
- [x] **Étape 2 :** Design System & Composants Atomiques (UI)
- [x] **Étape 3 :** Layout Global & Smooth Scroll Integration
- [x] **Étape 4 :** Section 1 — Hero Cinématique & R3F (3D)
- [x] **Étape 5 :** Section 2 — Comment ça marche (Scroll Reveal)
- [x] **Étape 6 :** Section 3 — Pourquoi GreenLoop (Bento Grid / Glow)
- [x] **Étape 7 :** Section 4 — Fonctionnalités & Maquette Dashboard
- [ ] **Étape 8 :** Section 5 — Témoignages & FAQ (Slider & Accordion)
- [ ] **Étape 9 :** Section 6 — Écran de Chargement & Footer
- [ ] **Étape 10 :** Optimisation SEO & Performance (Lighthouse > 95)

---

## 📂 Architecture des Fichiers Réalisée

```text
greenloop/
├── app/
│   ├── components/
│   │   ├── layout/       # À FINALISER (Navbar, Footer)
│   │   ├── sections/     
│   │   │   ├── Hero.tsx            [✅ Créé] (Cinematic split, Stats, R3F link)
│   │   │   ├── HowItWorks.tsx      [✅ Créé] (Timeline asymétrique, Scroll-driven progress)
│   │   │   └── FeaturesGrid.tsx    [✅ Créé] (Bento Grid 12-col, Mini-widgets SVG/Wallet)
            └── InteractiveDashboard.tsx  
│   │   ├── three/        
│   │   │   └── HeroScene.tsx       [✅ Créé] (Tore métallique distordu, 1800 particules)
│   │   └── ui/
│   │       ├── AnimatedText.tsx    [✅ Créé]
│   │       ├── Button.tsx          [✅ Créé]
│   │       └── GlowCard.tsx        [✅ Créé]
│   ├── hooks/
│   │   ├── useLenis.ts             [✅ Créé] (Smooth scroll)
│   │   ├── useMagneticEffect.ts    [✅ Créé] (Intégré dans Hero)
│   │   └── useScrollProgress.ts    [✅ Mis à jour] (Typage strict validé pour build)
│   ├── lib/
│   │   └── utils.ts                [✅ Créé]
│   ├── globals.css                 [✅ Mis à jour] (Ajout de keyframes @shimmer)
│   ├── layout.tsx                  [✅ Configuré] (Lenis globalisé)
│   └── page.tsx                    [✅ Mis à jour] (Hero + HowItWorks + FeaturesGrid)
├── package.json                    [✅ Configuré]
└── next.config.ts                  [✅ Nettoyé] (Suppression des options obsolètes d'eslint)

##  Plan d'Action Étape par Étape



### Étape 7 : Section 4 — Le Tableau de Bord Interactif
*La pièce maîtresse technique : simuler l'application SaaS/Mobile en direct sur le web.*

- [ ] Créer `app/components/sections/InteractiveDashboard.tsx`.
- [ ] Modéliser l'interface en Pixel-Perfect : Graphiques de progression de tri, solde de points dynamiques, QR Code de collecte généré en SVG.
- [ ] Ajouter des micro-interactions au survol des éléments du tableau de bord.

---

### Étape 8 : Section 5 — Preuve Sociale & Engagement
*Rassurer et engager avec des éléments d'interface haut de gamme.*

- [ ] Créer `app/components/sections/Testimonials.tsx` en utilisant `Embla Carousel` (transitions fluides, option infinie).
- [ ] Créer `app/components/sections/Faq.tsx` avec les accordéons Radix UI / Shadcn animés proprement à l'ouverture.

---

### Étape 9 : Section 6 — Écran de Chargement & Footer
*Finaliser le parcours utilisateur avec une expérience de sortie et d'entrée mémorable.*

- [ ] Créer `app/components/ui/LoadingScreen.tsx` : Animation d'introduction avec un Morphing SVG (changement de forme fluide) qui se dissimule une fois le site chargé.
- [ ] Créer `app/components/layout/Footer.tsx` : Pied de page massif, minimaliste, intégrant le formulaire de newsletter géré par `React Hook Form` et validé par `Zod`.

---

### Étape 10 : Optimisations Finales & Métadonnées
*Garantir une note maximale sur les outils de mesure de performance.*

- [ ] Configurer le fichier `app/layout.tsx` avec les métadonnées SEO complètes (OpenGraph, Twitter Cards ciblés sur Abidjan/Côte d'Ivoire).
- [ ] Forcer l'accélération matérielle (GPU) sur toutes les animations lourdes.
- [ ] Lancer un audit Lighthouse et viser : Performance > 95, Accessibilité: 100, Best Practices: 100, SEO: 100.