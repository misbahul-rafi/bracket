'use client'


import { useState } from 'react';
import { LeagueXEsport } from '../../types/struct';
import CardLeague from './CardLeague';
import TwitterSearch from './TwitterSearch';

interface LeagueContainerProps {
  leagues: LeagueXEsport[];
  title?: string;
  showSearch?: boolean;
}

export default function LeagueContainer({ 
  leagues, 
  title = 'Leagues', 
  showSearch = true 
}: LeagueContainerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const filteredLeagues = leagues.filter((league) =>
    `${league.name}${league.code}${league.slug}${league.region}${league.esport?.name || ''}`
      .toLowerCase()
      .replace(/\s/g, '')
      .includes(searchQuery.toLowerCase().replace(/\s/g, ''))
  );

  return (
    <section className="px-4 py-5">
      {showSearch && (
        <div className="mb-4">
          <TwitterSearch 
            value={searchQuery} 
            onChange={handleSearch} 
            onClear={() => setSearchQuery('')} 
          />
        </div>
      )}
      
      <h2 className="font-bold text-2xl mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  );
}