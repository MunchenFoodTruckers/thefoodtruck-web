import './globals.css';
import Link from 'next/link';
import UserNav from './components/UserNav';
import Logo from './components/Logo';
import Footer from './components/Footer';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'München Food Truckers - Authentic Street Food Delivery',
  description: 'Order fresh, authentic street food from München\'s best food trucks. Fast delivery to your door.',
  keywords: ['food truck', 'München', 'Munich', 'street food', 'delivery', 'authentic food'],
  authors: [{ name: 'München Food Truckers' }],
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'München Food Truckers',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://munchen-foodtruckers.de',
    siteName: 'München Food Truckers',
    title: 'München Food Truckers - Authentic Street Food',
    description: 'Order fresh street food from München\'s best food trucks',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'München Food Truckers Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'München Food Truckers',
    description: 'Order fresh street food from München\'s best food trucks',
    images: ['/icon.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06c167' },
    { media: '(prefers-color-scheme: dark)', color: '#10b981' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LocationProvider>
            <nav className="navbar">
              <div className="nav-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                  <Link href="/" className="logo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none'
                  }}>
                    <Logo size={48} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        color: 'var(--text-main)',
                        lineHeight: 1.1
                      }}>
                        MÜNCHEN
                      </span>
                      <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: 'var(--primary)',
                        lineHeight: 1.1
                      }}>
                        FOOD TRUCKERS
                      </span>
                    </div>
                  </Link>
                  <div className="nav-links">
                    <Link href="/menu">Menu</Link>
                    <Link href="/offers">Offers</Link>
                    <Link href="/schedule">Locations</Link>
                  </div>
                </div>
                <UserNav />
              </div>
            </nav>
            <main>{children}</main>
            <Footer />
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
