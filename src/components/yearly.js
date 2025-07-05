'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Monoton } from 'next/font/google'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const sizeMap = {
  '1': 'text-xl',
  '2': 'text-2xl',
  '3': 'text-3xl',
  '4': 'text-4xl',
  '5': 'text-5xl',
  '6': 'text-6xl',
}

const Yearly = ({ name, size, qp, ms, sf, text1, text2, text3, id }) => {
  const [username, setUsername] = useState(null)
  const [scored, setScored] = useState('')
  const [total, setTotal] = useState('')
  const [percentage, setPercentage] = useState(null)

  const subject = typeof window !== 'undefined' ? window.location.pathname.split('/')[3] || 'unknown' : 'unknown'
  const paper = id

  useEffect(() => {
    // Reset scores when paper ID changes
    setScored('')
    setTotal('')
    setPercentage(null)

    const token = localStorage.getItem('token')
    if (token && typeof window !== 'undefined') {
      try {
        const decoded = jwtDecode(token)
        setUsername(decoded.username)

        // Fetch saved score
        fetch(`/api/scores?username=${decoded.username}&subject=${subject}&paper=${paper}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.score !== undefined) {
              setPercentage(data.score)
              setScored(data.scored || '')
              setTotal(data.total || '')
            }
          })
          .catch(err => console.error('Fetch error:', err))
      } catch (err) {
        console.error('Invalid token:', err)
      }
    }
  }, [subject, paper])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username) {
      alert('You must be logged in to submit a score.')
      return
    }

    const scoredInput = parseFloat(scored)
    const totalInput = parseFloat(total)

    if (isNaN(scoredInput) || isNaN(totalInput) || totalInput === 0) {
      alert('Please enter valid marks.')
      return
    }

    const percent = (scoredInput / totalInput) * 100

    const res = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        subject,
        paper,
        scored: scoredInput,
        total: totalInput,
        score: percent,
        date: new Date(),
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setPercentage(percent)
      alert(`Score saved! You got ${percent.toFixed(2)}%`)
    } else {
      alert(data.error || 'Error saving score')
    }
  }

  return (
    <div className="relative group bg-[#111111] border-2 border-[#6c6c6c] rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col justify-between w-[20rem] transform">
      <h2 className={`${monoton.className} ${sizeMap[size] || 'text-2xl'} text-[#ffaa00] text-center mb-4 break-words leading-snug mt-4`}>
        {name}
      </h2>

      {/* PDF Links */}
      <div className="flex flex-col gap-2 mb-4">
        {qp && text1 && (
          <a
            href={qp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all text-center"
          >
            {text1}
          </a>
        )}
        {ms && text2 && (
          <a
            href={ms}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all text-center"
          >
            {text2}
          </a>
        )}
        {sf && text3 && (
          <a
            href={sf}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-6 py-2 rounded-xl hover:bg-transparent hover:text-[#ffaa00] hover:border-2 hover:border-[#ffaa00] transition-all text-center"
          >
            {text3}
          </a>
        )}
      </div>

      {/* Display stored score */}
      {percentage !== null && (
        <div className="mb-4 text-center text-sm text-gray-300">
          <p><strong>Scored:</strong> {scored} / {total}</p>
          <p><strong>Percentage:</strong> {percentage.toFixed(2)}%</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="scored"
          type="number"
          step="any"
          value={scored}
          onChange={(e) => setScored(e.target.value)}
          placeholder="Marks Scored"
          className="px-3 py-2 rounded w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          required
        />
        <input
          name="total"
          type="number"
          step="any"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="Total Marks"
          className="px-3 py-2 rounded w-full bg-[#1a1a1a] text-white placeholder-gray-400 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#ffaa00]"
          required
        />
        <button
          type="submit"
          className="bg-[#ffaa00] text-black font-bold px-4 py-2 rounded w-full hover:opacity-90 transition-all"
        >
          Submit Score
        </button>
      </form>
    </div>
  )
}

export default Yearly
