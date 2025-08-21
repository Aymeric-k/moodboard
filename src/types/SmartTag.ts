export type SmartTag =
  // Contexte temporel
  | 'lateNight'
  | 'quick'
  | 'long'

  // Contexte social
  | 'withFriend'
  | 'solo';

export const SMART_TAGS: SmartTag[] = [
  // Contexte temporel
  'lateNight', 'quick', 'long',

  // Contexte social
  'withFriend', 'solo'
];

// Groupes de tags pour l'affichage organisé
export const SMART_TAG_GROUPS = {
  time: ['lateNight', 'quick', 'long'] as SmartTag[],
  social: ['withFriend', 'solo'] as SmartTag[]
};

