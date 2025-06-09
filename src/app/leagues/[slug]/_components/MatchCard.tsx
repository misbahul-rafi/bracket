'use client'

import { useEffect, useState } from "react";
import { MatchStruct } from "../../../../../types/struct";
import { timeIndonesia } from "@/utils/TimeFunctions";

export default function MatchCard({ match, onScoreChange }: { match: MatchStruct; onScoreChange: (id: number, homeScore: number, awayScore: number) => void; }) {
  const BO = parseInt(match.format.replace(/\D/g, ''), 10);
  const maxScore = Math.ceil(BO / 2);

  const [homeScore, setHomeScore] = useState(match.homeScore || 0);
  const [awayScore, setAwayScore] = useState(match.awayScore || 0);

  useEffect(() => {
    setHomeScore(match.homeScore)
    setAwayScore(match.awayScore)
  }, [match])

  useEffect(() => {
    if (match) {
      onScoreChange(match.id, homeScore, awayScore);
    }
  }, [homeScore, awayScore]);

  const handleHomeScoreChange = (value: number) => setHomeScore(value);
  const handleAwayScoreChange = (value: number) => setAwayScore(value);


  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-1 mb-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-red-500 w-12 text-white text-xs font-semibold px-2 py-1 rounded uppercase">
            {match.homeTeam.code}
          </span>
          <select
            value={homeScore}
            onChange={(e) => handleHomeScoreChange(Number(e.target.value))}
            className="border border-gray-300 rounded text-sm"
          >
            {Array.from({ length: maxScore + 1 }).map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <span className="text-gray-600 font-medium mx-2 text-sm">VS</span>

        <div className="flex items-center gap-2">
          <select
            value={awayScore}
            onChange={(e) => handleAwayScoreChange(Number(e.target.value))}
            className="border border-gray-300 rounded text-sm"
          >
            {Array.from({ length: maxScore + 1 }).map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <span className="bg-blue-500 w-12 text-center text-white text-xs font-semibold px-2 py-1 rounded uppercase">
            {match.awayTeam.code}
          </span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500">{timeIndonesia(match.date)}</p>
    </div>
  );
}
