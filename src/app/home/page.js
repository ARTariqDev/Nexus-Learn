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
  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white">
      <div className="border-b border-[#1a1a1a] shadow-md">
        <Header />
      </div>

      <div className="flex-1">
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8">
          <h1 className={`${monoton.className} text-center text-white text-3xl mb-8`}>
            Resources
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="fade-in fade-delay-1 mx-auto">
              <Resources head="O Levels" link="/" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <Resources head="A Levels" link="Alevel" />
            </div>
            <div className="fade-in fade-delay-3 mx-auto">
              <Resources head="IGCSE" link="/" />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <Resources head="SAT" link="SAT" />
            </div>
          </div>
        </section>

        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 min-h-[15rem]">
          <h1 className={`text-gray-400  text-center text-5xl ${monoton.className}`}>
            Under Construction, more<br />features on the Way!
          </h1>
        </section>
      </div>

      <Footer />
    </div>
  )
}
