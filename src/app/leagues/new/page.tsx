'use client'

import { Game } from "@prisma/client";
import SelectGame from "./_components/SelectGame";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { styleError, styleInput, styleLabel } from "@/components/Style";

type dataProps = {
  name: string;
  code: string;
  season: number;
  region: string;
  selectedGame: Game | null;
  formatLeague: string;
  formatMatch: string;
};

export default function NewLeaguePage() {
  const [data, setData] = useState<dataProps>({
    name: '',
    code: '',
    season: 0,
    region: '',
    selectedGame: null,
    formatLeague: '',
    formatMatch: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const newErrors: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {};
    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    } else {
      payload.name = data.name;
    }

    if (!data.code.trim()) {
      newErrors.code = "Code is required";
    } else {
      payload.code = data.code;
    }

    if (!data.season || data.season <= 0) {
      newErrors.season = "Season must be greater than 0";
    } else {
      payload.season = data.season;
    }

    if (!data.region.trim()) {
      newErrors.region = "Region is required";
    } else {
      payload.region = data.region;
    }

    if (!data.selectedGame) {
      newErrors.selectedGame = "Game must be selected";
    } else {
      payload.gameId = data.selectedGame.id;
    }

    if (!data.formatLeague) {
      newErrors.formatLeague = "Format League must be selected";
    } else {
      payload.format = data.formatLeague;
    }

    if (!data.formatMatch) {
      newErrors.formatMatch = "Format Match must be selected";
    } else {
      payload.groupMatchFormat = data.formatMatch;
    }


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log("Form data valid:", payload);
    try {
      const response = await fetch("/api/leagues/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

      })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
      const data = await response.json();
      console.log("Success:", data);
      setLoading(false)
      router.push(`/leagues/${data.league?.slug}`)

    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'An unknown error occurred' });
      }
    }
  };

  return (
    <main className="w-150 mx-auto">
      <header>
        <h1 className="py-8 text-xl font-bold text-center">Add New League</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-5 p-5" autoComplete="off">
        <section className="flex-1 bg-[#819A91] rounded-lg p-5 space-y-5">
          <div>
            <label htmlFor="name" className={styleLabel}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={styleInput}
              value={data.name}
              onChange={handleChange}
            />
            {errors.name && <p className={styleError}>{errors.name}</p>}
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="code" className={styleLabel}>Code</label>
              <input
                type="text"
                id="code"
                name="code"
                className={styleInput}
                value={data.code}
                onChange={handleChange}
              />
              {errors.code && <p className={styleError}>{errors.code}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="season" className={styleLabel}>Season</label>
              <input
                type="number"
                id="season"
                name="season"
                className={styleInput}
                value={data.season}
                onChange={handleChange}
              />
              {errors.season && <p className={styleError}>{errors.season}</p>}
            </div>

          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="region" className={styleLabel}>Region</label>
              <input
                type="text"
                id="region"
                name="region"
                className={styleInput}
                value={data.region}
                onChange={handleChange}
              />
              {errors.region && <p className={styleError}>{errors.region}</p>}
            </div>
            <div className="flex-1">
              <SelectGame
                onSelect={(game) => {
                  setData(prev => ({ ...prev, selectedGame: game }));
                  setErrors(prev => ({ ...prev, selectedGame: '' }));
                }}
              />
              {errors.selectedGame && <p className={styleError}>{errors.selectedGame}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="formatLeague" className={styleLabel}>Format League</label>
              <select
                name="formatLeague"
                id="formatLeague"
                className={styleInput}
                value={data.formatLeague}
                onChange={handleChange}
              >
                <option value="" disabled>-- Format --</option>
                <option value="GROUP_STAGE">Group Stage</option>
                <option value="REGULAR">Regular Stage</option>
              </select>
              {errors.formatLeague && <p className={styleError}>{errors.formatLeague}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="formatMatch" className={styleLabel}>Format Match</label>
              <select
                name="formatMatch"
                id="formatMatch"
                className={styleInput}
                value={data.formatMatch}
                onChange={handleChange}
              >
                <option value="" disabled>-- Best Of --</option>
                <option value="BO1">BO1</option>
                <option value="BO2">BO2</option>
                <option value="BO3">BO3</option>
                <option value="BO5">BO5</option>
                <option value="BO7">BO7</option>
              </select>
              {errors.formatMatch && <p className={styleError}>{errors.formatMatch}</p>}
            </div>
          </div>
          <p className="text-xs">**Setelah melanjutkan data yang diisi tidak bisa diubah kembali</p>
          <div className="flex justify-end">
            <button type="submit" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" disabled={loading}>Next</button>
          </div>
        </section>
      </form>
    </main>
  );
}
