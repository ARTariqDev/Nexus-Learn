 'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Monoton } from "next/font/google";

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear auth token
    router.push('/'); // redirect to landing page
  };

  return (
    <header className={`${monoton.className} bg-[#121212] text-white px-6 py-4 shadow-md`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
        {/* Logo / Title */}
        <div className="text-3xl animate-glow">
          <Link href="/home">Nexus Learn</Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 text-sm sm:text-base text-center">
          <Link href="/home" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            Home
          </Link>
          <Link href="/home/Alevel" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            ALevel
          </Link>
          <Link href="/home/Olevel" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            OLevel
          </Link>
          <Link href="/home/IGCSE" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            IGCSE
          </Link>
          <Link href="/home/SAT" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            SAT
          </Link>
          <Link href="/stats" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            Stats
          </Link>
          <Link href="/tutorials" className="hover:text-[#ffaa00] hover:underline underline-offset-4 transition-colors">
            Tutorials
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hover:text-[#ec6262] hover:underline underline-offset-4 transition-colors"
          >
            Log-Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
