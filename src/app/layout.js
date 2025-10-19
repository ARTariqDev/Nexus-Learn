import { Geist, Geist_Mono } from "next/font/google";
import { Monoton } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

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
  title: "Nexus Learn",
  description: "Learning platform for O/A Levels and SAT",
  openGraph: {
    title: "Nexus Learn",
    description: "Learning platform for O/A Levels and SAT",
    url: "https://nexuslearn-mu.vercel.app/", // will update if custom domain differs
    siteName: "Nexus Learn",
    images: [
      {
        url: "/Logo.png",
        width: 253,
        height: 63,
        alt: "Nexus Learn Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Learn",
    description: "Learning platform for O/A Levels and SAT",
    images: ["/logo.png"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="google-site-verification" content="YxlP0ZO69Mi1IrZUFTui-pWX1ZvoJ0ZvHDc6UCUMNKk" />
      </head>
      <body className="antialiased bg-[#111111] text-white min-h-screen font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
