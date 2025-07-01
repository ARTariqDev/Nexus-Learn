'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      router.push('/home')
    } else {
      setError(data.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111111]">
      <form
        onSubmit={handleLogin}
        className="bg-[#121212] p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

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
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <Link href="/signup">
          <button className="w-full bg-[#ffaa00] text-black font-semibold py-3 rounded hover:opacity-90 mt-2">
            Signup
          </button>
        </Link>}
      </form>
    </div>
  )
}
