import type { Metadata, Viewport } from 'next';
import { Jost, Cormorant_Garamond } from 'next/font/google';
import { AgeGate } from '@/components/layout/age-gate';
import { siteConfig } from '@/config/site';
import '@/styles/globals.css';

const fontSans = Jost({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    index: process.env.VERCEL_ENV === 'production',
    follow: process.env.VERCEL_ENV === 'production',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f3ee',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      dir="ltr"
      className={`${fontSans.variable} ${fontSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AgeGate />
        {children}
      </body>
    </html>
  );
}
