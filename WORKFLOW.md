# GreenLoop — Workflow de Développement Premium

## État d'Avancement Global

- [x] **Phase 0** — Corrections préalables (JSX HeroScene, typo AmbianGlow, Types HeroScene/FeaturesGrid, métadonnées layout, harmonisation police, etc.)
- [x] **Phase 1** — Layout Global (SmoothScroll Lenis singleton fix, Navbar glassmorphique, layout.tsx intégré)
- [x] **Phase 2.1** — Testimonials (Embla Carousel, 6 avis, loop, responsive 1/2/3 cols, badges impact)
- [x] **Phase 2.2** — FAQ (Radix Accordion, 7 questions, animations slideUp/slideDown)
- [x] **Phase 2.3** — LoadingScreen (SVG morphing 6 formes, dots progressifs, AnimatePresence)
- [x] **Phase 2.4** — Footer (Newsletter RHF + Zod v4, sonner toast, 3 col. links, social links)
- [x] **Phase 3** — page.tsx final (Hero, HowItWorks, FeaturesGrid, InteractiveDashboard, Testimonials, Faq, LoadingScreen, Footer)
- [x] **Phase 4** — Shadcn/UI (base-nova, style Base UI, Button + Sonner installés, globals.css Shadcn vars)
- [x] **Phase 5** — SEO & Perf (métadonnées enrichies, sitemap.ts, robots.ts, twitter card, build ✅)

## Architecture des Fichiers

```
app/
├── components/
│   ├── layout/
│   │   ├── SmoothScroll.tsx          [✅ Provider Lenis]
│   │   ├── Navbar.tsx                [✅ Glassmorphique, mobile, liens anchor]
│   ├── sections/
│   │   ├── Hero.tsx                  [✅ Cinématique, scene 3D, CountUp, boutons magnétiques]
│   │   ├── HowItWorks.tsx            [✅ Timeline scroll-driven 4 étapes]
│   │   ├── FeaturesGrid.tsx          [✅ Bento grid 12-col, widgets SVG interactifs]
│   │   ├── InteractiveDashboard.tsx  [✅ Mockup app complet (sidebar, graphique, QR code)]
│   │   ├── Testimonials.tsx          [✅ Embla Carousel, 6 témoignages, loop]
│   │   ├── Faq.tsx                   [✅ Radix Accordion, 7 questions]
│   │   ├── LoadingScreen.tsx         [✅ SVG morphing, 6 formes, dots progressifs]
│   │   └── Footer.tsx                [✅ Newsletter RHF+Zod, sonner toast, social links]
│   ├── three/
│   │   └── HeroScene.tsx             [✅ Tore métallique distordu, 1800 particules]
│   └── ui/
│       ├── button.tsx                [✅ Shadcn Base UI Button]
│       └── sonner.tsx                [✅ Shadcn Sonner Toaster]
├── hooks/
│   ├── useLenis.ts                   [✅ Hook singleton Lenis]
│   ├── useMagneticEffect.ts          [✅ Effet magnétique GSAP]
│   └── useScrollProgress.ts          [✅ Scroll progress + parallax]
├── lib/
│   └── utils.ts                      [✅ cn(), lerp(), clamp(), mapRange()]
├── globals.css                       [✅ Design system, Shadcn vars, .dark theme]
├── layout.tsx                        [✅ Métadonnées OG, SmoothScroll, Navbar, Toaster]
├── page.tsx                          [✅ Toutes les sections importées]
├── sitemap.ts                        [✅ Sitemap généré]
└── robots.ts                         [✅ Robots config]
```

## Dépendances Clés

- Next.js 16.2.9 / React 19.2.4 / Tailwind v4 (CSS-first)
- Shadcn/UI (base-nova style, Base UI)
- Framer Motion / GSAP / Lenis / three / R3F
- Embla Carousel / Radix Accordion
- React Hook Form + Zod v4 + @hookform/resolvers
- Sonner (toast)
- Lucide React (icons)

## Notes

- Palette verte (#16a34a) conservée.
- Shadcn/UI installé avec `"utils": "@/app/lib/utils"`.
- `components/ui/` fichiers Shadcn.
- Newsletter : frontend uniquement (placeholder — aucune donnée envoyée).
- Build Next.js : `next build` ✅ (pages statiques, 0 erreurs TS).
