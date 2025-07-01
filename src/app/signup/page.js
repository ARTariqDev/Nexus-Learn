'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      router.push('/login')
    } else {
      const data = await res.json()
      setError(data.error || 'Signup failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <form
        onSubmit={handleSignup}
        className="bg-[#121212] p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-[#111111] border border-gray-700 text-white rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-[#111111] border border-gray-700 text-white rounded mb-6"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#ffaa00] text-black font-semibold py-3 rounded hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
        {error && <Link href="/login">
          <button className="w-full bg-[#ffaa00] text-black font-semibold py-3 rounded hover:opacity-90 mt-2">
            Log In
          </button>
        </Link>}
      </form>
    </div>
  )
}
