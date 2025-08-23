

export interface Expert {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  photoUrl: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    goodreads?: string;
    website?: string;
  };
  expertise: ['book']; // Uniquement les livres pour les affiliés Amazon
  isActive: boolean;
  joinedAt: Date;
  totalPicks: number;
  averageRating?: number;
}

export interface ExpertAnalytics {
  expertId: string;
  profileViews: number;
  picksClicked: number;
  conversions: number;
  totalHoverTime: number;
  lastUpdated: Date;
}
