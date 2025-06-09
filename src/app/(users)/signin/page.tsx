'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    setLoading(false)

    if (res?.ok) {
      router.push('/')
    } else {
      setError('Email atau password salah!')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#C51605] p-8 rounded-lg w-full max-w-md shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <div className="bg-red-500 text-white text-sm px-4 py-2 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username atau Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-600 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-600 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm">
          Belum punya akun?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </form>
    </main>
  )
}
