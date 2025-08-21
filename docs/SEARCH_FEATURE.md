# Fonctionnalité de Recherche - Moodboard v4

## Vue d'ensemble

Une fonction de recherche a été ajoutée au système de filtres existant, permettant aux utilisateurs de rechercher dans les titres et notes des œuvres de manière fluide et intuitive.

## Fonctionnalités implémentées

### 1. Recherche en temps réel

- **Champ de recherche** : Input avec icône de recherche dans le panneau de filtres
- **Debounce** : Délai de 300ms pour éviter les requêtes trop fréquentes
- **Recherche insensible à la casse** : Les résultats ne dépendent pas de la majuscule/minuscule

### 2. Intégration avec le système de filtres existant

- **Combinaison des filtres** : La recherche fonctionne en conjonction avec les filtres de statut, catégorie et favoris
- **Filtrage intelligent** : Les œuvres sont filtrées par titre ET notes simultanément
- **Réinitialisation** : Le bouton "Reset All Filters" efface aussi la recherche

### 3. Interface utilisateur

- **Design cohérent** : Utilise le même style Tailwind que les autres contrôles
- **Placeholder informatif** : "Search titles & notes..." pour guider l'utilisateur
- **Icône de recherche** : SVG intégré pour une meilleure UX

## Architecture technique

### Modifications des types

```typescript
// src/types/FilterState.ts
export type FilterState = {
  status: 'all' | 'backlog' | 'in-progress' | 'completed'
  category: 'all' | WorkCategory
  isFavorite: boolean
  searchQuery: string // ← Nouveau champ
}
```

### Modifications du store

```typescript
// src/stores/filterStore.ts
const initialFilters: FilterState = {
  status: 'all',
  category: 'all',
  isFavorite: false,
  searchQuery: '', // ← Valeur initiale
}
```

### Logique de filtrage

```typescript
// src/App.tsx - displayedWorks memo
const searchMatch =
  !filters.searchQuery ||
  work.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
  (work.notes && work.notes.toLowerCase().includes(filters.searchQuery.toLowerCase()))
```

## Utilisation

1. **Ouvrir le panneau de filtres** : Cliquer sur le bouton "Filter"
2. **Saisir la recherche** : Taper dans le champ "Search titles & notes..."
3. **Résultats en temps réel** : Les œuvres sont filtrées automatiquement
4. **Combiner avec d'autres filtres** : Utiliser simultanément statut, catégorie, favoris
5. **Réinitialiser** : Utiliser "Reset All Filters" pour tout effacer

## Avantages

- **UX fluide** : Recherche instantanée sans clic supplémentaire
- **Performance** : Debounce évite les calculs inutiles
- **Flexibilité** : Recherche dans plusieurs champs (titre + notes)
- **Cohérence** : Intégrée naturellement dans l'interface existante
- **Accessibilité** : Labels appropriés et navigation clavier

## Compatibilité

- ✅ TypeScript strict
- ✅ Zustand store pattern
- ✅ Tailwind CSS
- ✅ Framer Motion
- ✅ React 18+ hooks
