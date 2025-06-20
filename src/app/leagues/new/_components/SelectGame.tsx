'use client'

import { useEsports } from '@/hooks/esports';
import { Esport } from '@prisma/client';
import { useState, useEffect, useRef } from 'react';

interface SelectGameProps {
  onSelect: (game: Esport | null) => void;
}

export default function SelectGame({ onSelect }: SelectGameProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: esports } = useEsports()


  useEffect(() => {
    const handleBlur = () => setTimeout(() => setIsFocused(false), 100);
    const node = inputRef.current;
    if (node) {
      node.addEventListener('blur', handleBlur);
      return () => node.removeEventListener('blur', handleBlur);
    }
  }, []);
  if (!esports) return "Esport not available"
  const filteredEsports = esports.filter(esports =>
    esports.name.toLowerCase().includes(query.toLowerCase())
  );

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
          onSelect(null);
        }}
        className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 mb-5"
      />
      {esports?.length === 0 && (
        <div className="text-xs text-gray-500 italic">No esports available</div>
      )}
      {isFocused && query && filteredEsports.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded top-16 max-h-48 overflow-y-auto">
          {filteredEsports.map((esport) => (
            <li
              key={esport.id}
              className="px-2 text-xs py-1 hover:bg-gray-100 cursor-pointer"
              onMouseDown={() => {
                setQuery(esport.name);
                onSelect(esport);
              }}
            >
              {esport.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
