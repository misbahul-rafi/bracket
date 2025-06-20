'use client'

import { useParams } from "next/navigation";
import { useState } from "react";
import { LeagueStruct } from "../../../../types/struct";
import ViewLeaderboard from "./_components/ViewLeaderboard";
import ViewMatch from "./_components/ViewMatch";
import { getChangedMatches } from "@/utils/getChangedMatch";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLeague } from "@/hooks/leagues";
import { useUpdateScore } from "@/hooks/scores";
import Spinner from "@/components/Spinner";

export default function LeaguePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session } = useSession();
  const { mutate: updateScore, isPending } = useUpdateScore(slug)
  const { data: league, isLoading } = useLeague(slug);
  const [modifiedLeague, setModifiedLeague] = useState<LeagueStruct | null>(null);

  const handleScoreChange = (matchId: number, homeScore: number, awayScore: number) => {
    const currentLeague = modifiedLeague ?? league;
    if (!currentLeague) return;

    const updatedStages = currentLeague.stage.map((s) => ({
      ...s,
      matches: s.matches.map((m) =>
        m.id === matchId ? { ...m, homeScore, awayScore } : m
      ),
    }));

    setModifiedLeague({ ...currentLeague, stage: updatedStages });
  };
  const reset = () => setModifiedLeague(null);
  const onSave = async () => {
    if (!league || !modifiedLeague) return;
    if (session?.user.id !== league?.userId) return;
    const matchesPayload = getChangedMatches(league, modifiedLeague);
    if (matchesPayload.length === 0) return;
    updateScore(matchesPayload);
  };
  const displayLeague = modifiedLeague ?? league;

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#ff0000]">{displayLeague?.name}</h1>
        <h2 className="text-lg text-gray-500 uppercase tracking-widest">{displayLeague?.code} - {displayLeague?.season}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <section className="lg:col-span-3 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#ff0000]">Leaderboard</h2>
          {isLoading && <Spinner />}
          {displayLeague && <ViewLeaderboard league={displayLeague} />}
        </section>

        <aside className="flex flex-col justify-start gap-3">
          <button
            type="button"
            className={`hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow transition ${modifiedLeague ? "bg-blue-500" : "bg-gray-200 cursor-not-allowed"} `}
            onClick={reset}
            disabled={!modifiedLeague}
          >
            Reset
          </button>

          {session?.user.id === displayLeague?.userId && (
            <div className="flex flex-col gap-3">
              <Link
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition w-full text-center"
                href={`/leagues/${displayLeague?.slug}/manage`}
              >
                Manage Group
              </Link>
              <button
                type="button"
                className={`hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow transition ${modifiedLeague ? "bg-blue-500" : "bg-gray-200 cursor-not-allowed"} `}
                onClick={onSave}
                disabled={!modifiedLeague || isPending}
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </aside>
      </div>

      <section className=" mx-auto mt-10 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#ff0000]">Matches</h2>
        {isLoading && <Spinner />}
        {displayLeague?.stage && (
          <ViewMatch
            data={displayLeague.stage.flatMap((s) => s.matches)}
            onScoreChange={handleScoreChange}
          />
        )}
      </section>
    </main>
  );
}