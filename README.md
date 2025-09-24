# Portfolio Website / Site Portfolio

> **English** | [Français](#français)

A modern, responsive portfolio website built with Astro 5, showcasing projects and professional experience with a sleek dark theme.

## 🚀 Tech Stack

- **Framework:** Astro 5 with SSR
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity Studio
- **UI Components:** React & Vue
- **Deployment:** Vercel
- **Icons:** Astro Icon with Material Design Icons

## ✨ Features

- Responsive design with mobile-first approach
- Dark theme with Catppuccin Mocha color scheme
- Content management through Sanity CMS
- Optimized image processing with Sharp
- SEO optimization with structured data
- Performance monitoring with Web Vitals
- Fast navigation with prefetching

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wmesiti-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-09-23
```

4. Start the development server:
```bash
npm run dev
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Project Structure

```
src/
├── components/          # Reusable UI components
├── layouts/            # Page layouts
├── pages/              # Route pages
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── styles/             # Global styles
└── assets/             # Static assets
```

## 🔧 Configuration

### Sanity CMS
The project uses Sanity for content management. Access the studio at `/admin` to manage projects and content.

### Performance
- Optimized bundle splitting for vendor libraries
- Image optimization with multiple formats
- CSS inlining for critical styles
- ISR (Incremental Static Regeneration) with 1-minute cache

## 🚀 Deployment

The site is optimized for Vercel deployment with:
- Automatic builds on push
- Edge functions for dynamic content
- Image optimization
- Web analytics integration

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly navigation
- Optimized typography scaling

## 🎯 SEO & Performance

- Semantic HTML structure
- Open Graph and Twitter Card meta tags
- JSON-LD structured data
- Optimized Core Web Vitals
- Lazy loading for images

## 📄 License

This project is personal portfolio code. Feel free to use as inspiration for your own projects.

---

## Français

Un site portfolio moderne et réactif construit avec Astro 5, présentant des projets et une expérience professionnelle avec un thème sombre élégant.

## 🚀 Stack Technique

- **Framework:** Astro 5 avec SSR
- **Stylisation:** Tailwind CSS v4
- **CMS:** Sanity Studio
- **Composants UI:** React & Vue
- **Déploiement:** Vercel
- **Icônes:** Astro Icon avec Material Design Icons

## ✨ Fonctionnalités

- Design réactif avec approche mobile-first
- Thème sombre avec palette de couleurs Catppuccin Mocha
- Gestion de contenu via Sanity CMS
- Traitement d'images optimisé avec Sharp
- Optimisation SEO avec données structurées
- Surveillance des performances avec Web Vitals
- Navigation rapide avec prefetching

## 🛠️ Installation

1. Cloner le dépôt :
```bash
git clone <repository-url>
cd wmesiti-portfolio
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```env
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2025-09-23
```

4. Démarrer le serveur de développement :
```bash
npm run dev
```

## 📝 Scripts

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser la version de production

## 🎨 Structure du Projet

```
src/
├── components/          # Composants UI réutilisables
├── layouts/            # Mises en page
├── pages/              # Pages de routes
├── lib/                # Utilitaires et configurations
├── types/              # Définitions de types TypeScript
├── styles/             # Styles globaux
└── assets/             # Ressources statiques
```

## 🔧 Configuration

### Sanity CMS
Le projet utilise Sanity pour la gestion de contenu. Accédez au studio à `/admin` pour gérer les projets et le contenu.

### Performance
- Division de bundle optimisée pour les bibliothèques tierces
- Optimisation d'images avec plusieurs formats
- CSS inline pour les styles critiques
- ISR (Incremental Static Regeneration) avec cache de 1 minute

## 🚀 Déploiement

Le site est optimisé pour le déploiement Vercel avec :
- Builds automatiques lors des push
- Fonctions Edge pour le contenu dynamique
- Optimisation d'images
- Intégration d'analytics web

## 📱 Design Réactif

- Approche mobile-first
- Points de rupture : sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation tactile
- Mise à l'échelle typographique optimisée

## 🎯 SEO & Performance

- Structure HTML sémantique
- Meta tags Open Graph et Twitter Card
- Données structurées JSON-LD
- Core Web Vitals optimisés
- Chargement paresseux pour les images

## 📄 Licence

Ce projet est du code de portfolio personnel. N'hésitez pas à l'utiliser comme inspiration pour vos propres projets.