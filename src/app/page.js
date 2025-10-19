'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { Monoton } from 'next/font/google';
import { useRouter } from 'next/navigation'


// Load Monoton font
const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function LandingPage() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-[#000000] px-4 py-12 text-white transition-opacity duration-1000 ease-in-out ${fadeIn ? "opacity-100" : "opacity-0"}`}
      role="main"
      aria-label="Nexus Learn Landing Page"
    >
      <header className="text-center w-full max-w-4xl">
        <h1 className={`${monoton.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffffff] mb-6 animate-glow`}>
          Nexus Learn
        </h1>

        <p className="text-base sm:text-lg text-gray-400 mb-8 mx-auto max-w-lg px-4 animate-fadeIn delay-200">
          Your all-in-one platform to prepare for O Levels, IGCSE, A Levels, and the SAT. View past papers, track progress, and improve smarter.
        </p>
      </header>

      <nav className="flex flex-col sm:flex-row gap-4 animate-fadeIn delay-300" aria-label="Main navigation">
        <Link href="/home" aria-label="Get started and explore resources">
          <button className="bg-[#ffaa00] text-black font-semibold px-8 py-3 rounded hover:opacity-90 hover:scale-105 transition-transform duration-300">
            Get Started
          </button>
        </Link>
        <div className="flex gap-4">
          <Link href="/login" aria-label="Log in to your account">
            <button className="bg-[#121212] border border-[#ffaa00] text-white font-semibold px-6 py-3 rounded hover:bg-[#1a1a1a] hover:scale-105 transition-transform duration-300">
              Log In
            </button>
          </Link>
          <Link href="/signup" aria-label="Create a new account">
            <button className="bg-[#121212] border border-[#ffaa00] text-white font-semibold px-6 py-3 rounded hover:bg-[#1a1a1a] hover:scale-105 transition-transform duration-300">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>
    </main>
  );
}
