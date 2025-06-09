'use client'

import { useState } from "react";
import { LeagueStruct, MatchStruct, ScheduleStruct } from "../../../../../../types/struct";
import MatchCard from "../../_components/MatchCard";
import generateMatches from "@/utils/generateMatches";
import { dailyGroup, weeklyGroup } from "@/utils/TimeFunctions";


const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MatchManage({ league }: { league: LeagueStruct }) {
  const [matches, setMatches] = useState<MatchStruct[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Friday", "Saturday"]);
  const [timesPerDay, setTimesPerDay] = useState<{ [key: string]: string[] }>({
    Friday: ["19:00", "21:00"],
    Saturday: ["13:00", "15:00"],
  });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddTime = (day: string) => {
    setTimesPerDay((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), ""],
    }));
  };

  const handleTimeChange = (day: string, index: number, value: string) => {
    setTimesPerDay((prev) => {
      const updated = [...(prev[day] || [])];
      updated[index] = value;
      return { ...prev, [day]: updated };
    });
  };

  const handleRemoveTime = (day: string, index: number) => {
    setTimesPerDay((prev) => {
      const updated = [...(prev[day] || [])];
      updated.splice(index, 1);
      return { ...prev, [day]: updated };
    });
  };

  const handleGenerate = () => {
    const schedule: ScheduleStruct = {
      startDate,
      days: selectedDays,
      timesPerDay,
    };
    const data = generateMatches(league, schedule);
    setMatches(data);
  };

  const handleScoreChange = (id: number, homeScore: number, awayScore: number) => {
    setMatches((prev) =>
      prev.map((m, i) => (i === id ? { ...m, homeScore, awayScore } : m))
    );
  };
  const { upcomingWeeks } = weeklyGroup(matches)

  return (
    <div className="w-full border-t mt-5 p-4">
      <h1 className="text-lg font-semibold mb-2">Match Scheduler</h1>
      <section className="p-3 flex gap-3 pb-3 border-b">
        <div className="border-r w-full flex-1">
          <span className="block">
            <label className="font-medium block mb-1">Tanggal Mulai Pertandingan:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </span>
          Others Rules
        </div>

        <div className="border-r w-full flex-2">
          <div>
            <label className="font-medium">Pilih Hari Pertandingan:</label>
            <span className="flex flex-wrap gap-2 mt-1">
              {allDays.map((day) => (
                <label key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  {day}
                </label>
              ))}
            </span>
          </div>
          <div className="mx-auto w-max">
            <label className="font-medium">Jam Pertandingan per Hari:</label>
            <div className="grid gap-4 mt-2">
              {selectedDays.map((day) => (
                <div key={day}>
                  <h3 className="font-semibold">{day}</h3>
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    {(timesPerDay[day] || []).map((time, index) => (
                      <div key={index} className="flex gap-1 items-center">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => handleTimeChange(day, index, e.target.value)}
                          className="border px-2 py-1 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(day, index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddTime(day)}
                      className="text-blue-600 hover:underline"
                    >
                      + Tambah Jam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex-1">
          <button
            className="mt-4 border px-5 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleGenerate}
          >
            Generate Match
          </button>
        </div>
      </section>

      {upcomingWeeks &&
        <section className={`bg-white flex-1 border mt-10 p-3 rounded-md shadow-md md:order-1 overflow-x-auto`}>
          {upcomingWeeks.length === 0 ? (
            <p className="text-gray-500">No past matches.</p>
          ) : (
            upcomingWeeks.map((WeeklyMatches, idx) => (
              <div key={idx} className="flex flex-col">
                <h1 className="text-center border-b font-bold">Week {idx + 1}</h1>
                <div className="flex flex-row justify-around">
                  {dailyGroup(WeeklyMatches).map((dailyMatches) => (
                    <div key={dailyMatches.date}>
                      <p className="text-xs">{dailyMatches.date}</p>
                      {dailyMatches.matches.map((match, idx) => (
                        <MatchCard key={`match ${idx}`} match={match} onScoreChange={handleScoreChange} />
                      ))}
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </section>
      }
    </div>
  );
}
