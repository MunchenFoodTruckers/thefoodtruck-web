'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLocation } from './context/LocationContext';
import { useRouter } from 'next/navigation';
import Logo from './components/Logo';
import { motion } from 'framer-motion';
import { MapPin, Truck, Star, ChevronDown } from 'lucide-react';
import FadeIn from './components/animations/FadeIn';
import SlideIn from './components/animations/SlideIn';
import StaggerChildren, { StaggerItem } from './components/animations/StaggerChildren';
import Button from './components/ui/Button';

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
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Animated gradient background */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <FadeIn>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Food trucks,<br />at your doorstep
            </motion.h1>
          </FadeIn>

          <SlideIn direction="up" delay={0.4}>
            <p>München's most loved street food, delivered fresh.</p>
          </SlideIn>

          {/* Address Input Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              background: 'var(--bg-card)',
              padding: '0.5rem',
              borderRadius: '16px',
              maxWidth: '600px',
              margin: '2rem auto',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              borderRight: '1px solid var(--border-color)',
              gap: '0.5rem'
            }}>
              <select
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value as 'delivery' | 'pickup')}
                style={{
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--text-main)',
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
                  paddingRight: '110px',
                  fontSize: '1rem',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapPin size={16} />
                Locate Me
              </motion.button>
            </div>

            <Button
              onClick={handleSubmit}
              style={{
                borderRadius: '12px',
                padding: '1rem 2rem',
                fontSize: '1rem'
              }}
            >
              Find Food
            </Button>
          </motion.div>

          <FadeIn delay={0.8}>
            <div className="hero-buttons">
              <Link href="/menu" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>
                Or browse menu directly →
              </Link>
            </div>
          </FadeIn>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </div>
      </section>

      <div className="container">
        <FadeIn delay={1}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-1px' }}>
              Why order from us
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', letterSpacing: '-0.2px' }}>
              Fresh food from München's best food trucks, delivered to your door
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.2}>
          <div className="card-grid">
            <StaggerItem>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}
                >
                  🍔
                </motion.div>
                <h3>Fresh Daily</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Locally sourced ingredients prepared fresh every day</p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
                >
                  <Truck size={64} color="var(--primary)" strokeWidth={1.5} />
                </motion.div>
                <h3>Fast Delivery</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Quick service from our mobile kitchen to your table</p>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div
                className="feature-card"
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}
                >
                  <Star size={64} color="var(--primary)" fill="var(--primary)" strokeWidth={1.5} />
                </motion.div>
                <h3>Top Rated</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>München's #1 rated food truck service in 2024</p>
              </motion.div>
            </StaggerItem>
          </div>
        </StaggerChildren>
      </div>
    </>
  );
}
