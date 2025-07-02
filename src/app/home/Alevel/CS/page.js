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
  const [showBooks, setShowBooks] = useState(false) // Collapsed by default
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
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Cambridge University Press"
                text1="View Book"
                link1="https://drive.google.com/file/d/1LmBS_T53lcIr6ia8s3ivYGAR9dyeMWXe/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="AS and A Level CS"
                text1="View Book"
                link1="https://drive.google.com/file/d/1J3zyYx5svgA0koRyHkaMCsZYLrw8Jtlc/view?usp=drive_link"
                size="3"
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
