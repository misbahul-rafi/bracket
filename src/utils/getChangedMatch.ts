import { LeagueStruct } from "../../types/struct";

export function getChangedMatches(original: LeagueStruct, edited: LeagueStruct) {
  if (!original || !edited) return [];

  const changedMatches: {
    matchId: number;
    homeScore: number;
    awayScore: number;
  }[] = [];

  original.stage.forEach((originalStage) => {
    const editedStage = edited.stage.find((s) => s.id === originalStage.id);
    if (!editedStage) return;

    originalStage.matches.forEach((originalMatch) => {
      const editedMatch = editedStage.matches.find((m) => m.id === originalMatch.id);
      if (!editedMatch) return;

      const homeScoreChanged = originalMatch.homeScore !== editedMatch.homeScore;
      const awayScoreChanged = originalMatch.awayScore !== editedMatch.awayScore;

      if (homeScoreChanged || awayScoreChanged) {
        changedMatches.push({
          matchId: originalMatch.id,
          homeScore: editedMatch.homeScore,
          awayScore: editedMatch.awayScore,
        });
      }
    });
  });

  return changedMatches;
}
