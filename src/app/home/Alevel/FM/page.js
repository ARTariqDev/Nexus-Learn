'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Yearly from '@/components/yearly'
import { Monoton } from 'next/font/google'

import books from './FM_Books.json'
import sirAmjad from './FM_SA.json'
import fmYearlyData from './FM_Yearly.json'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function FurtherMathsPage() {
  const [user, setUser] = useState(null)
  const [showFM1, setShowFM1] = useState(false)
  const [showFM2, setShowFM2] = useState(false)
  const [showBooks, setShowBooks] = useState(false)
  const [showPapers, setShowPapers] = useState(false)

  const [year, setYear] = useState('2024')
  const [session, setSession] = useState('november') // or 'june'
  const [paperGroup, setPaperGroup] = useState('1')

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setUser({ username: 'User' })
    }
  }, [])

  const allYears = [...new Set(fmYearlyData.map(item => item.id.split('_')[1]))].sort().reverse()

  const filtered = fmYearlyData.filter(item => {
    const [sess, yr, code] = item.id.split('_')
    return (
      sess === session.toLowerCase() &&
      yr === year &&
      code.startsWith(paperGroup)
    )
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        {/* Sir Amjad Topicals */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>Topicals - Sir Amjad</h1>
            <button
              onClick={() => setShowFM1(!showFM1)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showFM1 ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${showFM1 ? 'max-h-[500rem] opacity-100 animate-fade' : 'max-h-0 opacity-0'}`}>
            {sirAmjad.map((paper, idx) => (
              <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
                <PDF {...paper} />
              </div>
            ))}
          </div>
        </section>

        {/* 2012–2021 Topicals */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>Topicals 2012–2021</h1>
            <button
              onClick={() => setShowFM2(!showFM2)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showFM2 ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${showFM2 ? 'max-h-[500rem] opacity-100 animate-fade' : 'max-h-0 opacity-0'}`}>
            <PDF
              name="Topicals (2012–2021)"
              text1="Question paper"
              link1="https://drive.google.com/file/d/1v3pu28h3QXz0WAdP7Q4v8omZN5McwCUD/view?usp=sharing"
              size="4"
            />
          </div>
        </section>

        {/* FM Books */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>Further Maths Books</h1>
            <button
              onClick={() => setShowBooks(!showBooks)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showBooks ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${showBooks ? 'max-h-[500rem] opacity-100 animate-fade' : 'max-h-0 opacity-0'}`}>
            {books.map((book, idx) => (
              <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
                <PDF {...book} />
              </div>
            ))}
          </div>
        </section>

        {/* FM Yearly Past Papers */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>Yearly Past Papers</h1>
            <button
              onClick={() => setShowPapers(!showPapers)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showPapers ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showPapers ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex gap-6 flex-wrap mb-6">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
              >
                {allYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
              >
                <option value="june">May/June</option>
                <option value="november">October/November</option>
              </select>
              <select
                value={paperGroup}
                onChange={(e) => setPaperGroup(e.target.value)}
                className="bg-[#1a1a1a] text-white px-4 py-2 rounded border border-gray-600"
              >
                <option value="1">Paper 1 (11, 12, 13)</option>
                <option value="2">Paper 2 (21, 22, 23)</option>
                <option value="3">Paper 3 (31, 32, 33)</option>
                <option value="4">Paper 4 (41, 42, 43)</option>
              </select>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-1 ml-4">
                {filtered.map((item, index) => (
                  <Yearly key={index} {...item} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-6">No papers found for this selection.</p>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
