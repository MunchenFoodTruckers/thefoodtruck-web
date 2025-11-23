'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocation } from './context/LocationContext';
import { useRouter } from 'next/navigation';
import Logo from './components/Logo';

export default function HomePage() {
  const { address, setAddress, deliveryMode, setDeliveryMode } = useLocation();
  const [inputAddress, setInputAddress] = useState(address || '');
  const router = useRouter();

  const handleLocateMe = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // Mock reverse geocoding for demo
        const mockAddress = "Marienplatz 1, 80331 München";
        setInputAddress(mockAddress);
        setAddress(mockAddress);
      }, (error) => {
        alert('Could not get location. Please enter address manually.');
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputAddress) {
      setAddress(inputAddress);
      router.push('/menu');
    }
  };

  return (
    <>
      <section className="hero">
        <h1>Food trucks,<br />at your doorstep</h1>
        <p>München's most loved street food, delivered fresh.</p>

        {/* Address Input Section */}
        <div style={{
          background: 'white',
          padding: '0.5rem',
          borderRadius: '16px',
          maxWidth: '600px',
          margin: '2rem auto',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 1rem',
            borderRight: '1px solid #eee',
            gap: '0.5rem'
          }}>
            <select
              value={deliveryMode}
              onChange={(e) => setDeliveryMode(e.target.value as 'delivery' | 'pickup')}
              style={{
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: 'var(--dark)',
                outline: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Enter delivery address"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                padding: '1rem',
                paddingRight: '120px', // Prevent text from going under Locate Me button
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleLocateMe}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              📍 Locate Me
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{
              borderRadius: '12px',
              padding: '1rem 2rem',
              fontSize: '1rem'
            }}
          >
            Find Food
          </button>
        </div>

        <div className="hero-buttons">
          <Link href="/menu" style={{ color: 'var(--gray-700)', textDecoration: 'none', fontWeight: 500 }}>
            Or browse menu directly →
          </Link>
        </div>
      </section>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
            Why order from us
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-500)', maxWidth: '560px', margin: '0 auto', letterSpacing: '-0.2px' }}>
            Fresh food from München's best food trucks, delivered to your door
          </p>
        </div>

        <div className="card-grid">
          <div className="feature-card">
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🍔</div>
            <h3>Fresh Daily</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.6 }}>Locally sourced ingredients prepared fresh every day</p>
          </div>

          <div className="feature-card">
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <Logo size={64} />
            </div>
            <h3>Fast Delivery</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.6 }}>Quick service from our mobile kitchen to your table</p>
          </div>

          <div className="feature-card">
            <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>⭐</div>
            <h3>Top Rated</h3>
            <p style={{ color: 'var(--gray-500)', lineHeight: 1.6 }}>München's #1 rated food truck service in 2024</p>
          </div>
        </div>
      </div>
    </>
  );
}
