import Link from "next/link";
import { Monoton } from "next/font/google";

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const Header = () => {
  return (
    <header className={`${monoton.className} bg-[#121212] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between shadow-md`}>
      <div className="text-3xl animate-glow">
        <Link href="/home">Nexus Learn</Link>
      </div>

      <nav className="space-x-4 sm:space-x-6 mt-2 sm:mt-0 text-sm sm:text-base">
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
        <Link href="/" className="hover:text-[#ec6262] hover:underline underline-offset-4 transition-colors">
          Log-Out
        </Link>
      </nav>
    </header>
  );
};

export default Header;
