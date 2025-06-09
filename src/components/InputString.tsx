'use client'

import React from 'react'

type Props = {
  type?: string,
  name: string,
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export default function InputString({
  type= 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  ...rest
}: Props) {
  return (
    <div className='flex-1'>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      />
    </div>
  )
}
