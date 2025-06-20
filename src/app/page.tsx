'use client'

import Quote from "@/components/Quote";
import LeagueContainer from "@/components/LeagueContainer";
import { useLeagues } from "@/hooks/leagues";
import Spinner from "@/components/Spinner";


export default function HomePage() {
  const { data:leagues, isLoading } = useLeagues();

  return (
    <main>
      <Quote />
      <div className="container mx-auto">
        {isLoading && <Spinner/>}
        {leagues && (
          <LeagueContainer
            leagues={leagues}
            title="Popular Leagues"
          />
        )}
      </div>
    </main>
  );
}