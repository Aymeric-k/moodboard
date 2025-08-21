import { SMART_TAG_GROUPS, type SmartTag } from '../types/SmartTag';

interface SmartTagSelectorProps {
  activeTags: SmartTag[];
  onTagToggle: (tag: SmartTag) => void;
  className?: string;
}

export default function SmartTagSelector({ activeTags, onTagToggle, className = '' }: SmartTagSelectorProps) {
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

  const getTagColor = (tag: SmartTag, isActive: boolean): string => {
    if (isActive) {
      return 'bg-purple-500 text-white font-semibold';
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

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Contexte temporel */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center">Time Context</h4>
        <div className="flex flex-wrap gap-2">
          {SMART_TAG_GROUPS.time.map(tag => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${getTagColor(tag, isActive)}`}
                aria-pressed={isActive}
              >
                {getTagLabel(tag)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contexte social */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center">Social Context</h4>
        <div className="flex flex-wrap gap-2">
          {SMART_TAG_GROUPS.social.map(tag => {
            const isActive = activeTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${getTagColor(tag, isActive)}`}
                aria-pressed={isActive}
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
