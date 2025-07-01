import Link from "next/link";
import { Monoton } from "next/font/google";

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const Footer = () => {
  return (
    <footer className={`bg-[#121212] text-gray-400 py-6 px-4 mt-12 ${monoton.className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} Nexus Learn. All rights reserved.
        </p>
        <div className="flex gap-6 justify-center sm:justify-end">
          <Link href="/privacy" className="hover:text-[#ffaa00] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[#ffaa00] transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-[#ffaa00] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
