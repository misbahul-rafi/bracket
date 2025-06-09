'use client'

import { useEffect, useState } from "react";
import { LeagueStruct } from "../../../../../types/struct";
import { useParams } from "next/navigation";
import LeagueDetail from "./_components/LeagueDetail";
import GroupManage from "./_components/GroupManage";
import GroupDetail from "./_components/GroupDetail";
import MatchManage from "./_components/MatchManage";
import { useSession } from "next-auth/react";
import Unauthorized from "@/components/Unauthorized";

export default function ManageLeague() {
  const { data: session, status } = useSession();
  const { slug } = useParams();
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
    setLeague(data);
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetching();
    } else if (status === "unauthenticated") {
      setLoading(false); // hentikan loading jika user tidak login
    }
  }, [status]);

  if (loading) return (
    <main className="text-center mt-10 text-lg text-gray-500">Loading...</main>
  );

  if (status === "unauthenticated") {
    return (
      <main className="text-center mt-10 text-lg text-red-500">Please login to manage the league</main>
    );
  }

  if (!league) return (
    <main className="text-center mt-10 text-lg text-red-500">League not found</main>
  );

  if (session?.user?.id !== league.userId) return <Unauthorized/>
  

  return (
    <main className="mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">{league.name}</h1>
        <h2 className="text-lg text-center text-gray-500">{league.code}</h2>
      </header>
      <div className="flex w-full gap-3 flex-col md:flex-row flex-wrap">
        <LeagueDetail league={league} />
        {!league.groupIsLock ? (
          <GroupManage league={league} fetching={fetching} />
        ) : (
          <GroupDetail league={league} />
        )}
      </div>
      {league.groupIsLock && <MatchManage league={league}/>}
    </main>
  );
}
