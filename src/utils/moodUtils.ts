import type { MoodEventType } from '../types/MoodEventType';
import type { WorkType } from '../types/WorkType';
import type { WorkProgressEvent } from '../types/WorkProgressEvent';

export type DailyActivitySummary = {
  dateISO: string; // 'YYYY-MM-DD'
 moods: {
    count: number;
    uniqueMoodIds: number[];
    dominantMoodId: number | null;
  };
  works: {
    added: number;
    completed: number;
    progressed: number;
  };
};

export function groupActivitiesByDay(
  moodEvents: MoodEventType[],
  works: WorkType[],
  progressEvents: WorkProgressEvent[],
  timeZone = 'Europe/Paris'
): Map<string, DailyActivitySummary> {
  const dailyData = new Map<string, { moodIds: number[], worksAdded: WorkType[], worksCompleted: WorkType[], worksProgressed: Set<string> }>();

  // Utilise Intl.DateTimeFormat pour obtenir correctement la date locale dans le bon fuseau horaire.
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  });

 const getDayEntry = (dateISO: string) => {
    if (!dailyData.has(dateISO)) {
      dailyData.set(dateISO, { moodIds: [], worksAdded: [], worksCompleted: [], worksProgressed: new Set() });
    }
    return dailyData.get(dateISO)!;
  };

  for (const event of moodEvents) {
    const date = new Date(event.tsISO);
    const dateISO = formatter.format(date); // Obtient 'YYYY-MM-DD'

    getDayEntry(dateISO).moodIds.push(event.moodId);
  }

  for (const work of works) {
    const date = new Date(work.createdAtISO);
    const dateISO = formatter.format(date);
    getDayEntry(dateISO).worksAdded.push(work);

    if (work.completedAtISO) {
      const completedDate = new Date(work.completedAtISO);
      const completedDateISO = formatter.format(completedDate);
      getDayEntry(completedDateISO).worksCompleted.push(work);
    }
  }

  for (const event of progressEvents) {
    const date = new Date(event.tsISO);
    const dateISO = formatter.format(date);
    getDayEntry(dateISO).worksProgressed.add(event.workId);
  }

  const summaries = new Map<string, DailyActivitySummary>();
  for (const [dateISO, data] of dailyData.entries()) {
    const { moodIds, worksAdded, worksCompleted, worksProgressed } = data;

    const moodCounts = new Map<number, number>();
    for (const id of moodIds) {
      moodCounts.set(id, (moodCounts.get(id) || 0) + 1);
    }
    const dominantMoodId = moodIds.length > 0 ? [...moodCounts.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0] : null;

   summaries.set(dateISO, {
      dateISO,
      moods: {
        count: moodIds.length,
        uniqueMoodIds: [...new Set(moodIds)],
        dominantMoodId,
      },
      works: {
        added: worksAdded.length,
        completed: worksCompleted.length,
        progressed: worksProgressed.size,
      },
    });
  }

  return summaries;
}
