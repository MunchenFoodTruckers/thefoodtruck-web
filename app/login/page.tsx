'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirect to menu
                window.location.href = '/menu';
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Connection error. Using demo mode.');

            // Demo login - works with any credentials
            const demoUser = {
                id: '1',
                email: email,
                name: email.split('@')[0]
            };
            localStorage.setItem('token', 'demo-token-' + Date.now());
            localStorage.setItem('user', JSON.stringify(demoUser));
            window.location.href = '/menu';
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚚</div>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                        Welcome Back!
                    </h1>
                    <p style={{ color: '#666' }}>Login to order delicious food</p>
                </div>

                {error && (
                    <div style={{
                        background: '#ffebee',
                        color: '#c62828',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', fontSize: '1.1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Sign up
                    </Link>
                </p>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: '#e3f2fd',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                }}>
                    💡 <strong>Demo Mode:</strong> Enter any email and password to try the app!
                </div>
            </div>
        </div>
    );
}
