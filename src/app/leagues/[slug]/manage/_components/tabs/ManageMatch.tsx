'use client'
import { useState } from "react";
import { MatchStruct, ScheduleStruct, StageStruct } from "../../../../../../../types/struct";
import MatchCard from "../../../_components/MatchCard";
import generateMatches from "@/utils/generateMatches";
import { dailyGroup, weeklyGroup } from "@/utils/TimeFunctions";
import { useCreateMatches } from "@/hooks/matches";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import generateSingleElimKnockoutMatches from "../../_utils/generateSingleKnockout";
import BracketSingle from "@/components/BracketSingle";


const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function MatchManage({ stage, leagueSlug, fetching }: { stage: StageStruct, leagueSlug: string, fetching: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [matches, setMatches] = useState<MatchStruct[]>([]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["Friday", "Saturday"]);
  const [timesPerDay, setTimesPerDay] = useState<{ [key: string]: string[] }>({
    Friday: ["19:00", "21:00"],
    Saturday: ["13:00", "15:00"],
  });
  const { mutate, isPending } = useCreateMatches(leagueSlug, () => {
    setMatches([])
    fetching()
  })

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
    const data = generateMatches(stage, schedule);
    setMatches(data);
  };
  const handleGenerateSingle = () => {
    const schedule: ScheduleStruct = {
      startDate,
      days: selectedDays,
      timesPerDay,
    };
    const data = generateSingleElimKnockoutMatches(stage, schedule);
    setMatches(data);
  };

  const handleScoreChange = (id: number, homeScore: number, awayScore: number) => {
    setMatches((prev) =>
      prev.map((m, i) => (i === id ? { ...m, homeScore, awayScore } : m))
    );
  };
  const handleSave = () => {
    mutate({stageId: stage.id, matches})
  }
  const { upcomingWeeks } = weeklyGroup(matches)

  return (
    <div className="w-full border-t mt-5">
      <header>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left flex justify-between items-center font-semibold text-lg"
        >
          <span>Match Management - {stage.name}</span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </header>
      {isOpen &&
        <section className="flex gap-3 pb-3 border-b">
          <div className="w-full flex-1">
            <span className="block">
              <label className="text-xs font-medium block mb-1">Tanggal Mulai Pertandingan:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-3 py-1 text-xs"
              />
            </span>
            <div>
              <label className="text-sm font-medium">Pilih Hari Pertandingan:</label>
              <span className="flex flex-col flex-wrap gap-2 mt-1">
                {allDays.map((day) => (
                  <label key={day} className="flex items-center gap-1 text-sm">
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
            <p className="text-xs">Other Rules</p>
          </div>
          <div className="border-x px-3 w-full flex-2">
            <div className="mx-auto max-w-full">
              <p className="font-medium text-sm text-start border-y">Jam Pertandingan per Hari:</p>
              <div className="grid gap-4 mt-2">
                {selectedDays.map((day) => (
                  <div key={day}>
                    <div className="flex flex-row justify-between">
                      <p className="font-semibold text-sm">{day}</p>
                      <button
                        type="button"
                        onClick={() => handleAddTime(day)}
                        className="text-blue-600 border px-2 rounded-sm text-xs hover:bg-[#DBDBDB]"
                      >
                        + Time
                      </button>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-2 items-center mt-1">
                      {(timesPerDay[day] || []).map((time, index) => (
                        <div key={index} className="flex gap-1 items-center">
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => handleTimeChange(day, index, e.target.value)}
                            className="border px-2 py-1 text-xs rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTime(day, index)}
                            className="text-red-500 text-xs hover:text-red-700"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex-1 flex flex-col">
            <button
              className="border px-3 text-sm py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={stage.name === "Group Stage" ? handleGenerate : handleGenerateSingle}
            >
              Generate Match
            </button>
            <button
              className="border px-3 text-sm py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleSave}
            >
              {isPending ? "Saving..." : "Save Match"}
            </button>
            <Link
              href={isPending ? "#" : `/leagues/`}
              onClick={(e) => {
                if (isPending) e.preventDefault();
              }}
              className={`border px-3 text-sm py-1 rounded text-center text-white ${isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} transition`}
            >
              {isPending ? "Saving..." : "Back to League"}
            </Link>
          </div>
        </section>

      }
      {stage.name === "Group Stage" &&
        upcomingWeeks &&
        <section className={`bg-white flex-1 mt-10 p-3 rounded-md shadow-md md:order-1 overflow-x-auto`}>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Generate Matches</h3>
          {upcomingWeeks.length === 0 ? (
            <p className="text-gray-500 text-sm">No generate match.</p>
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
      {stage.name === "Knockout Stage" &&
        matches && matches.length > 0 && <BracketSingle data={matches} />
      }
      {/* {matches && <ViewJSON data={matches}/>} */}
    </div>
  );
}
