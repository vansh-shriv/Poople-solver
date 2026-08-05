import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pixelHeaderFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-header",
});

const pixelBodyFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel-body",
});

export const metadata: Metadata = {
  title: "Poople Solver | Word Ladder Path Finder",
  description: "A minimal pixel & glassmorphism web solver for 4-letter word transformation ladders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${pixelHeaderFont.variable} ${pixelBodyFont.variable} dark`}
    >
      <body className="bg-slate-950 text-slate-100 font-pixel-body antialiased selection:bg-cyan-500 selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
