import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Team } from '@prisma/client';
import { useMutation } from "@tanstack/react-query";
type TeamPayload = {
  name: string;
  code: string;
  region: string;
};

export function useTeams(username?: string) {
  return useQuery<Team[], Error>({
    queryKey: ['teams', username],
    queryFn: async () => {
      const url = username ? `/api/teams?username=${username}` : '/api/teams';
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch teams (status: ${res.status})`);
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('status: 404')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

export function useTeam(slug: string) {
  return useQuery<Team, Error>({
    queryKey: ['team', slug],
    queryFn: async () => {
      const res = await fetch(`/api/team/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch team (status: ${res.status})`);
      }
      return res.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: TeamPayload) => {
      const res = await fetch("/api/teams", {
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
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    }
  });
}
