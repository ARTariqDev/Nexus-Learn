'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Monoton } from 'next/font/google'
import books from './IT_Books.json' // <-- Import the JSON

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function HomePage() {
  const [user, setUser] = useState(null)
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
      </div>

      <Footer />
    </div>
  )
}
