import { create } from 'zustand';
import type { Expert } from '../types/ExpertType';
import type { ExpertPick, CarouselState, ExpertPickAnalytics } from '../types/ExpertPick';

interface ExpertStoreState {
  // Data
  experts: Expert[];
  expertPicks: ExpertPick[];
  analytics: ExpertPickAnalytics[];

  // Carousel State
  carousel: CarouselState;

  // Actions - Experts
  addExpert: (expert: Expert) => void;
  updateExpert: (id: string, updates: Partial<Expert>) => void;
  removeExpert: (id: string) => void;
  getExpertById: (id: string) => Expert | undefined;

  // Actions - Expert Picks
  addExpertPick: (pick: ExpertPick) => void;
  updateExpertPick: (id: string, updates: Partial<ExpertPick>) => void;
  removeExpertPick: (id: string) => void;
  getFeaturedPicks: () => ExpertPick[];
  getPicksByExpert: (expertId: string) => ExpertPick[];
  getCurrentPickOfTheWeek: () => ExpertPick | undefined;
  getPreviousPicks: (limit?: number) => ExpertPick[];

  // Actions - Carousel
  nextPick: () => void;
  previousPick: () => void;
  goToPick: (index: number) => void;
  pauseRotation: () => void;
  resumeRotation: () => void;
  resetCarousel: () => void;

  // Actions - Analytics
  trackView: (pickId: string) => void;
  trackHover: (pickId: string, hoverTime: number) => void;
  trackClick: (pickId: string) => void;
  trackAddToBacklog: (pickId: string) => void;
  trackAmazonClick: (pickId: string) => void;
}

const initialCarouselState: CarouselState = {
  currentIndex: 0,
  isPlaying: true,
  rotationInterval: 8000, // 8 secondes
  isPaused: false,
  lastInteraction: new Date()
};

export const useExpertStore = create<ExpertStoreState>((set, get) => ({
  // Initial State
  experts: [],
  expertPicks: [],
  analytics: [],
  carousel: initialCarouselState,

  // Expert Actions
  addExpert: (expert) => set((state) => {
    console.log(`➕ Adding expert: ${expert.name} (${expert.id})`);
    return {
      experts: [...state.experts, expert]
    };
  }),

  updateExpert: (id, updates) => set((state) => ({
    experts: state.experts.map(expert =>
      expert.id === id ? { ...expert, ...updates } : expert
    )
  })),

  removeExpert: (id) => set((state) => ({
    experts: state.experts.filter(expert => expert.id !== id),
    expertPicks: state.expertPicks.filter(pick => pick.expertId !== id)
  })),

  getExpertById: (id) => {
    return get().experts.find(expert => expert.id === id);
  },

  // Expert Picks Actions
  addExpertPick: (pick) => set((state) => {
    console.log(`📚 Adding expert pick: ${pick.title} by ${pick.expertId}`);

    // Mettre à jour le total des picks de l'expert
    const updatedExperts = state.experts.map(expert =>
      expert.id === pick.expertId
        ? { ...expert, totalPicks: expert.totalPicks + 1 }
        : expert
    );

    return {
      expertPicks: [...state.expertPicks, pick],
      experts: updatedExperts
    };
  }),

  updateExpertPick: (id, updates) => set((state) => ({
    expertPicks: state.expertPicks.map(pick =>
      pick.id === id ? { ...pick, ...updates } : pick
    )
  })),

  removeExpertPick: (id) => set((state) => {
    const pick = state.expertPicks.find(p => p.id === id);
    if (!pick) return state;

    // Décrémenter le total des picks de l'expert
    const updatedExperts = state.experts.map(expert =>
      expert.id === pick.expertId
        ? { ...expert, totalPicks: Math.max(0, expert.totalPicks - 1) }
        : expert
    );

    return {
      expertPicks: state.expertPicks.filter(p => p.id !== id),
      experts: updatedExperts
    };
  }),

  getFeaturedPicks: () => {
    return get().expertPicks.filter(pick => pick.featured && pick.isActive);
  },

  getPicksByExpert: (expertId) => {
    return get().expertPicks.filter(pick => pick.expertId === expertId && pick.isActive);
  },

  getCurrentPickOfTheWeek: () => {
    return get().expertPicks.find(pick => pick.isPickOfTheWeek && pick.isActive);
  },

  getPreviousPicks: (limit = 10) => {
    return get().expertPicks
      .filter(pick => !pick.isPickOfTheWeek && pick.isActive)
      .sort((a, b) => new Date(b.weekOf).getTime() - new Date(a.weekOf).getTime())
      .slice(0, limit);
  },

  // Carousel Actions
  nextPick: () => set((state) => {
    const featuredPicks = state.expertPicks.filter(pick => pick.featured && pick.isActive);
    if (featuredPicks.length === 0) return state;

    const nextIndex = (state.carousel.currentIndex + 1) % featuredPicks.length;

    return {
      carousel: {
        ...state.carousel,
        currentIndex: nextIndex,
        lastInteraction: new Date()
      }
    };
  }),

  previousPick: () => set((state) => {
    const featuredPicks = state.expertPicks.filter(pick => pick.featured && pick.isActive);
    if (featuredPicks.length === 0) return state;

    const prevIndex = state.carousel.currentIndex === 0
      ? featuredPicks.length - 1
      : state.carousel.currentIndex - 1;

    return {
      carousel: {
        ...state.carousel,
        currentIndex: prevIndex,
        lastInteraction: new Date()
      }
    };
  }),

  goToPick: (index) => set((state) => {
    const featuredPicks = state.expertPicks.filter(pick => pick.featured && pick.isActive);
    if (index < 0 || index >= featuredPicks.length) return state;

    return {
      carousel: {
        ...state.carousel,
        currentIndex: index,
        lastInteraction: new Date()
      }
    };
  }),

  pauseRotation: () => set((state) => ({
    carousel: {
      ...state.carousel,
      isPaused: true,
      lastInteraction: new Date()
    }
  })),

  resumeRotation: () => set((state) => ({
    carousel: {
      ...state.carousel,
      isPaused: false,
      lastInteraction: new Date()
    }
  })),

  resetCarousel: () => set(() => ({
    carousel: {
      ...initialCarouselState,
      lastInteraction: new Date()
    }
  })),

  // Analytics Actions
  trackView: (pickId) => set((state) => {
    const existingAnalytics = state.analytics.find(a => a.pickId === pickId);

    if (existingAnalytics) {
      return {
        analytics: state.analytics.map(a =>
          a.pickId === pickId
            ? { ...a, views: a.views + 1, lastUpdated: new Date() }
            : a
        )
      };
    } else {
      const newAnalytics: ExpertPickAnalytics = {
        pickId,
        views: 1,
        hovers: 0,
        clicks: 0,
        addedToBacklog: 0,
        amazonClicks: 0,
        averageHoverTime: 0,
        conversionRate: 0,
        lastUpdated: new Date()
      };

      return {
        analytics: [...state.analytics, newAnalytics]
      };
    }
  }),

  trackHover: (pickId, hoverTime) => set((state) => {
    return {
      analytics: state.analytics.map(a =>
        a.pickId === pickId
          ? {
              ...a,
              hovers: a.hovers + 1,
              averageHoverTime: (a.averageHoverTime * (a.hovers - 1) + hoverTime) / a.hovers,
              lastUpdated: new Date()
            }
          : a
      )
    };
  }),

  trackClick: (pickId) => set((state) => {
    return {
      analytics: state.analytics.map(a =>
        a.pickId === pickId
          ? {
              ...a,
              clicks: a.clicks + 1,
              conversionRate: a.views > 0 ? (a.clicks + 1) / a.views : 0,
              lastUpdated: new Date()
            }
          : a
      )
    };
  }),

  trackAddToBacklog: (pickId) => set((state) => {
    return {
      analytics: state.analytics.map(a =>
        a.pickId === pickId
          ? {
              ...a,
              addedToBacklog: a.addedToBacklog + 1,
              lastUpdated: new Date()
            }
          : a
      )
    };
  }),

  trackAmazonClick: (pickId) => set((state) => {
    return {
      analytics: state.analytics.map(a =>
        a.pickId === pickId
          ? {
              ...a,
              amazonClicks: a.amazonClicks + 1,
              lastUpdated: new Date()
            }
          : a
      )
    };
  })
}));
