import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata (shown in tab title)
export const metadata = {
  title: "Nexus Learn",
  description: "Learning platform for O/A Levels and SAT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#111111] text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
