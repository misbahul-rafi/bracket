import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatchStruct } from "../../types/struct";
import { MatchFormat } from "@prisma/client";

type Payload = {
  stageId: number,
  matches: MatchStruct[],
}
export function useCreateMatches(leagueSlug: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Payload) => {
      const res = await fetch(`/api/leagues/${leagueSlug}/matches/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || result.message || "Failed to create team");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      if (onSuccessCallback) return onSuccessCallback()
    }
  });
}

export type MatchCreatePayload = {
  date: Date;
  format: MatchFormat;
  homeScore: number;
  awayScore: number;
  homeTeamId: number;
  awayTeamId: number;
  bracket?: string;
  matchCode?: string;
  stageId: number;
};
export function useCreateMatch(leagueSlug: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MatchCreatePayload) => {
      const res = await fetch(`/api/leagues/${leagueSlug}matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      if (onSuccessCallback) return onSuccessCallback()
    },
  });
}

