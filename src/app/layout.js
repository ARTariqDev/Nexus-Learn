import { Geist, Geist_Mono } from "next/font/google";
import { Monoton } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import StructuredData from "./components/StructuredData";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const monoton = Monoton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.nexuslearn.app"),
  title: {
    default: "Nexus Learn - O Level, A Level & SAT Preparation Platform",
    template: "%s | Nexus Learn"
  },
  description: "Master O Levels, IGCSE, A Levels, and SAT with Nexus Learn. Access past papers, track your progress, and achieve academic excellence with our comprehensive learning platform.",
  keywords: [
    "O Level preparation",
    "A Level study",
    "SAT prep",
    "IGCSE resources",
    "past papers",
    "exam preparation",
    "online learning",
    "academic progress tracking",
    "Cambridge exams",
    "standardized test prep",
    "A Level Physics",
    "A Level Maths",
    "A Level Computer Science",
    "Further Mathematics"
  ],
  authors: [{ name: "Nexus Learn" }],
  creator: "Nexus Learn",
  publisher: "Nexus Learn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nexus Learn - O Level, A Level & SAT Preparation Platform",
    description: "Master O Levels, IGCSE, A Levels, and SAT with comprehensive resources, past papers, and progress tracking.",
    url: "https://www.nexuslearn.app/",
    siteName: "Nexus Learn",
    images: [
      {
        url: "/Logo.png",
        width: 253,
        height: 63,
        alt: "Nexus Learn Logo - Academic Excellence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Learn - O Level, A Level & SAT Prep",
    description: "Master O Levels, IGCSE, A Levels, and SAT with comprehensive resources and progress tracking.",
    images: ["/Logo.png"],
    creator: "@nexuslearn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YxlP0ZO69Mi1IrZUFTui-pWX1ZvoJ0ZvHDc6UCUMNKk",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="canonical" href="https://www.nexuslearn.app/" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111111" />
        <StructuredData />
      </head>
      <body className="antialiased bg-[#111111] text-white min-h-screen font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
