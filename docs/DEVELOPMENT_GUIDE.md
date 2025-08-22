# Development Guide - Moodboard v4

## Getting Started

### Prerequisites

- **Node.js**: Version 18+ recommended
- **npm**: Latest version
- **Git**: For version control
- **Code Editor**: VS Code with recommended extensions

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd moodboardv4

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

### Directory Organization

```
src/
├── components/          # React components
│   ├── WorkCard.tsx    # Individual work display/editing
│   ├── AddWorkCard.tsx # Work creation form
│   ├── FilterControls.tsx # Search and filtering
│   ├── SmartTagSelector.tsx # Context tag selection
│   ├── ThemeSelector.tsx # Theme switching
│   ├── NotesModal.tsx  # Rich text editing
│   ├── EmptyState.tsx  # Contextual empty states
│   ├── YearlyHeatmap.tsx # Activity visualization
│   └── PerformanceProfiler.tsx # Performance monitoring
├── stores/             # Zustand state stores
│   ├── workStore.ts    # Work data management
│   ├── moodStore.ts    # Mood system
│   ├── filterStore.ts  # Search and filters
│   ├── uiStore.ts      # UI state management
│   └── themeStore.ts   # Theme system
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── styles/             # CSS and theme styles
```

### Key Files

- **App.tsx**: Main application component
- **main.tsx**: Application entry point
- **vite.config.ts**: Build configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration

## Development Workflow

### Git Strategy

```bash
# Main branch (production)
main

# Development branch
dev

# Feature branches
feature/search-functionality
feature/theme-system
feature/mobile-optimization
```

### Commit Conventions

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

Examples:
feat(filter): add search functionality with debounce
fix(theme): resolve color conflicts in purple theme
docs(performance): update optimization guide
```

### Branch Management

```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/new-feature

# Merge to dev
git checkout dev
git merge feature/new-feature

# Merge to main (after testing)
git checkout main
git merge dev
```

## Code Standards

### TypeScript

- **Strict Mode**: Enabled for type safety
- **Type Definitions**: Comprehensive type coverage
- **Interfaces**: Prefer interfaces over types for objects
- **Generics**: Use generics for reusable components

### React Patterns

- **Functional Components**: Use function components with hooks
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Component Composition**: Favor composition over inheritance
- **Performance**: Use React.memo, useMemo, and useCallback

### Styling

- **Tailwind CSS**: Primary styling framework
- **CSS Variables**: For theme system
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG AA compliance

## State Management

### Zustand Stores

```typescript
// Example store structure
interface StoreState {
  data: DataType[]
  loading: boolean
  error: string | null
}

interface StoreActions {
  setData: (data: DataType[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      data: [],
      loading: false,
      error: null,
      setData: (data) => set({ data }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Store Best Practices

- **Single Responsibility**: Each store handles one domain
- **Immutable Updates**: Use spread operator for state updates
- **Selective Subscriptions**: Subscribe only to needed state
- **Persistence**: Use persist middleware for important data

## Component Development

### Component Structure

```typescript
import { memo, useCallback, useMemo } from 'react'
import type { ComponentProps } from './types'

interface ComponentProps {
  // Props interface
}

function ComponentName({ prop1, prop2 }: ComponentProps) {
  // State and hooks

  // Memoized values
  const memoizedValue = useMemo(() => {
    // Expensive calculation
  }, [dependencies])

  // Memoized callbacks
  const handleClick = useCallback(() => {
    // Event handler
  }, [dependencies])

  // Render
  return <div>{/* Component content */}</div>
}

export default memo(ComponentName)
```

### Performance Considerations

- **React.memo**: Wrap components to prevent unnecessary re-renders
- **useMemo**: Memoize expensive calculations
- **useCallback**: Memoize callback functions
- **Dependency Arrays**: Optimize dependency arrays for hooks

## Testing Strategy

### Manual Testing

- **Feature Testing**: Test all user interactions
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Mobile, tablet, desktop
- **Performance Testing**: Monitor render times and responsiveness

### Testing Checklist

- [ ] All user interactions work correctly
- [ ] Responsive design on all breakpoints
- [ ] Theme switching functions properly
- [ ] Data persistence works as expected
- [ ] Performance is acceptable (< 16ms render times)
- [ ] Accessibility features work correctly

## Performance Optimization

### React.memo Implementation

```typescript
// Wrap components with React.memo
export default memo(ComponentName)

// Use for expensive components
export default memo(WorkCard)
export default memo(AddWorkCard)
export default memo(FilterControls)
```

### useMemo Usage

```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Early returns for performance
const result = useMemo(() => {
  if (shouldSkip) return defaultValue
  // ... expensive calculation
}, [dependencies])
```

### Custom Hooks

```typescript
// useStableValue for object stability
const stableObject = useStableValue(object)

// useStableCallback for function stability
const stableCallback = useStableCallback(callback)
```

## Debugging and Monitoring

### Performance Profiling

```typescript
// Wrap components with PerformanceProfiler
<PerformanceProfiler id='component-name'>
  <Component />
</PerformanceProfiler>

// Check console for performance metrics
// [Performance] component-name: { metrics }
```

### React DevTools

- **Profiler**: Monitor component render times
- **Components**: Inspect component hierarchy
- **State**: View Zustand store state
- **Performance**: Identify performance bottlenecks

### Console Logging

```typescript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Performance logging
console.log(`[Performance] ${componentName}:`, metrics)
```

## Deployment

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Build Output

- **Dist Folder**: Contains built application
- **Asset Optimization**: Minified CSS and JavaScript
- **Tree Shaking**: Unused code removed
- **Source Maps**: For debugging (development)

### Environment Variables

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
```

## Maintenance

### Regular Tasks

- **Dependency Updates**: Keep packages up to date
- **Performance Monitoring**: Regular performance checks
- **Code Review**: Review and refactor code
- **Documentation Updates**: Keep docs current

### Performance Monitoring

- **Render Times**: Monitor component render performance
- **Bundle Size**: Track application bundle size
- **Memory Usage**: Monitor memory consumption
- **User Experience**: Gather user feedback

### Code Quality

- **ESLint**: Fix linting errors
- **TypeScript**: Resolve type issues
- **Code Review**: Maintain code standards
- **Refactoring**: Improve code structure

## Troubleshooting

### Common Issues

1. **Performance Problems**: Check React.memo and useMemo usage
2. **State Issues**: Verify Zustand store structure
3. **Styling Conflicts**: Check Tailwind and CSS variable conflicts
4. **Build Errors**: Verify TypeScript and dependency issues

### Debug Steps

1. **Check Console**: Look for error messages
2. **React DevTools**: Inspect component state
3. **Performance Profiler**: Monitor render times
4. **Browser DevTools**: Check CSS and network issues

## Resources

### Documentation

- **React**: [react.dev](https://react.dev)
- **TypeScript**: [typescriptlang.org](https://typescriptlang.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Zustand**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)

### Tools

- **VS Code Extensions**: React, TypeScript, Tailwind CSS
- **Browser Extensions**: React DevTools, Redux DevTools
- **Performance Tools**: Lighthouse, WebPageTest

## Conclusion

This development guide provides comprehensive information for working with Moodboard v4. Follow the established patterns and best practices to maintain code quality and performance. Regular monitoring and optimization ensure the application remains fast and user-friendly.
