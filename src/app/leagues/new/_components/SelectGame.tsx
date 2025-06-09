'use client'

import { Game } from '@prisma/client';
import { useState, useEffect, useRef } from 'react';

interface SelectGameProps {
  onSelect: (game: Game) => void;
}

export default function SelectGame({ onSelect }: SelectGameProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch('/api/games');
        if (!res.ok) throw new Error('Failed to fetch games');
        const data: Game[] = await res.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchGames();
  }, []);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    // delay hilangkan dropdown saat blur supaya onMouseDown bisa kebaca
    const handleBlur = () => setTimeout(() => setIsFocused(false), 100);
    const node = inputRef.current;
    if (node) {
      node.addEventListener('blur', handleBlur);
      return () => node.removeEventListener('blur', handleBlur);
    }
  }, []);

  return (
    <div className="relative w-full">
      <label htmlFor="game" className='block mb-2 text-sm font-medium capitalize'>Game</label>
      <input
        id='game'
        type="text"
        ref={inputRef}
        value={query}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedGame(null);
          onSelect(null as any);
        }}
        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 mb-5"
      />
      {isFocused && query && filteredGames.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded top-16 max-h-48 overflow-y-auto">
          {filteredGames.map((game) => (
            <li
              key={game.id}
              className="px-2 text-xs py-1 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setSelectedGame(game);
                setQuery(game.name);
                onSelect(game);
              }}
            >
              {game.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
