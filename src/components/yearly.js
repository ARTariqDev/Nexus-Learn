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
  '1': 'text-base',
  '2': 'text-lg',
  '3': 'text-xl',
  '4': 'text-2xl',
  '5': 'text-3xl',
  '6': 'text-4xl',
}

const Yearly = ({ name, size, qp, ms, sf, text1, text2, text3, id }) => {
  const [username, setUsername] = useState(null)
  const [scored, setScored] = useState('')
  const [total, setTotal] = useState('')
  const [percentage, setPercentage] = useState(null)

  const subject =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/')[3] || 'unknown'
      : 'unknown'

  const paper = id

  useEffect(() => {
    if (!paper || !subject) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const decoded = jwtDecode(token)
      setUsername(decoded.username)

      const url = `/api/scores?username=${decoded.username}&subject=${subject}&paper=${paper}`
      console.log('Fetching score from:', url)

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched score data:', data)
          if (data && data.score !== undefined) {
            setScored(data.scored?.toString() || '')
            setTotal(data.total?.toString() || '')
            setPercentage(data.score)
          } else {
            setScored('')
            setTotal('')
            setPercentage(null)
            console.warn('No score found for this variant.')
          }
        })
        .catch((err) => console.error('Fetch error:', err))
    } catch (err) {
      console.error('Token decode error:', err)
    }
  }, [paper, subject])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username) return alert('You must be logged in to submit a score.')

    const scoredInput = parseFloat(scored)
    const totalInput = parseFloat(total)
    if (isNaN(scoredInput) || isNaN(totalInput) || totalInput === 0) {
      return alert('Please enter valid marks.')
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
      setScored(scoredInput.toString())
      setTotal(totalInput.toString())
      alert(`Score saved! You got ${percent.toFixed(2)}%`)
    } else {
      alert(data.error || 'Error saving score')
    }
  }

  return (
    <div className="relative group bg-[#111111] border-2 border-[#6c6c6c] rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 flex flex-col justify-between w-[16rem] h-auto">
      {/* Title */}
      <h2
        className={`${monoton.className} ${
          sizeMap[size] || 'text-xl'
        } text-[#ffaa00] text-center mb-2 break-words leading-tight`}
      >
        {name}
      </h2>

      {/* Score Display */}
      {scored !== '' && total !== '' && percentage !== null && (
        <div className="mb-1 text-center text-xs text-gray-300">
          <p>
            <strong>{scored}</strong> / {total} → {percentage.toFixed(2)}%
          </p>
        </div>
      )}

      {/* QP / MS / SF Buttons */}
      <div className="grid grid-cols-2 gap-1 mb-1">
        {qp && text1 && (
          <a
            href={qp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-3 py-1.5 rounded text-xs text-center hover:bg-transparent hover:text-[#ffaa00] hover:border hover:border-[#ffaa00] transition"
          >
            {text1 === 'View Question Paper' ? 'QP' : text1}
          </a>
        )}
        {ms && text2 && (
          <a
            href={ms}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-3 py-1.5 rounded text-xs text-center hover:bg-transparent hover:text-[#ffaa00] hover:border hover:border-[#ffaa00] transition"
          >
            {text2 === 'View Mark Scheme' ? 'MS' : text2}
          </a>
        )}
        {sf && text3 && (
          <a
            href={sf}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ffaa00] text-black font-semibold px-3 py-1.5 rounded text-xs text-center hover:bg-transparent hover:text-[#ffaa00] hover:border hover:border-[#ffaa00] transition col-span-2"
          >
            {text3 === 'View Source Files' ? 'SF' : text3}
          </a>
        )}
      </div>

      {/* Score Inputs and Submit */}
      <form onSubmit={handleSubmit} className="space-y-1 mt-auto">
        <div className="grid grid-cols-2 gap-1">
          <input
            type="number"
            step="any"
            value={scored}
            onChange={(e) => setScored(e.target.value)}
            placeholder="Scored"
            className="px-2 py-1 rounded bg-[#1a1a1a] text-white text-xs border border-[#444] focus:outline-none focus:ring-1 focus:ring-[#ffaa00]"
            required
          />
          <input
            type="number"
            step="any"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="Total"
            className="px-2 py-1 rounded bg-[#1a1a1a] text-white text-xs border border-[#444] focus:outline-none focus:ring-1 focus:ring-[#ffaa00]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#ffaa00] text-black text-xs font-bold py-1.5 rounded hover:opacity-90 transition"
        >
          Save Score
        </button>
      </form>
    </div>
  )
}

export default Yearly
