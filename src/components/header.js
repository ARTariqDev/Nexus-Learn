import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-[#121212] text-white px-6 py-4 flex items-center justify-between shadow-md">

      <div className="text-3xl font-[Monoton] animate-glow">
        <Link href="/home">Nexus Learn</Link>
      </div>

      <nav className="space-x-6 text-sm sm:text-base font-medium font-bold">
        <Link href="/stats" className="hover:text-[#ffaa00] transition-colors">
          Stats
        </Link>
        <Link href="/tutorials" className="hover:text-[#ffaa00] transition-colors">
          Tutorials
        </Link>
        <Link href="/settings" className="hover:text-[#ffaa00] transition-colors">
          Settings
        </Link>
        <Link href="/" className="hover:text-[#ec6262] transition-colors">
          LogOut
        </Link>
      </nav>
    </header>
  );
};

export default Header;
