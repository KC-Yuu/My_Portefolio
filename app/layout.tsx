import type { Metadata } from 'next';
import { VT323 } from 'next/font/google';
import { Inter } from 'next/font/google';
import { SeasonProvider } from '@/components/season/SeasonProvider';
import { currentRealSeason } from '@/components/season/season';
import { noFoucScript } from '@/components/season/no-fouc-script';
import './globals.css';

const display = VT323({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Pixel art seasonal portfolio.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initial = currentRealSeason();
  return (
    <html lang="en" data-season={initial} suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFoucScript }} />
      </head>
      <body>
        <SeasonProvider initial={initial}>{children}</SeasonProvider>
      </body>
    </html>
  );
}
