'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import { Monoton } from 'next/font/google'
import Footer from '@/components/footer'

// Load Monoton font
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

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        {/* SAT - English Section */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              SAT - English
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
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Erica Meltzer SAT Grammar"
                text1="View Book"
                link1="https://drive.google.com/file/d/1Z0aHjT3TwrDbL_SMHWlNOyqiMCSO1192/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF
                name="Erica Meltzer SAT Reading"
                text1="View Book"
                link1="https://drive.google.com/file/d/1TmxAPQAZdsy7ayKGiRdI0IpKitIEa7KH/view?usp=sharing"
                size="3"
              />
            </div>
          </div>
        </section>

        {/* SAT - Maths Section */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              SAT - Maths
            </h1>
            <button
              onClick={() => setShowMath(!showMath)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showMath ? 'Hide' : 'Show'}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showMath ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="1600.io Maths Orange Book"
                text1="View Book"
                link1="https://drive.google.com/file/d/1cgEjozVjllvomoRLK1yhJQmJUEeLho1O/view?usp=sharing"
                size="3"
              />
            </div>
          </div>
        </section>

        {/* Combined Section */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              SAT - Combined Resources
            </h1>
            <button
              onClick={() => setShowCombined(!showCombined)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showCombined ? 'Hide' : 'Show'}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showCombined ? 'max-h-[500rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Princeton review (2024)"
                text1="View Book"
                link1="https://drive.google.com/file/d/1EC0bbFWLVgEkrt2qTiU0wzc_NI9nALtP/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Digital SAT June 2023"
                text1="View Book"
                link1="https://drive.google.com/file/d/1LGIwZ713RirhG9pQhATmX6FOE2yNS1T5/view?usp=sharing"
                size="4"
              />
            </div>
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Digital SAT Nov 2023"
                text1="View Book"
                link1="https://drive.google.com/file/d/1927mMCIJgRF2EmVUVYhAb5Mr_HB1n3k4/view?usp=sharing"
                size="4"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
