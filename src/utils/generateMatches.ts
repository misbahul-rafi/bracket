import { MatchStruct, ScheduleStruct, StageStruct } from "../../types/struct";

function getNextValidDate(start: Date, allowedDays: string[]): Date {
  const date = new Date(start);
  while (true) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    if (allowedDays.includes(dayName)) break;
    date.setDate(date.getDate() + 1);
  }

  return date;
}

export default function generateMatches(
  stage: StageStruct,
  schedule: ScheduleStruct
): MatchStruct[] {
  const generated: MatchStruct[] = [];
  const groupMatchQueue: { [groupId: number]: MatchStruct[] } = {};

  for (const group of stage.groups) {
    const members = [...group.members];
    if (members.length % 2 !== 0) {
      members.push({
        id: -1,
        groupId: group.id,
        teamId: -1,
        team: {
          id: -1,
          name: "BYE",
          code: "BYE",
          region: "N/A",
          userId: ''
        },
      });
    }

    const rotation = members.slice(1);
    const totalRounds = members.length - 1;
    const matchesPerRound = members.length / 2;

    const groupMatches: MatchStruct[] = [];

    for (let round = 0; round < totalRounds; round++) {
      const roundMatches: MatchStruct[] = [];

      const fixed = members[0];
      const opponent = rotation[round % rotation.length];
      if (fixed.teamId !== -1 && opponent.teamId !== -1) {
        roundMatches.push({
          id: 0,
          date: new Date(),
          stageId: stage.id,
          format: "BO3",
          homeScore: 0,
          awayScore: 0,
          homeTeamId: fixed.teamId,
          awayTeamId: opponent.teamId,
          homeTeam: fixed.team,
          awayTeam: opponent.team,
          bracket: null,
          matchCode: null
        });
      }

      for (let i = 1; i < matchesPerRound; i++) {
        const teamA = rotation[(round + i) % rotation.length];
        const teamB = rotation[(round + rotation.length - i) % rotation.length];
        if (teamA.teamId !== -1 && teamB.teamId !== -1) {
          roundMatches.push({
            id: 0,
            date: new Date(),
            stageId: stage.id,
            format: "BO3",
            homeScore: 0,
            awayScore: 0,
            homeTeamId: teamA.teamId,
            awayTeamId: teamB.teamId,
            homeTeam: teamA.team,
            awayTeam: teamB.team,
            bracket: null,
            matchCode: null
          });
        }
      }

      groupMatches.push(...roundMatches);
    }

    groupMatchQueue[group.id] = groupMatches;
  }
  const startDate = new Date();
  let cursorDate = new Date(startDate);

  while (
    Object.values(groupMatchQueue).some((matches) => matches.length > 0)
  ) {
    cursorDate = getNextValidDate(cursorDate, schedule.days);

    const dayName = cursorDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const timeSlots = schedule.timesPerDay[dayName] || [];
    for (const timeStr of timeSlots) {
      for (const group of stage.groups) {
        const nextMatch = groupMatchQueue[group.id]?.shift();
        if (!nextMatch) continue;

        const [hour, minute] = timeStr.split(":").map(Number);
        const matchDate = new Date(cursorDate);
        matchDate.setHours(hour, minute, 0, 0);

        nextMatch.date = matchDate;
        generated.push(nextMatch);
      }
    }

    cursorDate.setDate(cursorDate.getDate() + 1);
  }

  return generated;
}
