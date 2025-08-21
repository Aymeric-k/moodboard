# Documentation Moodboard v4

Ce dossier contient la documentation technique et les guides d'utilisation du projet Moodboard v4.

## 📚 Structure de la documentation

### Fonctionnalités

- **[Recherche](./SEARCH_FEATURE.md)** - Système de recherche intégré aux filtres
- **[SmartTags](./SMART_TAGS_ENHANCEMENT.md)** - Système de tags contextuels optimisé avec 5 options uniques
- **[NotesModal](./NOTES_MODAL.md)** - Édition des notes longues dans une modal spacieuse

### Architecture

- **Types** - Définitions TypeScript des structures de données
- **Stores** - Gestion d'état avec Zustand
- **Composants** - Composants React et leur logique

### Guides

- **Installation** - Configuration et démarrage du projet
- **Développement** - Standards de code et bonnes pratiques

## 🚀 Ajout de nouvelles fonctionnalités

Quand une nouvelle fonctionnalité est implémentée :

1. Créer un fichier `.md` dans ce dossier
2. Suivre le format établi (vue d'ensemble, fonctionnalités, architecture, utilisation)
3. Inclure des exemples de code et des captures d'écran si nécessaire
4. Mettre à jour ce README avec un lien vers la nouvelle documentation

## 📝 Format de documentation

Chaque fichier de documentation suit cette structure :

```markdown
# Nom de la fonctionnalité

## Vue d'ensemble

Description courte de ce qui a été implémenté

## Fonctionnalités

- Liste des fonctionnalités principales
- Détails techniques importants

## Architecture

- Modifications des types
- Changements dans les stores
- Nouveaux composants

## Utilisation

- Guide étape par étape
- Exemples concrets

## Avantages

- Points forts de l'implémentation
- Bénéfices pour l'utilisateur
```

## 🔧 Maintenance

Cette documentation est maintenue à jour avec chaque nouvelle fonctionnalité ou modification importante du code.
