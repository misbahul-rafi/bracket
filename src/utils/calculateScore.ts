import { MatchStruct } from "../../types/struct";

export const calculateScore = (match: MatchStruct) => {
  return {
    home: match.homeScore || 0,
    away: match.awayScore || 0,
  };
};
