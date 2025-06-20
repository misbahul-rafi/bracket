'use client'

import { useState } from "react";
import { useCreateEsport } from "@/hooks/esports";
import { useRouter } from "next/navigation";

const styleLabel = "block text-sm font-medium text-gray-700 mb-1";
const styleInput = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm";
const styleError = "text-red-500 text-xs mt-1";

export default function NewEsportPage() {
  const [data, setData] = useState({ name: '', description: '', imageUrl: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter()
  const { mutate, isPending } = useCreateEsport();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    mutate(data, {
      onSuccess: () => {
        router.push("profiles")
      },
      onError: (err: Error) => {
        setApiError(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Add New Esport</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "description", "imageUrl"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className={styleLabel}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                className={styleInput}
                value={data[field as keyof typeof data] || ''}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors[field] && <p className={styleError}>{errors[field]}</p>}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-4">
            <div className="w-full">
              {apiError && <p className={styleError}>{apiError}</p>}
            </div>
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