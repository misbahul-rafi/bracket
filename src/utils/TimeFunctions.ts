import { MatchStruct } from "../../types/struct";


export function weeklyGroup(matches: MatchStruct[]) {
  const getWeekStart = (date: Date): number => {
    const day = date.getUTCDay(); // 0 = Minggu
    const diff = (day === 0 ? -6 : 1) - day; // Senin sebagai awal minggu
    const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    monday.setUTCDate(monday.getUTCDate() + diff);
    monday.setUTCHours(0, 0, 0, 0);
    return monday.getTime(); // unique key untuk minggu
  };

  const groups = new Map<number, MatchStruct[]>(); // key: minggu (timestamp), value: array of matches

  for (const match of matches) {
    const date = new Date(match.date);
    const weekStart = getWeekStart(date);

    if (!groups.has(weekStart)) {
      groups.set(weekStart, []);
    }
    groups.get(weekStart)!.push(match);
  }

  const currentWeek = getWeekStart(new Date());

  const pastWeeks: MatchStruct[][] = [];
  const upcomingWeeks: MatchStruct[][] = [];

  Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([weekStart, matchGroup]) => {
      if (weekStart < currentWeek) {
        pastWeeks.push(matchGroup);
      } else {
        upcomingWeeks.push(matchGroup);
      }
    });

  return {
    pastWeeks,
    upcomingWeeks,
  };
}

export function dailyGroup(
  matches: MatchStruct[]
): { date: string; matches: MatchStruct[] }[] {
  const groups: Record<string, MatchStruct[]> = {};

  matches.forEach((match) => {
    const d = new Date(match.date);
    if (isNaN(d.getTime())) return;

    const dateKey = `${d.toLocaleDateString("id-ID", { weekday: "long" })}, ${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
    (groups[dateKey] ||= []).push(match);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, matches]) => ({ date, matches }));
}


export function timeIndonesia(isoString: Date, timeZone: string = 'Asia/Jakarta'): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone
  });
}