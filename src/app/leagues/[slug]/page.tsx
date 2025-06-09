'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LeagueStruct } from "../../../../types/struct";
import ViewLeaderboard from "./_components/ViewLeaderboard";
import ViewMatch from "./_components/ViewMatch";
import { getChangedMatches } from "@/utils/getChangedMatch";
import { useSession } from "next-auth/react";

export default function LeaguePage() {
  const { slug } = useParams();
  const { data: session } = useSession()
  const [originalLeague, setOriginalLeague] = useState<LeagueStruct | null>(null);
  const [league, setLeague] = useState<LeagueStruct | null>(null);
  const [loading, setLoading] = useState(true);

  const fetching = async () => {
    setLoading(true);
    const res = await fetch(`/api/leagues/${slug}`);
    if (!res.ok) {
      setLeague(null);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setOriginalLeague(data)
    setLeague(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!slug) return;
    fetching();
  }, [slug]);

  if (loading) return <div className="text-center mt-10 text-lg text-gray-500">Loading...</div>;
  if (!league) return <div className="text-center mt-10 text-lg text-red-500">League not found</div>;

  const handleScoreChange = (matchId: number, homeScore: number, awayScore: number) => {
    if (!league) return;

    const updatedMatches = league.matches.map((m) =>
      m.id === matchId ? { ...m, homeScore, awayScore } : m
    );
    setLeague({ ...league, matches: updatedMatches });
  };

  const reset = () => setLeague(originalLeague);

  const onSave = async () => {
    if (!league || !originalLeague) return;

    const matchesPayload = getChangedMatches(originalLeague, league);
    if (matchesPayload.length === 0) return

    try {
      const res = await fetch(`/api/leagues/${slug}/matches/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches: matchesPayload }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Save failed:', err.error || 'Unknown error');
        return;
      }
      fetching();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#ff0000]">{league.name}</h1>
        <h2 className="text-lg text-gray-500 uppercase tracking-widest">{league.code}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <section className="lg:col-span-3 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#ff0000]">Leaderboard</h2>
          <ViewLeaderboard league={league} />
        </section>

        <aside className="flex flex-col justify-start gap-3">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow transition"
            onClick={reset}
          >
            Reset
          </button>
          {session?.user.id === league.userId && <button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow transition"
            onClick={onSave}
          >
            Save Changes
          </button>}

        </aside>
      </div>

      <section className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-[#ff0000]">Matches</h2>
        <ViewMatch data={league.matches} onScoreChange={handleScoreChange} />
      </section>
    </main>
  );
}
