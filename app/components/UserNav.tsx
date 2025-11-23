'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
        return <Link href="/login" className="btn-primary">Sign In</Link>;
    }

    if (user) {
        return (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link href="/account" style={{
                    textDecoration: 'none',
                    color: 'var(--gray-700)',
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
                        color: 'var(--gray-700)',
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

    return <Link href="/login" className="btn-primary">Sign In</Link>;
}
