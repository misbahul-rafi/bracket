'use client'

import CardLeague from "@/components/CardLeague";
import TwitterSearch from "@/components/TwitterSearch";
import { useEffect, useState } from "react";
import { LeagueXGame } from "../../../types/struct";
import Link from "next/link";

export default function LeaguesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [leagues, setLeagues] = useState<LeagueXGame[] | null>(null)
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/leagues/')
      const data = await res.json()
      setLeagues(data)
    })();
  }, [])
  if (!leagues) return
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
      <div className="w-2/3 mx-auto flex items-center gap-3">
      <span className="flex-3">
      <TwitterSearch value={searchQuery} onChange={handleSearch} onClear={() => setSearchQuery('')} />
      </span>
      <span className="flex-1 text-sm">
        <Link href={"/leagues/new"} className="px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add League</Link>
      </span>
      </div>

      <section>
        <h2 className="font-bold text-2xl mb-4 text-white">Popular League</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredLeagues.map((league) => (
            <CardLeague
              key={league.id}
              title={`${league.code} - ${league.season}`}
              desc={league.name}
              logoLink={'https://via.placeholder.com/120'}
              slug={`/leagues/${league.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}