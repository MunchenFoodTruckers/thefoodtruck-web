import './globals.css';
import Link from 'next/link';
import UserNav from './components/UserNav';
import { LocationProvider } from './context/LocationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LocationProvider>
          <nav className="navbar">
            <div className="nav-container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                <Link href="/" className="logo" style={{ fontSize: '2rem' }}>
                  🚚 München Food Truckers
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
          <footer className="footer">
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
              <p>© 2025 München Food Truckers - Authentic Street Food in München</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
                📍 Marienplatz, München • 📞 +49 89 12345678 • ✉️ hello@munchen-foodtruckers.de
              </p>
            </div>
          </footer>
        </LocationProvider>
      </body>
    </html>
  )
}
