'use client'

import CardLeague from "@/components/CardLeague";
import Quote from "@/components/Quote";
import TwitterSearch from "@/components/TwitterSearch";
import { useEffect, useState } from "react";
import { LeagueXGame } from "../../types/struct";
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [leagues, setLeagues] = useState<LeagueXGame[] | null>(null)
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/leagues/')
      const data = await res.json()
      setLeagues(data)
    })();
  }, [])
  if (!leagues) return <p>Loading...</p>;

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }
  const filteredLeagues = leagues.filter((league) =>
    `${league.name}${league.code}${league.slug}${league.region}${league.game.name}`
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(searchQuery.toLowerCase().replace(/\s/g, ''))
  );
  return (
    <main>
      <Quote />
      <div className="w-2/3 mx-auto">
        <TwitterSearch value={searchQuery} onChange={handleSearch} onClear={() => setSearchQuery('')} />

      </div>

      <section className="px-8 py-5">
        <h2 className="font-bold text-2xl mb-4">Popular League</h2>
        <div className="flex gap-3 flex-wrap">
          {filteredLeagues.map((league) => (
            <CardLeague
              key={league.id}
              title={`${league.code} - ${league.season}`}
              desc={league.name}
              logoLink={'/mpl-id.png'}
              slug={`/leagues/${league.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}