'use client'

import { useParams } from "next/navigation";
import MatchManage from "./_components/tabs/ManageMatch";
import { useLeague } from "@/hooks/leagues";
import Spinner from "@/components/Spinner";
import LeagueTab from "./_components/LeagueTab";
import { useEffect, useState } from "react";
import Detail from "./_components/tabs/Detail";
import ManageGroup from "./_components/tabs/ManageGroup";
import KCFromGroup from "./_components/tabs/KCFromGroup";

export default function ManageLeague() {
  const { slug } = useParams<{ slug: string }>();
  const [tab, setTab] = useState("detail")
  const {
    data: league,
    isLoading,
    refetch: refetchLeague
  } = useLeague(slug);
  useEffect(() => {
    console.log(tab)
  }, [tab])

  return (
    <main className="mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#ff0000]">{league?.name}</h1>
        <h2 className="text-lg text-gray-500 uppercase tracking-widest">{league?.code} - {league?.season}</h2>
        <LeagueTab tab={tab} setTab={setTab} />
      </header>
      {!league ? <Spinner /> :
        <div>
          {tab === "detail" && <Detail league={league} />}

          {league.stage.length >= 2 &&
            tab === "manage-group" && (
              <div>
                <ManageGroup
                  stage={league.stage[0]}
                  leagueSlug={league.slug}
                  fetching={refetchLeague}
                />
                {/* <KCFromGroup groupStage={league.stage[0]} /> */}
              </div>
            )
          }
          {/* {tab === "manage-group" && (
            <div className="flex flex-col md:flex-row gap-3">
              {
                league.stage.map((stg) => (
                  <ManageGroup
                    stage={stg}
                    leagueSlug={league.slug}
                    fetching={refetchLeague}
                  />
                ))
              }
            </div>
          )} */}
          {tab === "manage-match" &&
            league.stage.map((stg) => (
              <MatchManage key={stg.id} stage={stg} leagueSlug={league.slug} fetching={refetchLeague} />
            ))
          }
          {tab === "matches" && "<Matches data/>"}
          {tab === "bracket" && <p>Bracket Content</p>}
        </div>
      }
    </main>
  );
}