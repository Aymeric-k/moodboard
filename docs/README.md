# Moodboard v4 - Documentation

## Overview

Moodboard v4 is a React-based application for managing personal media backlog with mood-based recommendations and smart filtering. Built with modern web technologies and optimized for performance across all devices.

## Features

### Core Functionality

- **Work Management**: Add, edit, and track progress on books, movies, games, and more
- **Mood-Based System**: Associate works with current moods for personalized recommendations
- **Smart Tags**: Contextual tags for time and social context
- **Progress Tracking**: Monitor completion status and progress percentage
- **Search & Filtering**: Advanced filtering with search capabilities

### Advanced Features

- **Expert Curation System**: Premium carousel with expert book recommendations and "Pick of the Week"
- **Notes System**: Rich text editing with modal support for long notes
- **Yearly Heatmap**: Visual representation of daily activities and mood patterns
- **Theme System**: 5 beautiful color themes with smooth transitions
- **Internationalization**: Full English localization with proper date formatting
- **Mobile Optimization**: Responsive design with touch-friendly interactions
- **Performance Monitoring**: Built-in profiling and optimization tools

## Technical Stack

### Frontend

- **React 18**: Latest React features with hooks and concurrent rendering
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Framer Motion**: Smooth animations and transitions

### State Management

- **Zustand**: Lightweight state management with persistence
- **Local Storage**: Data persistence across browser sessions
- **Optimized Stores**: Efficient state updates and minimal re-renders

### Performance

- **React.memo**: Component memoization for optimal rendering
- **useMemo/useCallback**: Hook optimization for expensive operations
- **Performance Profiling**: Built-in monitoring and optimization tools
- **Custom Hooks**: Stable value and callback optimization

## Architecture

### Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── WorkCard.tsx    # Individual work display/editing
│   ├── AddWorkCard.tsx # Work creation form
│   ├── FilterControls.tsx # Search and filtering
│   ├── SmartTagSelector.tsx # Context tag selection
│   ├── ThemeSelector.tsx # Theme switching
│   ├── NotesModal.tsx  # Rich text editing
│   ├── EmptyState.tsx  # Contextual empty states
│   ├── YearlyHeatmap.tsx # Activity visualization
│   ├── ExpertCarousel.tsx # Expert recommendations carousel
│   ├── ExpertCarouselCard.tsx # Individual expert pick card
│   └── ExpertProfile.tsx # Expert profile modal
├── stores/             # Zustand state stores
│   ├── workStore.ts    # Work data management
│   ├── moodStore.ts    # Mood system
│   ├── filterStore.ts  # Search and filters
│   ├── uiStore.ts      # UI state management
│   ├── themeStore.ts   # Theme system
│   └── expertStore.ts  # Expert curation system
├── types/              # TypeScript type definitions
│   ├── ExpertType.ts   # Expert profile definitions
│   └── ExpertPick.ts   # Expert recommendation types
├── data/               # Sample and initial data
│   └── sampleExperts.ts # Expert profiles and picks
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
│   └── useExpertInitialization.ts # Expert data setup
├── services/           # Service layer architecture
│   ├── interfaces.ts   # Service interfaces
│   └── LocalStorage*Service.ts # Data persistence
└── styles/             # CSS and theme styles
```

### State Management

- **workStore**: CRUD operations for works, progress tracking
- **moodStore**: Mood selection, daily mood tracking
- **filterStore**: Search queries, status/category filters
- **uiStore**: Modal states, UI interactions
- **themeStore**: Theme selection and application
- **expertStore**: Expert profiles, picks, and curation logic

## Performance Optimizations

### React.memo Implementation

- All major components wrapped with React.memo
- Prevents unnecessary re-renders
- Maintains component state during updates

### useMemo Optimizations

- Heavy calculations memoized (recommendations, filtering)
- Early returns for performance-critical paths
- Efficient data structures (Sets for O(1) lookups)

### Custom Performance Hooks

- **useStableValue**: Stabilizes object references
- **useStableCallback**: Prevents callback re-creation
- **PerformanceProfiler**: Development performance monitoring

## Theme System

### Available Themes

1. **Dark Blue**: Classic dark theme with blue accents
2. **Purple**: Rich purple gradients and accents
3. **Green**: Natural green tones and gradients
4. **Orange**: Warm orange and amber colors
5. **Rose**: Elegant rose and pink gradients

### Implementation

- CSS custom properties for dynamic theming
- Smooth transitions between themes
- Persistent theme selection
- Background gradients and UI color coordination

## Mobile Responsiveness

### Design Approach

- Mobile-first responsive design
- Touch-friendly interactions (44px minimum targets)
- Optimized layouts for small screens
- Efficient mobile navigation patterns

### Mobile-Specific Features

- Drawer-based filter menu
- Month-by-month heatmap view
- Optimized touch interactions
- Responsive grid layouts

## Development Workflow

### Git Strategy

- **main**: Production-ready code
- **dev**: Development and testing
- **feature/\***: Individual feature development

### Commit Conventions

```
type(scope): description

Examples:
feat(filter): add search functionality
fix(theme): resolve color conflicts
docs(performance): update optimization guide
```

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Performance monitoring

## Performance Monitoring

### Built-in Tools

- **PerformanceProfiler**: Component render timing
- **Console Logging**: Performance metrics in development
- **React DevTools**: Profiler integration
- **Performance Budgets**: Target metrics and thresholds

### Metrics Tracked

- Component render duration
- Re-render frequency
- Memory usage patterns
- Animation performance

## Future Roadmap

### Planned Features

- Virtual scrolling for large lists
- Service Worker for offline support
- Advanced analytics and insights
- Social sharing and collaboration
- API integration for external data

### Performance Goals

- Sub-16ms render times
- <500KB bundle size
- Optimal mobile performance
- Efficient data handling

## Contributing

### Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

### Code Standards

- Follow TypeScript best practices
- Use React hooks effectively
- Implement performance optimizations
- Maintain responsive design principles

## Conclusion

Moodboard v4 represents a modern, performant, and user-friendly approach to personal media management. With its comprehensive feature set, optimized performance, and beautiful design, it provides an excellent foundation for future development and user engagement.
