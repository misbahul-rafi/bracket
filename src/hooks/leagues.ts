import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LeagueStruct, LeagueXEsport } from '../../types/struct';

export function useLeagues(username?: string) {
  return useQuery<LeagueXEsport[], Error>({
    queryKey: ['leagues', username],
    queryFn: async () => {
      const url = username ? `/api/leagues?username=${username}` : '/api/leagues';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch leagues (status: ${res.status})`);
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

export function useLeague(slug: string) {
  return useQuery<LeagueStruct, Error>({
    queryKey: ['league', slug],
    queryFn: async () => {
      const res = await fetch(`/api/leagues/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch league (status: ${res.status})`);
      }
      return res.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

// types/leagues.ts
export type LeaguePayload = {
  name: string;
  code: string;
  region: string;
  season: number;
  esportId: number;
  format: 'GROUP' | 'KNOCKOUT' | 'LADDER';
  groupFormat?: 'ROUND_ROBIN' | 'SWISS'; // hanya jika GROUP
  playoffFormat?: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';
  groupIsLock: boolean;
};

export type CreateLeagueResponse = {
  league: {
    id: number;
    name: string;
    slug: string;
  };
};

export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation<CreateLeagueResponse, Error, LeaguePayload>({
    mutationFn: async (data: LeaguePayload) => {
      const res = await fetch("/api/leagues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to create league.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
    },
  });
}

export function useDeleteLeague(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (slug: string) => {
      const res = await fetch(`/api/leagues/${slug}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const { message } = await res.json()
        throw new Error(message || "Gagal menghapus liga.")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leagues"] })
      if (onSuccessCallback) {
        onSuccessCallback()
      }
    },
    onError: (err: any) => {
      console.error(err.message || "Terjadi kesalahan saat menghapus.")
    },
  })
}
