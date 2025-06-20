import { useMutation } from "@tanstack/react-query";
import { GroupXMembers } from "../../types/struct";

type Payload = {
  stageId: number,
  groups: GroupXMembers[]
}

export function useCreateGroups(slug: string) {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      console.log(payload)
      const res = await fetch(`/api/leagues/${slug}/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || "Failed to create/update groups");
      }

      return res.json();
    },
  });
}
