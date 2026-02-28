import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChessDebrief — AI-Powered Post-Game Coaching",
  description:
    "Import your games from Lichess or Chess.com and get a personalised AI coaching debrief that identifies your 3 recurring weaknesses and builds a week of targeted training.",
  openGraph: {
    title: "ChessDebrief — Know Exactly Why You're Losing",
    description:
      "AI-powered post-game coaching for adult chess players. Identify your weaknesses. Fix them systematically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0b] text-[#f1f1f3]`}
      >
        {children}
      </body>
    </html>
  );
}
