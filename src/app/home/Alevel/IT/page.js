'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Monoton } from 'next/font/google'
import books from './IT_Books.json' //
import Yearly from '@/components/yearly'
import yearlyData from './IT_Yearly.json'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [showBooks, setShowBooks] = useState(false)
  const router = useRouter()
  const [showPapers, setShowPapers] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setUser({ username: 'User' })
    }
  }, [])

  const allYears = [...new Set(yearlyData.map(item => item.id.split('_')[1]))].sort().reverse()
  const [year, setYear] = useState('2025')
  const [session, setSession] = useState('march') 
  const [paperGroup, setPaperGroup] = useState('1')
     const filtered = yearlyData.filter(item => {
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
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              Books
            </h1>
            <button
              onClick={() => setShowBooks(!showBooks)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showBooks ? 'Hide' : 'Show'}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showBooks ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {books.map((book, idx) => (
              <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
                <PDF {...book} />
              </div>
            ))}
          </div>
        </section>
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
                <option value="march">February/March</option>
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
