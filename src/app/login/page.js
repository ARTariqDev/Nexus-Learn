'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('') // can be username or email
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
      body: JSON.stringify({ identifier, password }), // pass identifier instead of username
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      // Redirect based on user role
      const redirectPath = data.redirectTo || '/home'
      router.push(redirectPath)
    } else {
      setError(data.error || 'Login failed')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="bg-[#121212] p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            className="w-full bg-[#ffaa00] text-black font-semibold py-3 rounded hover:opacity-90 transition-all"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && (
            <div className="mt-3">
              <Link href="/signup">
                <button className="w-full bg-[#ffaa00] text-black font-semibold py-3 rounded hover:opacity-90 transition-all">
                  Signup
                </button>
              </Link>
            </div>
          )}
        </form>
      </main>

      <Footer />
    </div>
  )
}
