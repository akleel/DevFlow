import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';

export const metadata: Metadata = {
  title: 'DevFlow',
  description:
    'Web consulting: websites, extreme problem solving, and reusable components.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#070b14] text-zinc-100 antialiased">
        <div className="relative min-h-screen">
          {/* Ambient background layers */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 opacity-70"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />
            <div className="absolute left-1/2 -top-64 h-136 w-136 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
          </div>

          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
