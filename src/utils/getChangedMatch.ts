import { LeagueStruct } from "../../types/struct";

export function getChangedMatches(original: LeagueStruct, edited: LeagueStruct) {
  if (!original || !edited) return [];

  const changedMatches = edited.matches.reduce((acc, match) => {
    const originalMatch = original.matches.find((m) => m.id === match.id);
    if (!originalMatch) return acc;

    const homeScoreChanged = match.homeScore !== originalMatch.homeScore;
    const awayScoreChanged = match.awayScore !== originalMatch.awayScore;

    if (homeScoreChanged || awayScoreChanged) {
      acc.push({
        matchId: match.id,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      });
    }

    return acc;
  }, [] as { matchId: number; homeScore: number; awayScore: number }[]);

  return changedMatches;
}
