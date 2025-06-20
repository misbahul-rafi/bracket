import { MatchStruct, ScheduleStruct, StageStruct } from "../../../../../../types/struct";

function getNextValidDate(start: Date, allowedDays: string[]): Date {
  const date = new Date(start);
  while (true) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    if (allowedDays.includes(dayName)) break;
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export default function generateSingleElimKnockoutMatches(
  stage: StageStruct,
  schedule: ScheduleStruct
): MatchStruct[] {
  const generated: MatchStruct[] = [];
  const teams = [...stage.groups[0].members];

  // Tambahkan BYE jika jumlah tim bukan kelipatan 2
  if (teams.length % 2 !== 0) {
    teams.push({
      id: -1,
      groupId: stage.groups[0].id,
      teamId: -1,
      team: {
        id: -1,
        name: "BYE",
        code: "BYE",
        region: "N/A",
        userId: ""
      }
    });
  }

  let matchIndex = 0;
  const roundMatches: MatchStruct[][] = [];
  let currentRoundTeams = teams.map((t) => t);

  // Generate semua ronde
  while (currentRoundTeams.length > 1) {
    const round: MatchStruct[] = [];
    for (let i = 0; i < currentRoundTeams.length; i += 2) {
      const home = currentRoundTeams[i];
      const away = currentRoundTeams[i + 1];

      round.push({
        id: 0,
        date: new Date(), // tanggal akan ditentukan nanti
        stageId: stage.id,
        format: "BO3",
        homeScore: 0,
        awayScore: 0,
        homeTeamId: home.teamId,
        awayTeamId: away.teamId,
        homeTeam: home.team,
        awayTeam: away.team,
        bracket: null,
        matchCode: null
      });
    }
    roundMatches.push(round);

    // Siapkan placeholder untuk babak berikutnya
    currentRoundTeams = new Array(round.length).fill(null).map((_, i) => ({
      id: -100 - i,
      groupId: stage.groups[0].id,
      teamId: -100 - i,
      team: {
        id: -100 - i,
        name: `Winner of Match ${matchIndex + i + 1}`,
        code: `W${matchIndex + i + 1}`,
        region: "TBD",
        userId: ""
      }
    }));

    matchIndex += round.length;
  }

  // Penjadwalan
  let cursorDate = new Date();
  cursorDate.setHours(0, 0, 0, 0);
  for (const round of roundMatches) {
    cursorDate = getNextValidDate(cursorDate, schedule.days);
    const dayName = cursorDate.toLocaleDateString("en-US", { weekday: "long" });
    const times = schedule.timesPerDay[dayName] || [];

    for (let i = 0; i < round.length; i++) {
      const match = round[i];
      const timeStr = times[i % times.length] || "12:00";
      const [hour, minute] = timeStr.split(":" ).map(Number);
      const matchDate = new Date(cursorDate);
      matchDate.setHours(hour, minute, 0, 0);
      match.date = matchDate;
      generated.push(match);
    }

    cursorDate.setDate(cursorDate.getDate() + 1);
  }

  return generated;
}
