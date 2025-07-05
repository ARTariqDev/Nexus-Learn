'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PDF from '@/components/pdf'
import Header from '@/components/header'
import { Monoton } from 'next/font/google'
import Footer from '@/components/footer'

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function FurtherMathsPage() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const [showFM1, setShowFM1] = useState(false)
  const [showFM2, setShowFM2] = useState(false)
  const [showBooks,setShowBooks] = useState(false)

  const books = [
  {
    name: "Further Pure 1",
    text1: "View Book",
    link1: "https://drive.google.com/file/d/1-FdvqefvIlaHh_GCBxybSlSnQixLS2g0/view?usp=sharing",
    size: "4"
  },
  {
    name: "Further Pure 2",
    text1: "View Book",
    link1: "https://drive.google.com/file/d/1jWskuin_d1W3FZbtox00uXb-qNF_nhSx/view?usp=sharing",
    size: "4"
  },
  {
    name: "Further Pure Maths",
    text1: "View Book",
    link1: "https://drive.google.com/file/d/1bywvrE7sRiw2TXnaTskHmsNYCqxGNsZC/view?usp=sharing",
    size: "4"
  },
  {
    name: "CIE Further Maths Full",
    text1: "View Book",
    link1: "https://drive.google.com/file/d/1Fl5V5MypUmZ5-Ay2QpFnwzwMHrLjWZ9S/view?usp=sharing",
    size: "4"
  }
]

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
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF name="Mathematical Induction" text1="Question paper" link1="https://drive.google.com/file/d/1eAfPSvrUDdnUWgFGKnfDak_FF4aCJliE/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Induction Of Sequences" text1="Question paper" link1="https://drive.google.com/file/d/1pRIHjPt1Pk1U8QSdsG0mVbZgF_2T8rn9/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Divisibility" text1="Question paper" link1="https://drive.google.com/file/d/16ScI7V6IxNTcyhPqW9_yaDdJ6CJjdxS5/view?usp=sharing" size="4" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Method of Differences" text1="Question paper" link1="https://drive.google.com/file/d/1nCfIMTKrN7hkeEPX18Q5endNfFtdLIXn/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Eigen Values and Eigen Vectors" text1="Question paper" link1="https://drive.google.com/file/d/1h4Qw1vEJ4gSxcQVPpHdbCZxuBZ7a5cAt/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Polynomial Equations" text1="Question paper" link1="https://drive.google.com/file/d/1boUCQph569xTXNT1u3Ib2FLsMuvTlNdh/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Matrix Transformation" text1="Question paper" link1="https://drive.google.com/file/d/190_7eKNBiJ2wuJW_mjSh3EasQfTtlxCg/view?usp=sharing" size="2" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Matrices and Solutions of Linear Equations" text1="Question paper" link1="https://drive.google.com/file/d/1on6sjNLYMpTSB4r_A3mJ3MDrYypII5fZ/view?usp=sharing" size="2" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Vectors" text1="Question paper" link1="https://drive.google.com/file/d/1FCP5k9RAMIeJY6wrzLs9p5U4mpE0_gcA/view?usp=sharing" size="5" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Planes" text1="Question paper" link1="https://drive.google.com/file/d/14-KThg518v4R8pYvaRXrE2XigUJXRLY2/view?usp=sharing" size="5" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Complex Numbers" text1="Question paper" link1="https://drive.google.com/file/d/14OYuv81ieekuD84f3u-84KO1kwjLsjBN/view?usp=sharing" size="4" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Sum Of Complex Numbers" text1="Question paper" link1="https://drive.google.com/file/d/12biw0hKGdRDk8IMBS2U6wh0yGrKBnmPs/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Hyperbolic Functions" text1="Question paper" link1="https://drive.google.com/file/d/1Dfo_aynfYleh4640NZ5nMepGbcOXma-s/view?usp=sharing" size="4" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Differential Equations" text1="Question paper" link1="https://drive.google.com/file/d/1vkl29VLWGpTfD0r37r12ew5Xv41aRk9q/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Rational Functions" text1="Question paper" link1="https://drive.google.com/file/d/1n7NwSRGN3bmA6pk5KqMeIsx1Y3b4KeVl/view?usp=sharing" size="4" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Polar Coordinates" text1="Question paper" link1="https://drive.google.com/file/d/1FJg-mOrRJjHSrM77aBVkrlYSNXsGBgAF/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Applications of integration" text1="Question Paper" link1="https://drive.google.com/file/d/1jJzO2HtqhAzyeCNixTCVcmRy0staD9SG/view?usp=sharing" size="3" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Reduction" text1="Question Paper" link1="https://drive.google.com/file/d/1yDQ9n0lyZyoTMs316fol8LbktVCyr__e/view?usp=sharing" size="4" />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Conjecture" text1="Question Paper" link1="https://drive.google.com/file/d/1v3pu28h3QXz0WAdP7Q4v8omZN5McwCUD/view?usp=sharing" size="4" />
            </div>
          </div>
        </section>

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
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF name="Topicals (2012-2021)" text1="Question paper" link1="https://drive.google.com/file/d/1v3pu28h3QXz0WAdP7Q4v8omZN5McwCUD/view?usp=sharing"  size="4" />
            </div>
          </div>
        </section>

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
                    <PDF
                    name={book.name}
                    text1={book.text1}
                    link1={book.link1}
                    size={book.size}
                    />
                </div>
                ))}
            </div>
        </section>

        </div>


      <Footer />
    </div>
  )
}