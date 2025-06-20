import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateScorePayload = {
  matchId: number;
  homeScore: number;
  awayScore: number;
};

export function useUpdateScore(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchesPayload: UpdateScorePayload) => {
      const res = await fetch(`/api/leagues/matches/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: matchesPayload }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update matches');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league', slug] });
    },
    onError: (error: Error) => {
      console.error('Save error:', error.message);
    },
  });
}
