import './globals.css';
import Link from 'next/link';
import UserNav from './components/UserNav';
import Logo from './components/Logo';
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
                      color: 'var(--dark)',
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
