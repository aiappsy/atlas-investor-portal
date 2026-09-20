import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'ATLAS Travel Club | Institutional Investor Portal & Offering Memo',
  description: 'Confidential Investor Teaser, YC SAFE Term Sheet, Unit Economics and Full Prospectus',
  robots: 'noindex, nofollow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col justify-between`}>
        <div className="flex-1 w-full flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
