import { useMemo, useState } from 'react';
import type { DailyActivitySummary } from '../utils/moodUtils';
import type { MoodType } from '../types/MoodType';

interface YearlyHeatmapProps {
  dailyData: Map<string, DailyActivitySummary>;
  moods: MoodType[];
}

// Helper to get a mood's hex color from its Tailwind class
const getMoodHexColor = (moodId: number | null, moods: MoodType[]): string => {
  const colorMap: Record<string, string> = {
    'bg-yellow-300': '#FCD34D',
    'bg-teal-400': '#2DD4BF',
    'bg-orange-400': '#FB923C',
    'bg-indigo-400': '#818CF8',
    'bg-blue-300': '#93C5FD',
    'bg-red-400': '#F87171',
    'bg-slate-500': '#64748B',
    'bg-slate-700': '#334155', // Default for no activity
  };

  if (moodId === null) return colorMap['bg-slate-700'];
  const mood = moods.find(m => m.id === moodId);
  return mood ? colorMap[mood.color] || colorMap['bg-slate-700'] : colorMap['bg-slate-700'];
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export function YearlyHeatmap({ dailyData, moods }: YearlyHeatmapProps) {
  // État pour la navigation mobile
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const { days, monthLabels } = useMemo(() => {
    const today = new Date();
    const days = [];
    const monthLabels = new Map<number, { label: string, colStart: number }>();

    // Go back 364 days to get a full 52 weeks, then find the previous Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const currentDay = new Date(startDate);
    let weekIndex = 1;

    // Generate cells for 53 weeks to ensure a full grid
    for (let i = 0; i < 53 * 7; i++) {
      const dayToPush = new Date(currentDay);
      days.push(dayToPush);

      // Add a month label if we've entered a new month on a Sunday
      if (dayToPush.getDay() === 0 && !monthLabels.has(dayToPush.getMonth())) {
        monthLabels.set(dayToPush.getMonth(), {
          label: MONTH_NAMES[dayToPush.getMonth()],
          colStart: weekIndex,
        });
      }

      if (currentDay.getDay() === 6) { // Saturday, end of a column
        weekIndex++;
      }

      currentDay.setDate(currentDay.getDate() + 1);
    }

    return { days, monthLabels: Array.from(monthLabels.values()) };
  }, []);

  const formatter = new Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

  // Navigation mobile
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      let newMonth = prev.month + (direction === 'next' ? 1 : -1);
      let newYear = prev.year;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      return { year: newYear, month: newMonth };
    });
  };

  // Vue mobile mensuelle
  const renderMobileMonthView = () => {
    // Générer les jours du mois sélectionné directement
    const year = selectedMonth.year;
    const month = selectedMonth.month;

    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);

    // Organiser les jours par semaine
    const weeks: Array<Array<{ date: Date; isCurrentMonth: boolean }>> = [];
    let currentWeek: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Ajouter les jours du mois précédent pour compléter la première semaine
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
      currentWeek.push({ date: prevDate, isCurrentMonth: false });
    }

    // Ajouter tous les jours du mois
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      currentWeek.push({ date: currentDate, isCurrentMonth: true });

      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    }

    // Compléter la dernière semaine si nécessaire
    if (currentWeek.length > 0) {
      let nextDay = 1; // Commencer par le 1er du mois suivant
      while (currentWeek.length < 7) {
        const nextDate = new Date(year, month + 1, nextDay);
        currentWeek.push({ date: nextDate, isCurrentMonth: false });
        nextDay++;
      }
      weeks.push(currentWeek);
    }

    return (
      <div className="sm:hidden">
        {/* Navigation mobile */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-lg font-semibold text-white">
            {MONTH_NAMES_FULL[selectedMonth.month]} {selectedMonth.year}
          </h3>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grille mensuelle */}
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours de la semaine */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="text-center text-xs text-slate-400 p-1">
              {day}
            </div>
          ))}

          {/* Jours du mois */}
          {weeks.flat().map(({ date, isCurrentMonth }, index) => {
            const dateISO = formatter.format(date);
            const dayData = dailyData.get(dateISO);
            const moodCount = dayData?.moods.count ?? 0;
            const workActivityCount = (dayData?.works.added ?? 0) + (dayData?.works.completed ?? 0) + (dayData?.works.progressed ?? 0);

            // Couleur unie sans dégradé
            let backgroundColor = '#64748B'; // Gris par défaut

            if (dayData && dayData.moods.uniqueMoodIds.length > 0) {
              // Utiliser la couleur de la première humeur uniquement
              const firstMoodId = dayData.moods.uniqueMoodIds[0];
              backgroundColor = getMoodHexColor(firstMoodId, moods);
            }

            const cellStyle: React.CSSProperties = {
              backgroundColor,
              opacity: moodCount === 0 ? 0.3 : 0.8, // Opacité simple
            };

            let tooltipText = `${date.toLocaleDateString('fr-FR', { dateStyle: 'long' })}: Aucune activité.`;
            if (dayData) {
              const moodText = dayData.moods.count > 0 ? `${dayData.moods.count} humeur${dayData.moods.count > 1 ? 's' : ''}` : '';
              const workText = workActivityCount > 0 ? `${workActivityCount} activité${workActivityCount > 1 ? 's' : ''}` : '';

              if (dayData.moods.count > 0 && workActivityCount > 0) {
                tooltipText = `${date.toLocaleDateString('fr-FR', { dateStyle: 'long' })}: ${moodText} et ${workText} enregistrées.`;
              } else if (dayData.moods.count > 0) {
                tooltipText = `${date.toLocaleDateString('fr-FR', { dateStyle: 'long' })}: ${moodText} enregistrée.`;
              } else if (workActivityCount > 0) {
                tooltipText = `${date.toLocaleDateString('fr-FR', { dateStyle: 'long' })}: ${workText} enregistrée.`;
              }
            }

            return (
              <div
                key={`${dateISO}-${index}`}
                role="gridcell"
                tabIndex={0}
                title={tooltipText}
                className={`relative group w-8 h-8 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-center cursor-pointer ${
                  !isCurrentMonth ? 'opacity-30' : ''
                }`}
                style={cellStyle}
              >
                {/* Numéro du jour - couleur unie */}
                <span className={`text-xs font-bold pointer-events-none ${
                  isCurrentMonth ? 'text-white' : 'text-slate-400'
                }`}>
                  {date.getDate()}
                </span>

                {/* Indicateur d'activité */}
                {workActivityCount > 0 && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/80 rounded-full"></div>
                )}

                {/* Tooltip */}
                {dayData && (moodCount > 0 || workActivityCount > 0) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                    <p className="font-bold">{date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    {dayData.moods.count > 0 && (
                      <ul className="mt-1">
                        {dayData.moods.uniqueMoodIds.map(id => {
                          const mood = moods.find(m => m.id === id);
                          return <li key={id} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${mood?.color}`}></div>{mood?.label}</li>;
                        })}
                      </ul>
                    )}
                    {workActivityCount > 0 && (
                      <ul className="mt-1 pt-1 border-t border-slate-700">
                        {dayData.works.added > 0 && <li>{dayData.works.added} œuvre{dayData.works.added > 1 ? 's' : ''} ajoutée{dayData.works.added > 1 ? 's' : ''}</li>}
                        {dayData.works.completed > 0 && <li>{dayData.works.completed} œuvre{dayData.works.completed > 1 ? 's' : ''} terminée{dayData.works.completed > 1 ? 's' : ''}</li>}
                        {dayData.works.progressed > 0 && <li>Progression sur {dayData.works.progressed} œuvre{dayData.works.progressed > 1 ? 's' : ''}</li>}
                      </ul>
                    )}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="inline-block bg-slate-800/50 p-2 sm:p-3 rounded-lg">
      <div className="flex flex-col gap-2">
        {/* Vue mobile mensuelle */}
        {renderMobileMonthView()}

        {/* Vue desktop annuelle */}
        <div className="hidden sm:block">
          {/* Month labels */}
          <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-0.5 text-xs text-slate-400 -mr-1">
            {monthLabels.map(({ label, colStart }) => (
              <div key={label} className="text-left" style={{ gridColumnStart: colStart }}>
                {label}
              </div>
            ))}
          </div>

          {/* Grille annuelle */}
          <div role="grid" className="grid grid-flow-col grid-rows-7 gap-0.5">
            {days.map(date => {
              const dateISO = formatter.format(date);
              const dayData = dailyData.get(dateISO);
              const moodCount = dayData?.moods.count ?? 0;
              const workActivityCount = (dayData?.works.added ?? 0) + (dayData?.works.completed ?? 0) + (dayData?.works.progressed ?? 0);

              const cellStyle: React.CSSProperties = {
                opacity: moodCount === 0 ? 0.15 : 0.3 + Math.min(moodCount / 5, 1) * 0.7,
              };

              if (!dayData || dayData.moods.uniqueMoodIds.length === 0) {
                cellStyle.backgroundColor = getMoodHexColor(null, moods);
              } else if (dayData.moods.uniqueMoodIds.length === 1) {
                cellStyle.backgroundColor = getMoodHexColor(dayData.moods.uniqueMoodIds[0], moods);
              } else {
                const colors = dayData.moods.uniqueMoodIds.slice(0, 3).map(id => getMoodHexColor(id, moods));
                if (colors.length === 2) {
                  cellStyle.background = `linear-gradient(135deg, ${colors[0]} 49.5%, ${colors[1]} 50.5%)`;
                } else {
                  cellStyle.background = `linear-gradient(135deg, ${colors[0]} 33%, ${colors[1]} 33%, ${colors[1]} 66%, ${colors[2]} 66%)`;
                }
              }

              let tooltipText = `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}: No activity recorded.`;
              if (dayData) {
                const moodText = dayData.moods.count > 0 ? `${dayData.moods.count} mood${dayData.moods.count > 1 ? 's' : ''}` : '';
                const workText = workActivityCount > 0 ? `${workActivityCount} work activity${workActivityCount > 1 ? 'ies' : ''}` : '';

                if (dayData.moods.count > 0 && workActivityCount > 0) {
                  tooltipText = `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}: ${moodText} and ${workText} recorded.`;
                } else if (dayData.moods.count > 0) {
                  tooltipText = `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}: ${moodText} recorded.`;
                } else if (workActivityCount > 0) {
                  tooltipText = `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}: ${workText} recorded.`;
                }
              }

              return (
                <div
                  key={dateISO}
                  role="gridcell"
                  tabIndex={0}
                  title={tooltipText}
                  className="relative group w-2.5 h-2.5 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-center cursor-pointer"
                  style={cellStyle}
                >
                  {workActivityCount > 0 && (
                    <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                  )}

                  {/* Tooltip */}
                  {dayData && (moodCount > 0 || workActivityCount > 0) && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                      <p className="font-bold">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      {dayData.moods.count > 0 && (
                        <ul className="mt-1">
                          {dayData.moods.uniqueMoodIds.map(id => {
                            const mood = moods.find(m => m.id === id);
                            return <li key={id} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${mood?.color}`}></div>{mood?.label}</li>;
                          })}
                        </ul>
                      )}
                      {workActivityCount > 0 && (
                        <ul className="mt-1 pt-1 border-t border-slate-700">
                          {dayData.works.added > 0 && <li>{dayData.works.added} work{dayData.works.added > 1 ? 's' : ''} added</li>}
                          {dayData.works.completed > 0 && <li>{dayData.works.completed} work{dayData.works.completed > 1 ? 's' : ''} completed</li>}
                          {dayData.works.progressed > 0 && <li>Progress on {dayData.works.progressed} work{dayData.works.progressed > 1 ? 's' : ''}</li>}
                        </ul>
                      )}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
