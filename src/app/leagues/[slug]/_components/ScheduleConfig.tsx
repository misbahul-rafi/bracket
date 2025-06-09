'use client'

import { useState } from "react";

const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type ScheduleConfigProps = {
  startDate: string;
  selectedDays: string[];
  timesPerDay: { [key: string]: string[] };
  onChange: (data: {
    startDate: string;
    selectedDays: string[];
    timesPerDay: { [key: string]: string[] };
  }) => void;
};

export default function ScheduleConfig({
  startDate,
  selectedDays,
  timesPerDay,
  onChange,
}: ScheduleConfigProps) {
  const handleStartDateChange = (value: string) => {
    onChange({ startDate: value, selectedDays, timesPerDay });
  };

  const toggleDay = (day: string) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange({ startDate, selectedDays: newSelectedDays, timesPerDay });
  };

  const handleAddTime = (day: string) => {
    const updated = {
      ...timesPerDay,
      [day]: [...(timesPerDay[day] || []), ""],
    };
    onChange({ startDate, selectedDays, timesPerDay: updated });
  };

  const handleTimeChange = (day: string, index: number, value: string) => {
    const updated = { ...timesPerDay };
    updated[day][index] = value;
    onChange({ startDate, selectedDays, timesPerDay: updated });
  };

  const handleRemoveTime = (day: string, index: number) => {
    const updated = { ...timesPerDay };
    updated[day].splice(index, 1);
    onChange({ startDate, selectedDays, timesPerDay: updated });
  };

  return (
    <div className="grid gap-4">
      {/* Input tanggal mulai */}
      <div>
        <label className="font-medium block mb-1">Tanggal Mulai Pertandingan:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      {/* Pilih hari pertandingan */}
      <div>
        <label className="font-medium">Pilih Hari Pertandingan:</label>
        <div className="flex flex-wrap gap-2 mt-1">
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
        </div>
      </div>

      {/* Jam per hari */}
      <div>
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
  );
}
