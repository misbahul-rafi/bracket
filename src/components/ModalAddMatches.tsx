'use client'

import { useState } from "react";
import { useCreateMatch } from "@/hooks/matches";
import { MatchFormat } from "@prisma/client";
import { StageStruct } from "../../types/struct";

const styleLabel = "block text-sm font-medium text-gray-700 mb-1";
const styleInput = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm";
const styleError = "text-red-500 text-xs mt-1";

type Props = {
  stage: StageStruct;
  leagueSlug: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ModalAddMatches({ stage, leagueSlug, onClose, onSuccess }: Props) {
  const [data, setData] = useState({
    date: '',
    format: '',
    homeScore: 0,
    awayScore: 0,
    homeTeamId: 0,
    awayTeamId: 0,
    bracket: '',
    matchCode: '',
    stageId: stage.id,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateMatch(leagueSlug);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: Record<string, string> = {};
    if (!data.date.trim()) newErrors.date = "Date is required";
    if (!data.homeTeamId) newErrors.homeTeamId = "Home team is required";
    if (!data.awayTeamId) newErrors.awayTeamId = "Away team is required";
    if (data.homeTeamId && data.homeTeamId === data.awayTeamId) {
      newErrors.awayTeamId = "Teams must be different";
    }
    if (data.homeTeamId && data.homeTeamId === data.awayTeamId) {
      newErrors.awayTeamId = "Teams must be different";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    mutate(
      {
        ...data,
        stageId: stage.id,
        homeTeamId: data.homeTeamId,
        awayTeamId: data.awayTeamId,
        format: data.format as MatchFormat,
        date: new Date(data.date),
        homeScore: 0,
        awayScore: 0,
        bracket: '',
        matchCode: '',

      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
        onError: (err: Error) => {
          setApiError(err.message);
        },
      }
    );
  };

  const allTeams = Array.from(
    new Set(
      stage.groups.flatMap(group => group.members.map(member => member.team))
    )
  );

  return (
    <div className={"fixed inset-0 z-50 flex items-center justify-center bg-black/40"}>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Add Match</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className={styleLabel}>Date</label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              className={styleInput}
              value={data.date}
              onChange={handleChange}
            />
            {errors.date && <p className={styleError}>{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="stage" className={styleLabel}>Match Code (Optional)</label>
            <input
              type="text"
              id="stage"
              name="stage"
              className={styleInput}
              value={data.matchCode}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="homeTeamId" className={styleLabel}>Home Team</label>
            <select
              name="homeTeamId"
              id="homeTeamId"
              className={styleInput}
              value={data.homeTeamId}
              onChange={handleChange}
            >
              <option value="">-- Select Home Team --</option>
              {allTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            {errors.homeTeamId && <p className={styleError}>{errors.homeTeamId}</p>}
          </div>

          <div>
            <label htmlFor="awayTeamId" className={styleLabel}>Away Team</label>
            <select
              name="awayTeamId"
              id="awayTeamId"
              className={styleInput}
              value={data.awayTeamId}
              onChange={handleChange}
            >
              <option value="">-- Select Away Team --</option>
              {allTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            {errors.awayTeamId && <p className={styleError}>{errors.awayTeamId}</p>}
          </div>

          <div>
            <label htmlFor="format" className={styleLabel}>Match Format</label>
            <select
              name="format"
              id="format"
              className={styleInput}
              value={data.format}
              onChange={handleChange}
            >
              {Object.values(MatchFormat).map(fmt => (
                <option key={fmt} value={fmt}>{fmt}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="desc" className={styleLabel}>Bracket (Optional)</label>
            <input
              type="text"
              id="desc"
              name="desc"
              className={styleInput}
              value={data.bracket}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <div className="w-full">
              {apiError && <p className={styleError}>{apiError}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isPending}
            >
              {isPending ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
