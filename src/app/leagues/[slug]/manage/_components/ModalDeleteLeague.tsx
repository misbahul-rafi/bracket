'use client'

import { useState } from "react"

type Props = {
  onConfirm: () => void
  onCancel: () => void
  leagueName?: string
}

export default function ModalDeleteLeague({ onConfirm, onCancel, leagueName }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Hapus Liga
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Apakah kamu yakin ingin menghapus liga{' '}
          <span className="font-bold">{leagueName || 'ini'}</span>? Tindakan ini tidak bisa dibatalkan.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
