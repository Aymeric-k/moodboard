import { SMART_TAG_GROUPS } from '../types/SmartTag';
import type { SmartTag } from '../types/SmartTag';

interface SmartTagSelectorProps {
  activeTags: SmartTag[];
  onTagToggle: (tag: SmartTag) => void;
  className?: string;
}

export function SmartTagSelector({ activeTags, onTagToggle, className }: SmartTagSelectorProps) {
  // Fonction pour obtenir la couleur d'un tag
  const getTagColor = (tag: SmartTag, isActive: boolean): string => {
    if (isActive) {
      return 'bg-blue-500 text-white font-semibold scale-105 shadow-lg';
    }

    // Couleurs par groupe pour une meilleure UX
    if (SMART_TAG_GROUPS.time.includes(tag)) {
      return 'bg-blue-600/50 text-blue-200 hover:bg-blue-600/70';
    }
    if (SMART_TAG_GROUPS.social.includes(tag)) {
      return 'bg-green-600/50 text-green-200 hover:bg-green-600/70';
    }

    return 'bg-slate-600 text-slate-300 hover:bg-slate-500';
  };

  // Fonction pour obtenir le label d'un tag
  const getTagLabel = (tag: SmartTag): string => {
    const labels: Record<SmartTag, string> = {
      // Contexte temporel
      lateNight: 'Late Night',
      quick: 'Quick',
      long: 'Long',

      // Contexte social
      withFriend: 'With Friend',
      solo: 'Solo'
    };
    return labels[tag];
  };

  return (
    <div className={`flex flex-col gap-3 sm:gap-2 ${className || ''}`}>
      {/* Contexte temporel */}
      <div className="flex flex-col gap-2 sm:gap-1.5">
        <h4 className="text-sm sm:text-xs font-semibold text-slate-300 text-center capitalize">Time Context</h4>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-1.5">
          {SMART_TAG_GROUPS.time.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
                className={`px-4 sm:px-3 py-2.5 sm:py-1.5 text-sm sm:text-xs rounded-full transition-all min-h-[44px] sm:min-h-0 ${getTagColor(tag, isActive)}`}
                aria-pressed={isActive}
                aria-label={`Toggle ${tag} tag`}
              >
                {getTagLabel(tag)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contexte social */}
      <div className="flex flex-col gap-2 sm:gap-1.5">
        <h4 className="text-sm sm:text-xs font-semibold text-slate-300 text-center capitalize">Social Context</h4>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-1.5">
          {SMART_TAG_GROUPS.social.map((tag) => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onTagToggle(tag)}
                className={`px-4 sm:px-3 py-2.5 sm:py-1.5 text-sm sm:text-xs rounded-full transition-all min-h-[44px] sm:min-h-0 ${getTagColor(tag, isActive)}`}
                aria-pressed={isActive}
                aria-label={`Toggle ${tag} tag`}
              >
                {getTagLabel(tag)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Export par défaut pour compatibilité
export default SmartTagSelector;
