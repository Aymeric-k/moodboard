import type { Expert } from '../types/ExpertType';
import type { ExpertPick } from '../types/ExpertPick';

// Sample Expert Data - English version
export const sampleExperts: Expert[] = [
  {
    id: 'maelle-librarian',
    name: 'Maëlle K.',
    bio: 'Young graduate passionate about books who decided to make it her profession! 📚✨ I pick from all categories without exception - from thrillers that make you shiver to novels that make you cry, through essays that make you think. My secret? I never hesitate to share my gems with my readers! Every week, I discover for you the rare pearls and favorites that really deserve to be read. Because a good book is meant to be shared! 💫',
    specialty: 'Literature & Fiction',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face&auto=format&q=80',
    socialLinks: {
      instagram: '@maelle_reads',
      goodreads: 'maelle-librarian'
    },
    expertise: ['book'],
    isActive: true,
    joinedAt: new Date('2024-01-15'),
    totalPicks: 52, // One year of picks
    averageRating: 4.8
  }
];

// Sample Expert Picks - Books only, "Pick of the Week" system
export const sampleExpertPicks: ExpertPick[] = [
  {
    id: 'pick-current-week',
    expertId: 'maelle-librarian',
    title: 'Educated',
    author: 'Tara Westover',
    category: 'book',
    shortWhy: "The most incredible true story I've ever read",
    fullDescription: "If you've ever felt that your education tore you away from your family, Tara Westover tells this heartbreak with brutal beauty that will move you. It's the story of a woman who never set foot in school until age 17, raised by survivalist parents in the mountains of Idaho. Her journey to Cambridge University is both inspiring and heartbreaking.",
    amazonLink: 'https://amzn.to/educated-tara-westover',
    featured: true,
    isPickOfTheWeek: true, // Current week's pick
    weekOf: new Date('2024-12-02'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    tags: ['memoir', 'inspiring', 'education', 'family'],
    estimatedTime: '334 pages',
    targetMood: ['Curious', 'Motivated'],
    difficulty: 'medium',
    isActive: true
  },
  {
    id: 'pick-previous-week-1',
    expertId: 'maelle-librarian',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    category: 'book',
    shortWhy: "Will redefine what it means to be human",
    fullDescription: "For anyone who's ever bonded with a childhood object to the point of giving it a soul, Ishiguro offers an AI so touching you'll question humanity itself. Klara is an 'artificial friend' who observes the world with an innocence that makes us see our own humanity in a new light. Prepare to cry over a robot.",
    amazonLink: 'https://amzn.to/klara-and-sun',
    featured: true,
    isPickOfTheWeek: false, // Previous weeks' picks
    weekOf: new Date('2024-11-18'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    tags: ['sci-fi', 'emotional', 'philosophy', 'ai'],
    estimatedTime: '303 pages',
    targetMood: ['Curious', 'Sad'],
    difficulty: 'medium',
    isActive: true
  },
  {
    id: 'pick-previous-week-2',
    expertId: 'maelle-librarian',
    title: 'Wild',
    author: 'Cheryl Strayed',
    category: 'book',
    shortWhy: "For everyone who dreams of dropping everything",
    fullDescription: "If the idea of dropping everything and living an adventure has crossed your mind, you'll find yourself in Cheryl's story as she hikes the Pacific Crest Trail alone to heal from personal tragedy. An emotional journey that will make you want to hit the trail, but warning: you might cry on public transport.",
    amazonLink: 'https://amzn.to/wild-cheryl-strayed',
    featured: true,
    isPickOfTheWeek: false, // Previous weeks' picks
    weekOf: new Date('2024-11-04'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
    tags: ['memoir', 'adventure', 'self-discovery', 'hiking'],
    estimatedTime: '350 pages',
    targetMood: ['Happy', 'Motivated', 'Relaxed'],
    difficulty: 'easy',
    isActive: true
  },
  {
    id: 'pick-previous-week-3',
    expertId: 'maelle-librarian',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    category: 'book',
    shortWhy: "An addictive page-turner about Hollywood secrets",
    fullDescription: "If you love secrets, scandals, and complex love stories, this book is for you. Taylor Jenkins Reid immerses us in the fascinating life of a Hollywood icon who finally reveals her best-kept secrets. Impossible to put down!",
    amazonLink: 'https://amzn.to/seven-husbands-evelyn',
    featured: true,
    isPickOfTheWeek: false,
    weekOf: new Date('2024-10-21'),
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-18'),
    tags: ['romance', 'hollywood', 'secrets', 'page-turner'],
    estimatedTime: '400 pages',
    targetMood: ['Curious', 'Happy', 'Relaxed'],
    difficulty: 'easy',
    isActive: true
  },
  {
    id: 'pick-previous-week-4',
    expertId: 'maelle-librarian',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'book',
    shortWhy: "The ultimate guide to changing your life bit by bit",
    fullDescription: "If you really want to change your habits without burning out, this book is a revelation. James Clear breaks down the science of habits so clearly that you'll start applying his advice from the first page. Perfect for a new year!",
    amazonLink: 'https://amzn.to/atomic-habits',
    featured: true,
    isPickOfTheWeek: false,
    weekOf: new Date('2024-10-07'),
    createdAt: new Date('2024-10-04'),
    updatedAt: new Date('2024-10-04'),
    tags: ['self-help', 'productivity', 'habits', 'motivational'],
    estimatedTime: '320 pages',
    targetMood: ['Motivated', 'Curious'],
    difficulty: 'medium',
    isActive: true
  },
  {
    id: 'pick-previous-week-5',
    expertId: 'maelle-librarian',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'book',
    shortWhy: "A poetic reflection on the lives we haven't lived",
    fullDescription: "For anyone who wonders 'what if I had done differently?', this book is a literary hug. Matt Haig takes us to a magical library where each book represents an alternative life. Philosophical without being heavy, touching without being tearful.",
    amazonLink: 'https://amzn.to/midnight-library',
    featured: true,
    isPickOfTheWeek: false,
    weekOf: new Date('2024-09-23'),
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-20'),
    tags: ['philosophy', 'magical-realism', 'life-choices', 'uplifting'],
    estimatedTime: '288 pages',
    targetMood: ['Curious', 'Sad', 'Motivated'],
    difficulty: 'medium',
    isActive: true
  }
];

// Helper function to initialize expert data in store
export const initializeExpertData = () => {
  return {
    experts: sampleExperts,
    picks: sampleExpertPicks
  };
};
