'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import { Monoton } from 'next/font/google'
import Footer from '@/components/footer'
import resources from './SAT.json' // Import JSON data

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [showBooks, setShowBooks] = useState(false)
  const [showMath, setShowMath] = useState(false)
  const [showCombined, setShowCombined] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setUser({ username: 'User' })
    }
  }, [])

  const renderSection = (title, showState, toggleFn, data) => (
    <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className={`${monoton.className} text-white text-3xl`}>{title}</h1>
        <button
          onClick={toggleFn}
          className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
        >
          {showState ? 'Hide' : 'Show'}
        </button>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
          showState ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {data.map((item, idx) => (
          <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
            <PDF {...item} />
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        {renderSection('SAT - English', showBooks, () => setShowBooks(!showBooks), resources.english)}
        {renderSection('SAT - Maths', showMath, () => setShowMath(!showMath), resources.maths)}
        {renderSection('SAT - Combined Resources', showCombined, () => setShowCombined(!showCombined), resources.combined)}
      </div>

      <Footer />
    </div>
  )
}
