import { Esport } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EsportXLeague } from '../../types/struct';




export function useEsports() {
  return useQuery<Esport[], Error>({
    queryKey: ['esports'],
    queryFn: async () => {
      const res = await fetch('/api/esports');
      if (!res.ok) {
        throw new Error('Failed to fetch esports data');
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useEsport(slug: string) {
  return useQuery<EsportXLeague, Error>({
    queryKey: ['esport', slug],
    queryFn: async () => {
      const res = await fetch(`/api/esports/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch esport with slug: ${slug}`);
      }
      return res.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
type EsportPayload = {
  name: string;
  description?: string;
  imageUrl?: string;
};

export function useCreateEsport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EsportPayload) => {
      const res = await fetch("/api/esports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to create esport.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["esports"] });
    }
  });
}