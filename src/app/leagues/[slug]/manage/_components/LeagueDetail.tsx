'use client'

import { LeagueStruct } from "../../../../../../types/struct";

export default function LeagueDetail({league}: {league: LeagueStruct}) {
  return (
    <section className="shadow rounded-xl p-5 border flex-1 border-[#ff0000] shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">League Details</h3>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{league.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Code:</span>
          <span>{league.code}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Game:</span>
          <span>{league.game.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Season:</span>
          <span>{league.season}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Region:</span>
          <span>{league.region}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Format:</span>
          <span>{league.format}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Match Format:</span>
          <span>{league.groupMatchFormat}</span>
        </div>
      </div>
    </section>
  );
}