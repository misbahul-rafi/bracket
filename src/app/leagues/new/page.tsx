'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Esport } from "@prisma/client";
import SelectGame from "./_components/SelectGame";
import OptionCard from "./_components/OptionCard";
import { useCreateLeague, CreateLeagueResponse } from "@/hooks/leagues";
import { styleError, styleInput, styleLabel } from "@/components/Style";

export default function NewLeaguePage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setData] = useState({
    name: '',
    code: '',
    season: 0,
    region: '',
    selectedGame: null as Esport | null,
    formatLeague: '',
    groupFormat: '',
    playoffFormat: '',
  });

  const { mutate: createLeague, isPending } = useCreateLeague();

  const validateStepOne = () => {
    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.code.trim()) newErrors.code = "Code is required";
    if (!data.season || data.season <= 0) newErrors.season = "Season must be greater than 0";
    if (!data.region.trim()) newErrors.region = "Region is required";
    if (!data.selectedGame) newErrors.selectedGame = "Game must be selected";
    if (!data.formatLeague) newErrors.formatLeague = "Format league must be selected";
    return newErrors;
  };

  const handleSubmit = () => {
    const isValidGroupFormat = (value: unknown): value is "ROUND_ROBIN" | "SWISS" => {
      return value === "ROUND_ROBIN" || value === "SWISS";
    };

    const isValidPlayoffFormat = (value: unknown): value is "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION" => {
      return value === "SINGLE_ELIMINATION" || value === "DOUBLE_ELIMINATION";
    };
    const payload = {
      name: data.name,
      code: data.code,
      season: data.season,
      region: data.region,
      esportId: data.selectedGame!.id,
      format: data.formatLeague as "GROUP" | "KNOCKOUT" | "LADDER",
      groupFormat: isValidGroupFormat(data.groupFormat) ? data.groupFormat : undefined,
      playoffFormat: isValidPlayoffFormat(data.playoffFormat) ? data.playoffFormat : undefined,
      groupIsLock: false,
    };

    createLeague(payload, {
      onSuccess: (res: CreateLeagueResponse) => router.push(`/leagues/${res.league?.slug}`),
      onError: (err: Error) => setErrors({ general: err.message })
    });
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-[#de1e14] rounded-lg text-[#f0f0f0] space-y-6">
      <h1 className="text-xl font-bold text-center">Add New League</h1>

      {step === 1 && (
        <section className="space-y-4">
          <div>
            <label className={styleLabel}>Name</label>
            <input name="name" className={styleInput} value={data.name} onChange={(e) => setData(prev => ({ ...prev, name: e.target.value }))} />
            {errors.name && <p className={styleError}>{errors.name}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={styleLabel}>Code</label>
              <input name="code" className={styleInput} value={data.code} onChange={(e) => setData(prev => ({ ...prev, code: e.target.value }))} />
              {errors.code && <p className={styleError}>{errors.code}</p>}
            </div>
            <div className="flex-1">
              <label className={styleLabel}>Season</label>
              <input name="season" type="number" className={styleInput} value={data.season} onChange={(e) => setData(prev => ({ ...prev, season: parseInt(e.target.value) || 0 }))} />
              {errors.season && <p className={styleError}>{errors.season}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className={styleLabel}>Region</label>
              <input name="region" className={styleInput} value={data.region} onChange={(e) => setData(prev => ({ ...prev, region: e.target.value }))} />
              {errors.region && <p className={styleError}>{errors.region}</p>}
            </div>
            <div className="flex-1">
              <SelectGame onSelect={(game) => setData(prev => ({ ...prev, selectedGame: game }))} />
              {errors.selectedGame && <p className={styleError}>{errors.selectedGame}</p>}
            </div>
          </div>

          <h2 className="text-lg font-semibold">Choose League Format</h2>
          <div className="space-y-2">
            <OptionCard
              label="Group + Knockout"
              description="Mulai dengan fase grup (round robin/swiss) lalu knockout"
              selected={data.formatLeague === 'GROUP'}
              onClick={() => setData(prev => ({ ...prev, formatLeague: 'GROUP' }))}
            />
            <OptionCard
              label="Knockout Only"
              description="Langsung mulai sistem gugur"
              selected={data.formatLeague === 'KNOCKOUT'}
              onClick={() => setData(prev => ({ ...prev, formatLeague: 'KNOCKOUT' }))}
            />
            <OptionCard
              label="Ladder"
              description="Papan peringkat dinamis"
              selected={data.formatLeague === 'LADDER'}
              onClick={() => setData(prev => ({ ...prev, formatLeague: 'LADDER' }))}
            />
          </div>
          {errors.formatLeague && <p className={styleError}>{errors.formatLeague}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                const err = validateStepOne();
                if (Object.keys(err).length) return setErrors(err);
                setErrors({});
                setStep(data.formatLeague === 'GROUP' ? 2 : data.formatLeague === 'KNOCKOUT' ? 3 : 4);
              }}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 2 && data.formatLeague === 'GROUP' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Group Stage Format</h2>
          <OptionCard
            label="Round Robin"
            description="Semua tim bertemu satu sama lain sekali atau dua kali"
            selected={data.groupFormat === 'ROUND_ROBIN'}
            onClick={() => setData(prev => ({ ...prev, groupFormat: 'ROUND_ROBIN' }))}
          />
          <OptionCard
            label="Swiss"
            description="Setiap tim melawan tim dengan peringkat serupa di tiap ronde"
            selected={data.groupFormat === 'SWISS'}
            onClick={() => setData(prev => ({ ...prev, groupFormat: 'SWISS' }))}
          />

          <h2 className="text-lg font-bold mt-6">Playoff Format</h2>
          <OptionCard
            label="Single Elimination"
            description="Tim yang kalah langsung gugur dari turnamen. Hanya ada satu kesempatan untuk menang. Format ini cepat dan tegas, cocok untuk jumlah tim yang banyak atau waktu turnamen yang terbatas."
            selected={data.playoffFormat === 'SINGLE_ELIMINATION'}
            onClick={() => setData(prev => ({ ...prev, playoffFormat: 'SINGLE_ELIMINATION' }))}
          />
          <OptionCard
            label="Double Elimination"
            description="Tim yang kalah masih punya kesempatan kedua di lower bracket. Sebuah tim harus kalah dua kali untuk benar-benar tersingkir. Format ini lebih adil karena memberi kesempatan comeback."
            selected={data.playoffFormat === 'DOUBLE_ELIMINATION'}
            onClick={() => setData(prev => ({ ...prev, playoffFormat: 'DOUBLE_ELIMINATION' }))}
          />

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Back</button>
            <button type="button" onClick={() => setStep(4)} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Next</button>
          </div>
        </section>
      )}

      {step === 3 && data.formatLeague === 'KNOCKOUT' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Knockout Format</h2>
          <OptionCard
            label="Single Elimination"
            description="Tim yang kalah langsung gugur dari turnamen. Hanya ada satu kesempatan untuk menang. Format ini cepat dan tegas, cocok untuk jumlah tim yang banyak atau waktu turnamen yang terbatas."
            selected={data.playoffFormat === 'SINGLE_ELIMINATION'}
            onClick={() => setData(prev => ({ ...prev, playoffFormat: 'SINGLE_ELIMINATION' }))}
          />
          <OptionCard
            label="Double Elimination"
            description="Tim yang kalah masih punya kesempatan kedua di lower bracket. Sebuah tim harus kalah dua kali untuk benar-benar tersingkir. Format ini lebih adil karena memberi kesempatan comeback."
            selected={data.playoffFormat === 'DOUBLE_ELIMINATION'}
            onClick={() => setData(prev => ({ ...prev, playoffFormat: 'DOUBLE_ELIMINATION' }))}
          />

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Back</button>
            <button type="button" onClick={() => setStep(4)} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">Next</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-6">
          <h2 className="text-lg font-bold">Review League Info</h2>

          <div className="bg-white/10 p-4 rounded-lg text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><strong>Name:</strong> {data.name}</div>
            <div><strong>Code:</strong> {data.code}</div>
            <div><strong>Season:</strong> {data.season}</div>
            <div><strong>Region:</strong> {data.region}</div>
            <div><strong>Game:</strong> {data.selectedGame?.name}</div>
            <div><strong>Format:</strong> {data.formatLeague}</div>
            {data.groupFormat && <div><strong>Group Format:</strong> {data.groupFormat}</div>}
            {data.playoffFormat && <div><strong>Playoff Format:</strong> {data.playoffFormat}</div>}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(data.formatLeague === 'KNOCKOUT' ? 3 : 2)}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
