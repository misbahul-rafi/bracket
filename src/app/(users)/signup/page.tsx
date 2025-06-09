'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password }),
    })

    if (res.ok) {
      router.push('/signin')
    } else {
      const data = await res.json()
      alert(data.error || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-md shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}
