# Expert Curation System - Moodboard v4

## Overview

The Expert Curation System is a premium feature that provides curated book recommendations from literary experts. It features a sophisticated carousel interface with expert profiles, weekly picks, and a comprehensive recommendation history.

## Features

### Core Functionality

- **Expert Profiles**: Detailed librarian and literary expert profiles
- **Pick of the Week**: Weekly featured book recommendations
- **Reading History**: Chronological view of all expert recommendations
- **Responsive Design**: Optimized for both desktop and mobile experiences
- **Theme Integration**: Fully integrated with the application's theme system

## Architecture

### Components

#### ExpertCarousel.tsx

- **Location**: `src/components/ExpertCarousel.tsx`
- **Purpose**: Main carousel interface for expert recommendations
- **Features**:
  - Desktop: Fixed top-left carousel with hover effects
  - Mobile: Floating action button with bottom sheet
  - Auto-rotation through recommendations
  - Theme-aware styling

#### ExpertCarouselCard.tsx

- **Location**: `src/components/ExpertCarouselCard.tsx`
- **Purpose**: Individual recommendation card display
- **Features**:
  - Expert photo and information
  - Book title and short description
  - Add to backlog functionality
  - Amazon affiliate link integration

#### ExpertProfile.tsx

- **Location**: `src/components/ExpertProfile.tsx`
- **Purpose**: Detailed expert profile modal
- **Features**:
  - Expert biography and specialties
  - Complete reading history
  - Social media links
  - Responsive layout for all screen sizes

### Data Layer

#### ExpertStore (expertStore.ts)

- **State Management**: Zustand-based store for expert data
- **Key Functions**:
  - `addExpert()`: Add new expert profiles
  - `addExpertPick()`: Add new recommendations
  - `getCurrentPickOfTheWeek()`: Get current weekly pick
  - `getPreviousPicks()`: Get historical recommendations
  - `getExpertById()`: Retrieve expert profile
  - `getPicksByExpert()`: Get all picks by specific expert

#### Types

**ExpertType.ts**:

```typescript
interface Expert {
  id: string
  name: string
  bio: string
  specialty: string
  photoUrl: string
  socialLinks?: {
    instagram?: string
    goodreads?: string
    website?: string
  }
  expertise: ['book']
  isActive: boolean
  joinedAt: Date
  totalPicks: number
  averageRating?: number
}
```

**ExpertPick.ts**:

```typescript
interface ExpertPick {
  id: string
  expertId: string
  title: string
  author: string
  category: 'book'
  shortWhy: string
  fullDescription: string
  amazonLink?: string
  featured: boolean
  isPickOfTheWeek: boolean
  weekOf: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  estimatedTime?: string
  targetMood?: string[]
  difficulty?: 'easy' | 'medium' | 'hard'
  isActive: boolean
}
```

## User Experience

### Desktop Experience

1. **Fixed Carousel**: Top-left positioned carousel (320x160px)
2. **Hover Interaction**: Pause auto-rotation on hover
3. **Click Navigation**: Arrow navigation between picks
4. **Expert Profile**: Click expert name/photo to open detailed profile

### Mobile Experience

1. **Floating Button**: "Expert's Pick" button in bottom-right
2. **Bottom Sheet**: Detailed pick information in slide-up modal
3. **Expert Profile**: Full-screen responsive profile modal
4. **Touch Optimized**: All interactions optimized for touch

### Key Interactions

- **Add to Backlog**: One-click addition to personal work list
- **Amazon Integration**: Direct links to purchase books
- **Social Sharing**: Expert social media links
- **Historical Browse**: View all previous recommendations

## Technical Implementation

### Performance Optimizations

- **React.memo**: All components memoized for optimal rendering
- **Image Lazy Loading**: Expert photos loaded on demand
- **Efficient State Updates**: Minimal re-renders with Zustand
- **Animation Performance**: Framer Motion optimizations

### Data Management

- **Initial Data**: Sample expert and picks data
- **One-time Initialization**: Global flag prevents duplicate setup
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Graceful fallbacks for missing data

### Responsive Design

- **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- **Layout Adaptation**: Different layouts per screen size
- **Touch Targets**: Minimum 44px for mobile interactions
- **Typography Scaling**: Responsive text sizing

## Integration Points

### Theme System

- **Dynamic Colors**: All components use theme color variables
- **Background Gradients**: Theme-aware gradient backgrounds
- **Text Colors**: Primary, secondary, and accent text colors
- **Hover States**: Theme-consistent interaction states

### Work Management

- **Add to Backlog**: Direct integration with workStore
- **Work Creation**: Automatic work object creation
- **Category Assignment**: Proper categorization as 'book'
- **Progress Tracking**: Integration with existing progress system

## Sample Data

### Current Expert: Maëlle K.

- **Profile**: Passionate librarian with 5 years experience
- **Specialty**: Literature & Fiction
- **Social**: Instagram, Goodreads, Personal blog
- **Recommendations**: 6 carefully curated book picks

### Featured Books

1. **"Educated"** by Tara Westover - Current Pick of the Week
2. **"Klara and the Sun"** by Kazuo Ishiguro
3. **"Wild"** by Cheryl Strayed
4. **"The Seven Husbands of Evelyn Hugo"** by Taylor Jenkins Reid
5. **"Atomic Habits"** by James Clear
6. **"The Midnight Library"** by Matt Haig

## Future Enhancements

### Planned Features

- **Multiple Experts**: Support for multiple expert profiles
- **Category Expansion**: Beyond books to other media types
- **User Ratings**: Community ratings for expert picks
- **Personalization**: AI-driven expert matching
- **Social Features**: User comments and discussions

### Technical Roadmap

- **API Integration**: Backend service for expert data
- **Real-time Updates**: Live expert pick updates
- **Advanced Analytics**: Pick performance tracking
- **Monetization**: Enhanced affiliate link system
- **Offline Support**: Cache expert data for offline access

## Development Guidelines

### Adding New Experts

1. Create expert profile in `sampleExperts.ts`
2. Add expert picks with proper dates and metadata
3. Ensure social links are valid and active
4. Test responsive design across all devices

### Adding New Picks

1. Follow ExpertPick interface structure
2. Set appropriate `isPickOfTheWeek` flag
3. Include compelling `shortWhy` and `fullDescription`
4. Test Amazon link functionality
5. Verify theme integration

### Testing Checklist

- [ ] Desktop carousel functionality
- [ ] Mobile bottom sheet interaction
- [ ] Expert profile modal responsiveness
- [ ] Theme color integration
- [ ] Add to backlog functionality
- [ ] Amazon link validation
- [ ] Social media links
- [ ] Performance optimization

## Conclusion

The Expert Curation System represents a sophisticated addition to Moodboard v4, providing users with professional literary recommendations in an elegant, responsive interface. The system demonstrates advanced React patterns, responsive design principles, and seamless integration with the existing application architecture.

This feature enhances user engagement through expert authority, provides clear monetization opportunities through affiliate links, and establishes a foundation for future social and community features.
