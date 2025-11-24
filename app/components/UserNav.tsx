'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function UserNav() {
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        window.location.href = '/';
    };

    if (!mounted) {
        return (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ThemeToggle />
                <Link href="/login" className="btn-primary">Sign In</Link>
            </div>
        );
    }

    if (user) {
        return (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <ThemeToggle />
                <Link href="/account" style={{
                    textDecoration: 'none',
                    color: 'var(--text-main)',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    👤 Account
                </Link>
                <button
                    onClick={logout}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.95rem'
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            <Link href="/login" className="btn-primary">Sign In</Link>
        </div>
    );
}
