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
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
