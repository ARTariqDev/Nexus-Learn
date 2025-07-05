'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Monoton } from 'next/font/google'
import books from './FM_Books.json'
import sirAmjad from './FM_SA.json'

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
        {/* Sir Amjad Topicals */}
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`${monoton.className} text-white text-3xl`}>Topicals-Sir Amjad</h1>
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
            <h1 className={`${monoton.className} text-white text-3xl`}>Topicals 2012-2021</h1>
            <button
              onClick={() => setShowFM2(!showFM2)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showFM2 ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${showFM2 ? 'max-h-[500rem] opacity-100 animate-fade' : 'max-h-0 opacity-0'}`}>
            <PDF
              name="Topicals (2012-2021)"
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
      </div>

      <Footer />
    </div>
  )
}
