'use client'

import { useState } from "react";

const styleLabel = "block text-sm font-medium text-gray-700 mb-1";
const styleInput = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm";
const styleError = "text-red-500 text-xs mt-1";

export default function ModalAddTeam({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState({
    name: '',
    code: '',
    region: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!data.name.trim()) newErrors.name = "Name is required";
    if (!data.code.trim()) newErrors.code = "Code is required";
    if (!data.region.trim()) newErrors.region = "Region is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log("Submitting:", data);
      onClose(); // close modal after submit
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-4">Add New Team</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
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

          <div>
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

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
