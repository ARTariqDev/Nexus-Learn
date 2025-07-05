'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Monoton } from 'next/font/google'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Header from '@/components/header'
import Footer from '@/components/footer'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const monoton = Monoton({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })

const StatsPage = () => {
  const [username, setUsername] = useState(null)
  const [subject, setSubject] = useState('CS')
  const [paperFilter, setPaperFilter] = useState('1')
  const [timeRange, setTimeRange] = useState('all')
  const [scores, setScores] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUsername(decoded.username)
      } catch (err) {
        console.error('Invalid token:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (username) {
      fetch(`/api/scores?username=${username}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setScores(data)
        })
        .catch(err => console.error('Error fetching scores:', err))
    }
  }, [username])

  const getTimeThreshold = () => {
    const now = new Date()
    switch (timeRange) {
      case '1d':
        return new Date(now.setDate(now.getDate() - 1))
      case '3d':
        return new Date(now.setDate(now.getDate() - 3))
      case '1w':
        return new Date(now.setDate(now.getDate() - 7))
      case '1m':
        return new Date(now.setMonth(now.getMonth() - 1))
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1))
      default:
        return null
    }
  }

  const timeThreshold = getTimeThreshold()

  const filtered = scores
    .filter(s => {
      const variant = s.paper.split('_')[2] || ''
      const matchesSubjectAndPaper = s.subject === subject && variant.startsWith(paperFilter)
      const date = new Date(s.date)
      const inTimeRange = timeThreshold ? date >= timeThreshold : true
      return matchesSubjectAndPaper && inTimeRange
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = {
    labels: filtered.map(s => new Date(s.date).toLocaleDateString()),
    datasets: [
      {
        label: `${subject} - Paper ${paperFilter}X`,
        data: filtered.map(s => parseFloat(s.score.toFixed(2))),
        borderColor: '#ffaa00',
        backgroundColor: '#ffaa00',
        tension: 0.2,
        fill: false
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#ffffff' }
      }
    },
    layout: {
      padding: 20
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#ffffff' },
        title: {
          display: true,
          text: 'Score (%)',
          color: '#ffffff'
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <div className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        <h1 className={`${monoton.className} text-3xl font-bold mb-6 text-center text-[#ffaa00]`}>
            Performance Stats
        </h1>

        <div className="mb-6 flex gap-4 flex-wrap justify-center">
          {/* Subject Dropdown */}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
          >
            <option value="CS">Computer Science</option>
            <option value="Physics">Physics</option>
            <option value="Maths">Maths</option>
            <option value="English">English</option>
            <option value="FM">Further Maths</option>
            <option value="IT">IT</option>
          </select>

          {/* Paper Filter Dropdown */}
          <select
            value={paperFilter}
            onChange={(e) => setPaperFilter(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
          >
            <option value="1">Paper 1 (11, 12, 13)</option>
            <option value="2">Paper 2 (21, 22, 23)</option>
            <option value="3">Paper 3 (31, 32, 33)</option>
            <option value="4">Paper 4 (41, 42, 43)</option>
            <option value="5">Paper 5 (51, 52, 53)</option>
          </select>

          {/* Time Range Dropdown */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
          >
            <option value="all">All Time</option>
            <option value="1d">Past Day</option>
            <option value="3d">Past 3 Days</option>
            <option value="1w">Past Week</option>
            <option value="1m">Past Month</option>
            <option value="1y">Past Year</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="rounded-xl border border-gray-500 bg-[#2c2c2c] p-6 shadow-lg mx-auto" style={{ height: '70vh', width: '75vw' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-8">No data found for this selection.</p>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default StatsPage
