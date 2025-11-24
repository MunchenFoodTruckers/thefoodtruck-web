'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '3rem 2rem 2rem',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {/* Company Info */}
                    <div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            color: 'var(--text-main)'
                        }}>
                            München Food Truckers
                        </h3>
                        <p style={{
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            color: 'var(--text-muted)'
                        }}>
                            Authentic street food from München's best food trucks, delivered fresh to your door.
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            color: 'var(--text-main)'
                        }}>
                            Contact Us
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            fontSize: '0.95rem',
                            color: 'var(--text-muted)'
                        }}>
                            <a
                                href="tel:+498912345678"
                                className="footer-link"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                📞 +49 89 1234 5678
                            </a>
                            <a
                                href="mailto:hello@munchen-foodtruckers.de"
                                className="footer-link"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                ✉️ hello@munchen-foodtruckers.de
                            </a>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📍 Marienplatz 1, 80331 München
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            color: 'var(--text-main)'
                        }}>
                            Quick Links
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            fontSize: '0.95rem'
                        }}>
                            <Link
                                href="/menu"
                                className="footer-link"
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                Menu
                            </Link>
                            <Link
                                href="/schedule"
                                className="footer-link"
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                Locations
                            </Link>
                            <Link
                                href="/offers"
                                className="footer-link"
                                style={{
                                    color: 'var(--text-muted)',
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                            >
                                Offers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border-color)',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)'
                }}>
                    <p>© 2025 München Food Truckers. All rights reserved.</p>
                    <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
                        Made with ❤️ in München
                    </p>
                </div>
            </div>
        </footer>
    );
}
