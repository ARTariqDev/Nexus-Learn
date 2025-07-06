'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Resources from '@/components/resources'
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
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8">
          <h1 className={`${monoton.className} text-center text-white text-3xl mb-8`}>
             A level
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
            <div className="fade-in fade-delay-1 mx-auto">
              <Resources head="Physics  9702" link="Alevel/Physics" size="3"/>
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <Resources head="Maths  9709" link="Alevel/Maths" size="3"/>
            </div>
            <div className="fade-in fade-delay-3 mx-auto">
              <Resources head="ComputerScience  9618" link="Alevel/CS" size="2"/>
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <Resources head="Further Maths  9231" link="Alevel/FM" size="2"/>
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <Resources head="Information Technology 9626" link="Alevel/IT" size="2"/>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}

