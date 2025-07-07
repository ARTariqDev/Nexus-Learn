'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import { Monoton } from 'next/font/google'
import Footer from '@/components/footer'
import topicals from './Maths_Topicals.json'

// Load Monoton font
const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HomePage() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const [showTopicals, setShowTopicals] = useState(false)
  const [showP3Topicals, setShowP3Topicals] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      setUser({ username: 'User' })
    }
  }, [])

  const toggleTopicals = () => {
    setShowTopicals((prev) => !prev)
    setShowP3Topicals(false)
  }

  const toggleP3Topicals = () => {
    setShowP3Topicals((prev) => !prev)
    setShowTopicals(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">

        {/* Topicals P1 Section */}
        <section className="container p-6 mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              Topicals P1
            </h1>
            <button
              onClick={toggleTopicals}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showTopicals ? 'Hide' : 'Show'}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showTopicals ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {topicals.p1.map((item, idx) => (
              <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
                <PDF {...item} />
              </div>
            ))}
          </div>
        </section>

        {/* Topicals P3 Section */}
        <section className="container p-6 mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              Topicals P3
            </h1>
            <button
              onClick={toggleP3Topicals}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showP3Topicals ? 'Hide' : 'Show'}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showP3Topicals ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {topicals.p3.map((item, idx) => (
              <div key={idx} className={`fade-in fade-delay-${idx + 1} mx-auto`}>
                <PDF {...item} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
