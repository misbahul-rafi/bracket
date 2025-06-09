'use client'

import { useState } from 'react'

interface ModalCheckReturnProps {
  data: any,
  onClose: () => void;
}

export default function ModalCheckReturn({ data, onClose }: ModalCheckReturnProps) {


  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-2xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Check Return
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => onClose()}
          >
            ✕
          </button>
        </div>

        <pre className="text-sm text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[400px]">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}
