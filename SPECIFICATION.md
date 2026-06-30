# 🌐 Spécifications Détaillées — GreenLoop

Ce document rassemble l'intégralité des exigences graphiques, techniques, structurelles et cinématiques pour la conception du site officiel de **GreenLoop**, startup ivoirienne de collecte intelligente et d'économie circulaire.

---

##  1. Identité & Charte Graphique Premium

L'objectif visuel est d'égaler le niveau de finition d'**Apple**, **Linear**, **Stripe**, et **Vercel**. Le design doit inspirer l'innovation, la confiance absolue, l'écologie moderne et l'impact immédiat.

### Palette de Couleurs
*   **Couleur Principale :** Vert Émeraude Premium (`#16a34a`)
*   **Dégradés d'Accentuation :** `#22c55e` (Éco-brillant), `#4ade80` (Fluide), `#14532d` (Profondeur organique)
*   **Fonds :** Noir profond pur (`#030a06` pour la nuance écologique sombre) et Blanc pur pour les contrastes textuels.

### Attributs Visuels Élite
*   **Espace :** Utilisation massive de *whitespaces* (espaces vides) pour laisser respirer l'interface.
*   **Glassmorphism :** Effets de transparence légers avec flou d'arrière-plan (`backdrop-blur-xl`), bordures fines semi-transparentes (`border-white/10`).
*   **Lumières & Énergie :** Traînées lumineuses interactives, halos de gradients animés en arrière-plan et reflets dynamiques qui suivent le mouvement de la souris.
*   **Formes :** Coins généreusement arrondis (`rounded-2xl` à `rounded-3xl`) et ombres internes/externes subtiles et modernes.
*   **Texture :** Grain de texture discret (effet *Noise*) appliqué en calque transparent pour donner un aspect physique et haut de gamme.

---

##  2. Stack Technique Obligatoire

*   **Framework :** Next.js 15 (App Router) + TypeScript (Typage strict, aucun type `any`).
*   **Styles :** Tailwind CSS + Classes utilitaires avancées.
*   **Moteur d'Animation Global :** Framer Motion (Transitions d'états, layout animations, exit animations).
*   **Moteur de Performance :** GSAP (Effets physiques complexes, suivi de souris complexe) + Motion One si nécessaire.
*   **Défilement :** Lenis (Smooth Scroll à 60 FPS constants).
*   **Rendu 3D :** React Three Fiber (R3F) + `@react-three/drei` + Three.js.
*   **Composants UI :** Base de composants Shadcn/UI (Accessibilité ARIA totale) + Lucide React (Icônes vectorielles).
*   **Formulaires & Sécurité :** React Hook Form + Zod (Validation stricte côté client).
*   **Données & Utilitaires :** Embla Carousel (Slider), CountUp.js (Statistiques), Lottie-React (Animations de micro-vecteurs).

---

##  3. Structure Millimétrée des Pages & Sections

Le site se compose d'une seule page maîtresse (Single Page Application) découpée en sections narratives chirurgicales.

###  A. Écran de Chargement (Loading Screen)
*   **Visuel :** Morphing fluide d'une forme SVG (symbole de la circularité) qui s'anime au centre de l'écran sombre.
*   **Technique :** Masque le chargement des scripts Three.js et s'efface via un fondu cinématique ascendant (`y: -100%`) dès que le site est prêt.

###  B. Barre de Navigation (Navbar)
*   **Visuel :** Fixée en haut de l'écran, ultra-minimaliste, logo GreenLoop à gauche, menu discret au centre, bouton "Commencer" magnétique à droite.
*   **Interaction :** Transparente au sommet, elle se transforme en barre *glassmorphic* ultra-raffinée dès que l'utilisateur scrolle de quelques pixels.

###  C. Section Hero (L'effet "Wow")
*   **Titre Choc :** *"Transformons les déchets en opportunités."* (Animation en *Text Reveal* mot par mot).
*   **Sous-titre :** *GreenLoop récompense les habitants qui trient leurs déchets et participe à construire des villes plus propres.*
*   **Call to Action :** Deux boutons principaux animés magnétiquement : `Commencer` (Style premium brillant) et `Découvrir` (Outline discret).
*   **Illustration 3D :** Canvas React Three Fiber affichant une géométrie sacrée abstraite ou un globe vert en mouvement fluide simulant la circularité perpétuelle.
*   **Compteurs de Statistiques :** Grille horizontale affichant 4 données s'animant en temps réel au chargement (`CountUp.js`) :
    *   *Utilisateurs Actifs*
    *   *Tonnes de Déchets Collectés*
    *   *Émissions CO₂ Économisées*
    *   *Points de Récompense Distribués*

###  D. Section "Comment ça marche ?" (Le Parcours)
*   **Scénarisation :** Une timeline interactive ou un défilement parallaxe mettant en valeur 4 étapes :
    1.  **Je trie mes déchets** (Illustration vectorielle épurée / Icône animée).
    2.  **GreenLoop collecte** (Animation de transition fluide).
    3.  **Je gagne des points** (Effet d'apparition d'un token lumineux).
    4.  **Les déchets sont recyclés** (Boucle d'animation fluide).
*   **Animation :** Scroll Reveal synchronisé par le scroll de l'utilisateur. Chaque étape s'allume et se dévoile au fur et à mesure de la descente.

###  E. Section "Pourquoi GreenLoop" (Le Bento Grid)
*   **Design :** Grille asymétrique moderne (type Dashboard Apple/Linear).
*   **Contenu :** Chaque case est une `GlowCard` encapsulant une promesse forte de la startup :
    *   *Impact Écologique Direct*
    *   *Système de Récompenses attractif*
    *   *Collecte Simplifiée en un clic*
    *   *Recyclage Local & Éthique*
    *   *Création d'Emplois durables*
    *   *Communautés & Quartiers plus propres*

###  F. Section "Tableau de Bord Interactif" (La Preuve Conceptuelle)
*   **Visuel :** Simulation ultra-réaliste en Pixel-Perfect de l'application SaaS/Mobile GreenLoop pour le jury.
*   **Composants internes interactifs :**
    *   Un graphique minimaliste montrant la progression du tri de l'utilisateur.
    *   Une fausse carte interactive (Abidjan) affichant les points de collecte en SVG.
    *   Un badge lumineux indiquant le solde de points dynamiques.
    *   Un composant QR Code stylisé et épuré simulant l'identification lors de la collecte.

###  G. Section Témoignages & FAQ
*   **Témoignages :** Slider horizontal infini géré par `Embla Carousel` avec des transitions d'opacité fluides au survol pour lire les avis des citadins et des partenaires.
*   **FAQ :** Système d'accordéon minimaliste Shadcn/UI s'ouvrant avec une cinématique parfaite (Ease-out) pour répondre aux questions sur le tri et les gains.

###  H. Le Grand Footer
*   **Design :** Massif, pied de page de niveau "Enterprise", structuré en plusieurs colonnes.
*   **Éléments :** Formulaire de Newsletter ultra-sécurisé (React Hook Form + Zod) avec effet de focus vert éclatant, liens de navigation, réseaux sociaux, mentions légales, et contact local.

---

##  4. Spécifications des Animations (Strictement GPU - 60 FPS)

*   **Cinematic Entry :** Apparition orchestrée avec des délais en cascade pour tous les éléments au chargement initial du site.
*   **Text & Mask Reveal :** Les titres sortent de masques invisibles comme s'ils s'imprimaient directement sur l'écran au défilement.
*   **Boutons Magnétiques :** Les boutons principaux sont dotés d'une force d'attraction physique via GSAP dès que le curseur de la souris s'approche d'eux à moins de 30px.
*   **Glow Cursor & Follower :** Un halo de lumière verte très discret suit le pointeur de l'utilisateur sur l'ensemble de l'écran de manière fluide (`lerp`).
*   **3D Tilt Effect :** Les cartes importantes s'inclinent subtilement en fonction de la position de la souris de l'utilisateur pour donner une sensation de profondeur 3D réelle.

---

##  5. Exigences de Performance & Code Senior

*   **Score Lighthouse :** Strictement supérieur à **95** sur le mobile et le desktop.
*   **Qualité du Code :** Aucun composant générique dégradé. Tout le code est découpé, commenté et structuré de manière professionnelle (`app/components/ui`, `sections`, `layout`).
*   **Optimisation :** Pas d'images pixelisées lourdes (Uniquement des SVG vectoriels, des icônes Lucide et de la 3D procédurale). Lazy-loading appliqué sur toutes les sections en dessous de la ligne de flottaison.