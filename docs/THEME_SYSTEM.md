# Theme System

## Overview

The Moodboard application features a comprehensive theme system with 5 beautiful color schemes, smooth transitions, and persistent user preferences. The system uses CSS custom properties and custom gradient classes for optimal performance and visual appeal.

## Available Themes

### 1. Dark Blue (Default)

- **Primary**: `#1e293b` (slate-800)
- **Secondary**: `#334155` (slate-700)
- **Accent**: `#3b82f6` (blue-500)
- **Surface**: `#1e293b` (slate-800)
- **Text**: `#e2e8f0` (slate-200)
- **Text Secondary**: `#cbd5e1` (slate-300)
- **Background**: Linear gradient from `#010723` to `#041b51`

### 2. Purple

- **Primary**: `#581c87` (purple-800)
- **Secondary**: `#7c3aed` (purple-600)
- **Accent**: `#a855f7` (purple-500)
- **Surface**: `#3730a3` (indigo-800)
- **Text**: `#c7d2fe` (indigo-200)
- **Text Secondary**: `#a5b4fc` (indigo-300)
- **Background**: Linear gradient from `#0f0a1a` to `#4338ca`

### 3. Green

- **Primary**: `#166534` (green-800)
- **Secondary**: `#16a34a` (green-600)
- **Accent**: `#22c55e` (green-500)
- **Surface**: `#14532d` (green-900)
- **Text**: `#bbf7d0` (green-200)
- **Text Secondary**: `#86efac` (green-300)
- **Background**: Linear gradient from `#02140a` to `#166534`

### 4. Orange

- **Primary**: `#9a3412` (orange-800)
- **Secondary**: `#ea580c` (orange-600)
- **Accent**: `#f97316` (orange-500)
- **Surface**: `#7c2d12` (orange-900)
- **Text**: `#fed7aa` (orange-200)
- **Text Secondary**: `#fdba74` (orange-300)
- **Background**: Linear gradient from `#1c0a01` to `#6f2a06`

### 5. Rose

- **Primary**: `#be185d` (rose-700)
- **Secondary**: `#e11d48` (rose-600)
- **Accent**: `#f43f5e` (rose-500)
- **Surface**: `#be185d` (rose-700)
- **Text**: `#fecdd3` (rose-200)
- **Text Secondary**: `#fda4af` (rose-300)
- **Background**: Linear gradient from `#2a0a1a` to `#910d44`

## Technical Implementation

### CSS Custom Properties

The theme system uses CSS custom properties (variables) defined on the `body` element:

```css
body {
  --color-primary: #1e293b;
  --color-secondary: #334155;
  --color-accent: #3b82f6;
  --color-surface: #1e293b;
  --color-text: #e2e8f0;
  --color-text-secondary: #cbd5e1;
}
```

### Utility Classes

Tailwind-compatible utility classes that reference the CSS variables:

```css
.text-theme-text {
  color: var(--color-text);
}

.bg-theme-surface {
  background-color: var(--color-surface);
}

.border-theme-secondary {
  border-color: var(--color-secondary);
}
```

### Custom Gradient Classes

Background gradients are applied via custom CSS classes to avoid conflicts with Tailwind:

```css
.gradient-dark-blue {
  background: linear-gradient(180deg, #010723 20%, #041b51 100%);
}

.gradient-purple {
  background: linear-gradient(180deg, #0f0a1a 20%, #4338ca 100%);
}
```

## State Management

### Theme Store (Zustand)

The theme system is managed through a Zustand store with persistence:

```typescript
interface ThemeStore {
  currentTheme: ThemeType
  setTheme: (theme: ThemeType) => void
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'dark-blue',
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'moodboard-theme',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Theme Application

Themes are applied to the DOM through the `applyThemeToDOM` function:

```typescript
function applyThemeToDOM(themeId: ThemeType) {
  const theme = THEMES[themeId]
  const body = document.body
  const appRoot = document.getElementById('app-root')

  // Apply CSS variables to body for UI elements
  body.style.setProperty('--color-primary', theme.primary)
  body.style.setProperty('--color-secondary', theme.secondary)
  // ... other properties

  // Apply gradient classes to app-root div
  if (appRoot) {
    appRoot.classList.remove('gradient-dark-blue', 'gradient-purple' /* ... */)
    appRoot.classList.add(`gradient-${themeId}`)
  }

  // Add theme class to body
  body.classList.add(`theme-${themeId}`)
}
```

## Component Integration

### ThemeSelector Component

The theme selector is positioned in the top-right corner and provides visual theme selection:

```typescript
function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore()

  return (
    <div className='flex gap-2'>
      {Object.entries(THEMES).map(([id, theme]) => (
        <button
          key={id}
          onClick={() => setTheme(id as ThemeType)}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            currentTheme === id ? 'border-white scale-110' : 'border-gray-600'
          }`}
          style={{ backgroundColor: theme.primary }}
        />
      ))}
    </div>
  )
}
```

### Theme Application in Components

Components use theme-aware classes for consistent styling:

```typescript
// Example: Filter button with theme colors
<button className="bg-theme-surface/50 border border-theme-secondary text-theme-text">
  Filter
</button>

// Example: Title with theme text color
<h1 className="text-theme-text">How are you feeling today?</h1>
```

## Design Decisions

### Separation of Concerns

- **Background gradients**: Applied to `#app-root` div via custom CSS classes
- **UI colors**: Applied to `body` via CSS custom properties
- **Theme classes**: Added to `body` for additional styling flexibility

### Color Harmony

- Each theme maintains consistent color relationships
- Primary colors provide strong visual identity
- Secondary colors support interactive elements
- Accent colors highlight important actions
- Text colors ensure optimal readability

### Gradient Design

- Subtle, non-aggressive gradients
- Dark to slightly lighter progression
- Consistent 20% to 100% gradient stops
- Colors chosen for visual appeal and readability

## Performance Considerations

### CSS Variable Usage

- CSS variables provide dynamic theming without JavaScript overhead
- Changes are applied instantly via CSS
- No re-renders required for theme changes
- Efficient memory usage

### Gradient Implementation

- Custom CSS classes avoid Tailwind conflicts
- Hardware-accelerated CSS gradients
- Smooth transitions between themes
- Minimal impact on rendering performance

### Theme Persistence

- Local storage persistence for user preferences
- Theme applied on initial load
- No additional network requests
- Fast theme switching

## Accessibility

### Color Contrast

- All themes meet WCAG AA contrast requirements
- Text colors optimized for readability
- Interactive elements clearly distinguishable
- Consistent visual hierarchy across themes

### Theme Switching

- Visual theme indicators for all users
- Smooth transitions for reduced motion preferences
- Persistent theme selection
- Keyboard navigation support

## Future Enhancements

### Planned Features

- **Custom theme creation**: User-defined color schemes
- **Theme previews**: Visual theme selection interface
- **Automatic theme switching**: Time-based or system preference
- **Theme sharing**: Export/import custom themes

### Technical Improvements

- **CSS-in-JS alternatives**: Styled-components or emotion
- **Theme validation**: Automated contrast checking
- **Performance monitoring**: Theme change impact measurement
- **Advanced animations**: Enhanced transition effects

## Troubleshooting

### Common Issues

1. **Colors not changing**: Check CSS variable application
2. **Gradients not visible**: Verify app-root div targeting
3. **Theme persistence**: Check localStorage permissions
4. **Performance issues**: Monitor CSS variable updates

### Debug Tools

- Browser developer tools for CSS inspection
- Console logging for theme application
- Performance profiling for theme changes
- Visual regression testing

## Conclusion

The theme system provides a robust, performant, and user-friendly way to customize the Moodboard application. Through careful separation of concerns, efficient CSS usage, and thoughtful color design, users can enjoy personalized visual experiences while maintaining excellent performance and accessibility.
