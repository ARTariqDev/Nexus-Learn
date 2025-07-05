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
  const router = useRouter()
  const [showTopicals, setShowTopicals] = useState(false) // collapsed by default (for both p3 and p1 btw)
  const [showP3Topicals, setShowP3Topicals] = useState(false)


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
            <h1 className={`${monoton.className} text-white text-3xl`}>
              Topicals P1
            </h1>
            <button
              onClick={() => setShowTopicals(!showTopicals)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showTopicals ? "Hide" : "Show"}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showTopicals ? "max-h-[500rem] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF name="Binomial Expansion" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1xZFBJUg_N5MPyLFFylHA2j6vbpm9-EgY/view?usp=sharing" link2="https://drive.google.com/file/d/15sBHqHntF5J3T9Fh0iMAThRN_e_slyvK/view?usp=sharing" size="2" /> 
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF name="Circles" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1NjClGTe6qAZ3BUu1bpW-AuzRMqvdWEVk/view?usp=sharing" link2= "https://drive.google.com/file/d/1dTeSUn-Sif0TpDIzkQN_NGTlWDLY3StY/view?usp=sharing" size="3" /> 
            </div>
            <div className="fade-in fade-delay-3 mx-auto">
              <PDF name="Co-Ordinate Geometry" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/19og-0Tqm-ztc-XJa7Xg6XfNpcXz303ZE/view?usp=sharing" link2= "https://drive.google.com/file/d/1mrZtICrAJcYeWlcQXPwjGAM8TEwkOfn8/view?usp=sharing" size="2" /> 
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF name="Differentiation" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1zwL0Rmre-7h86o-Xk0t9LDR0UK0Ul6gU/view?usp=sharing" link2= "https://drive.google.com/file/d/1JhV-y-PLWk6lKsGDOy7Bj4US4PVNb1M3/view?usp=sharing" size="2" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Functions" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1vmLdql51Y20VgdYYcQTx7ArmwwxsRBBq/view?usp=sharing" link2= "https://drive.google.com/file/d/1_dBgE-F-QM5bUsFe3LNFl7tCGN5ylAoQ/view?usp=sharing" size="3" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Integration" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1jaBIOoH03sY2_Gk1TdH0anS7ovNqer2D/view?usp=sharing" link2= "https://drive.google.com/file/d/12oypPJu5KtaUa6d8OojeKTyehA2C7Zpy/view?usp=sharing" size="3" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Quadratics" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1hruLwKcDYJDVh7cEg8K1gbf8Gb_b8Go4/view?usp=sharing" link2= "https://drive.google.com/file/d/1nChiflhUOGGGRT1vrVzDfNa4OC2AHiLl/view?usp=drive_link" size="3" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Sequences" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1RtFFbN03sg5L6ru8h5MlfJKfaP5Cbyyo/view?usp=sharing" link2= "https://drive.google.com/file/d/1rdVdD-oLcddPOEoJMLqgCYOgPLSIFS5D/view?usp=sharing" size="3" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Trigonometry" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1J8sQO9p1xd8M8Y7DgRV3jIgZN62SJ33g/view?usp=sharing" link2= "https://drive.google.com/file/d/12KpwelC71bR_ox5-E0PSX-XFbDruKOo4/view?usp=sharing" size="2" /> 
            </div>
            <div className="fade-in fade-delay-5 mx-auto">
              <PDF name="Vectors" text1="Question paper" text2="Mark Scheme" link1="https://drive.google.com/file/d/1XNKAAGou5EvVckFulZW6Kb-SMD0YDW8I/view?usp=sharing" link2= "https://drive.google.com/file/d/1vfJxer8aSdIFo5apLuk0B5mke3rKZRjw/view?usp=sharing" size="3" /> 
            </div>
          </div>
        </section>
        <section className="p-6 max-w-[95rem] mx-auto bg-[#111111] rounded-xl mt-8 fade-in">
          <div className="flex items-center justify-between mb-4 fade-in">
            <h1 className={`${monoton.className} text-white text-3xl`}>
              Topicals P3
            </h1>
            <button
              onClick={() => setShowP3Topicals(!showP3Topicals)}
              className="bg-[#ffaa00] text-black font-semibold px-4 py-2 rounded hover:opacity-90 transition-all"
            >
              {showP3Topicals ? "Hide" : "Show"}
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 overflow-hidden ${
              showP3Topicals ? "max-h-[500rem] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="fade-in fade-delay-1 mx-auto">
              <PDF
                name="Binomial Expansion"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1T3mYIXi7zlzbIfnSBIsT0U9Xj3a9gvP0/view?usp=sharing"
                link2="https://drive.google.com/file/d/1pX70fx7IC6zB4MjKNhcSZCBOr_al6kDD/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-2 mx-auto">
              <PDF
                name="Complex Numbers"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/13wDNsQDkLJzmZ9xvi62MHptLhCExe41E/view?usp=drive_link"
                link2="https://drive.google.com/file/d/1p6WHnmj9SP3seq6q0eElkzHUg1D5vogL/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-3 mx-auto">
              <PDF
                name="Differential Equations"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1Xq1gV9bbiqM6Kt32NJ79ztNkwkkB8sG6/view?usp=sharing"
                link2="https://drive.google.com/file/d/1GePjzdjaNXYrIvtpkMZLS9wKy08fnNqY/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Differentiation"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1KJEUn7dZLPZA1VTNVZl6YvSSFORH3sbT/view?usp=sharing"
                link2="https://drive.google.com/file/d/1CJljmk7jVyzWazPacuhA7v7wcKJh42EM/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Inequalities"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1jzhLP29oDKSoJVpnqgZi5ISJgJou8599/view?usp=sharing"
                link2="https://drive.google.com/file/d/1xHp4ZjNwEFWqcRnk9_MliP2GDpjVBAgX/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Integration"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1ank7Yik0PsiJdnsN2MUTH--Ll_D7T5JX/view?usp=sharing"
                link2="https://drive.google.com/file/d/1-7QssVkmWu4Pl9cbWNjHi8d9q1NqQ9jV/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Iteration"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1-7QssVkmWu4Pl9cbWNjHi8d9q1NqQ9jV/view?usp=sharing"
                link2="https://drive.google.com/file/d/14y5NbXjCFYJDRxOYTzLpcB6rsRU3kbir/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Logarithms"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1yQ3wZ8dBg9wjU6wRJ8d52sJopgyMXVMZ/view?usp=sharing"
                link2="https://drive.google.com/file/d/1eg0iXLpEzB1JtyneqHSu1edRqDaP_ZHX/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Partial Fractions"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1CNL0zF3QO0dl-vbSY8G4dVgY3Eg8dbCV/view?usp=sharing"
                link2="https://drive.google.com/file/d/1WejvYNSTxUcy_BHY-zrvntJLi_xl9sgc/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Polynomials"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/10VljO818hAz5aU6oqC6Fj-0qnY0Lz3Gz/view?usp=sharing"
                link2="https://drive.google.com/file/d/1VVeuS-NX0oeGg4aPFiuWx3_2hAfpwlI_/view?usp=sharing"
                size="3"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Trigonometry"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/16HGOA4_VihnQoeOzsM7jh7vDL9jue4L7/view?usp=sharing"
                link2="https://drive.google.com/file/d/1QXK2RayXxk0_-6Fsgl_2vPtAgSIR5_5r/view?usp=sharing"
                size="2"
              />
            </div>
            <div className="fade-in fade-delay-4 mx-auto">
              <PDF
                name="Vectors"
                text1="Question paper"
                text2="Mark Scheme"
                link1="https://drive.google.com/file/d/1vvf3askK5j0UHJWeumOd7IwofpwHYC1u/view?usp=sharing"
                link2="https://drive.google.com/file/d/1dcgrqNbICWYh_uK3oD9VQ95ykwgY9atb/view?usp=sharing"
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
