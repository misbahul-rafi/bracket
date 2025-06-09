'use client'

import { dailyGroup, weeklyGroup } from "@/utils/TimeFunctions";
import { MatchStruct } from "../../../../../types/struct";
import MatchCard from "./MatchCard";

type Props = {
  data: MatchStruct[],
  onScoreChange: (id: number, homeScore: number, awayScore: number) => void;
  // onReset: () => void;
}

export default function ViewMatch({ data, onScoreChange }: Props) {
  if (!data) return

  const { pastWeeks, upcomingWeeks } = weeklyGroup(data)

  return (
    <div className="flex flex-col md:flex-row">

      <section className="bg-white p-4 md:w-1/2 rounded-md shadow-md md:order-2">
        <div className="flex flex-row justify-between pr-12">
          <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
        </div>
        {upcomingWeeks.length === 0 ? (
          <p className="text-gray-500">No upcoming matches.</p>
        ) : (
          upcomingWeeks.map((week, idx) => (
            <div key={idx} className="mb-4">
              {week.map((match) => (
                <MatchCard key={match.id} match={match} onScoreChange={onScoreChange} />
              ))}
            </div>
          ))
        )}
      </section>

      <section className="bg-white md:w-1/2 rounded-md shadow-md md:order-1 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Completed Matches</h2>
        {pastWeeks.length === 0 ? (
          <p className="text-gray-500">No past matches.</p>
        ) : (
          pastWeeks.map((WeeklyMatches, idx) => (
            <div key={idx} className="flex flex-col">
              <h1 className="text-center border-b font-bold">Week {idx + 1}</h1>
              <div className="flex flex-row justify-around">
                {dailyGroup(WeeklyMatches).map((dailyMatches) => (
                  <div key={dailyMatches.date}>
                    <p className="text-xs">{dailyMatches.date}</p>
                    {dailyMatches.matches.map((match) => (
                      <MatchCard key={match.id} match={match} onScoreChange={onScoreChange} />
                    ))}
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </section>
    </div>
  )
}