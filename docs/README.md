# Moodboard v4 - Documentation

## Vue d'ensemble

Moodboard v4 est une application React moderne pour gérer une collection personnelle d'œuvres (livres, films, séries, jeux vidéo, musique) avec un système de recommandations basé sur l'humeur et des tags intelligents.

## Fonctionnalités Principales

- **Gestion d'œuvres** : Ajout, édition, suivi de progression
- **Système d'humeur** : Sélection quotidienne d'humeurs
- **SmartTags** : Tags contextuels (temps, social)
- **Recommandations** : Suggestions basées sur l'humeur et les tags
- **Filtres avancés** : Recherche, statut, catégorie, favoris
- **Heatmap annuelle** : Visualisation de l'activité
- **Interface responsive** : Optimisée mobile et desktop

## Documentation Technique

### Fonctionnalités

- [**Recherche**](SEARCH_FEATURE.md) - Système de recherche intégré
- [**SmartTags**](SMART_TAGS_ENHANCEMENT.md) - Système de tags contextuels
- [**NotesModal**](NOTES_MODAL.md) - Édition de notes longues
- [**EmptyState**](EMPTY_STATE_ENHANCEMENT.md) - Messages contextuels intelligents
- [**WorkCard Layout**](WORKCARD_LAYOUT_IMPROVEMENT.md) - Améliorations de l'affichage
- [**Mobile Responsiveness**](MOBILE_RESPONSIVENESS.md) - Optimisation mobile/tablette
- [**Desktop Layout Fix**](DESKTOP_LAYOUT_FIX.md) - Corrections du layout desktop

### Performance et Optimisation

- [**Performance Optimization**](PERFORMANCE_OPTIMIZATION.md) - Optimisations React.memo et useMemo

### Tests et Qualité

- [**Mobile Testing**](MOBILE_TESTING.md) - Guide de test mobile

## Architecture

### Technologies

- **Frontend** : React 18 + TypeScript + Tailwind CSS
- **State Management** : Zustand
- **Animations** : Framer Motion
- **Build Tool** : Vite

### Structure des Composants

- **App.tsx** : Composant principal avec logique métier
- **WorkCard** : Affichage et édition des œuvres
- **AddWorkCard** : Formulaire d'ajout d'œuvres
- **FilterControls** : Contrôles de filtrage
- **SmartTagSelector** : Sélection de tags intelligents
- **YearlyHeatmap** : Visualisation des données
- **PerformanceProfiler** : Monitoring des performances

### Stores Zustand

- **workStore** : Gestion des œuvres
- **moodStore** : Gestion des humeurs
- **filterStore** : État des filtres
- **uiStore** : État de l'interface

## Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build
```

## Optimisations de Performance

L'application utilise plusieurs techniques d'optimisation :

- **React.memo** sur les composants critiques
- **useMemo** pour les calculs lourds
- **useCallback** pour les fonctions de callback
- **PerformanceProfiler** pour le monitoring
- **Early returns** et **Sets** pour les algorithmes

## Contribution

1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Développer et tester
3. Commiter avec des messages conventionnels
4. Merger dans `dev` puis dans `main`

## Licence

Projet personnel - Formation Auto-Didacte
