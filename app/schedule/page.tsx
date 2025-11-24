'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation } from 'lucide-react';
import {
    foodTruckLocations,
    getNearbyLocations,
    getTodayLocations,
    getAllLocations,
    FoodTruckLocation,
} from '../data/foodTruckLocations';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
    const [locations, setLocations] = useState<FoodTruckLocation[]>([]);
    const [loading, setLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [viewMode, setViewMode] = useState<'today' | 'all' | 'nearby'>('today');

    useEffect(() => {
        loadLocations();
    }, [viewMode, userLocation]);

    const loadLocations = () => {
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            let data: FoodTruckLocation[] = [];

            if (viewMode === 'today') {
                data = getTodayLocations();
            } else if (viewMode === 'nearby' && userLocation) {
                data = getNearbyLocations(userLocation.lat, userLocation.lng, 10);
            } else {
                data = getAllLocations();
            }

            setLocations(data);
            setLoading(false);
        }, 500);
    };

    const handleLocateMe = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setViewMode('nearby');
                },
                () => {
                    alert('Could not get your location. Please enable location services.');
                }
            );
        }
    };

    const openInMaps = (location: FoodTruckLocation) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero" style={{ paddingBottom: '2rem' }}>
                <h1>Food Truck Locations</h1>
                <p>Find München's best food trucks near you</p>
            </section>

            <div className="container">
                {/* View Mode Selector */}
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}
                >
                    <button
                        onClick={() => setViewMode('today')}
                        className={viewMode === 'today' ? 'btn-primary' : 'btn-secondary'}
                        style={{ borderRadius: '12px' }}
                    >
                        📅 Today's Trucks
                    </button>
                    <button
                        onClick={handleLocateMe}
                        className={viewMode === 'nearby' ? 'btn-primary' : 'btn-secondary'}
                        style={{ borderRadius: '12px' }}
                    >
                        📍 Near Me
                    </button>
                    <button
                        onClick={() => setViewMode('all')}
                        className={viewMode === 'all' ? 'btn-primary' : 'btn-secondary'}
                        style={{ borderRadius: '12px' }}
                    >
                        🗓️ All Locations
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ fontSize: '3rem', marginBottom: '1rem' }}
                        >
                            🔄
                        </motion.div>
                        <p style={{ color: 'var(--text-muted)' }}>Loading locations...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && locations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚚</div>
                        <h3>No trucks found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {viewMode === 'today' && 'No food trucks scheduled for today.'}
                            {viewMode === 'nearby' && 'No food trucks found near your location.'}
                            {viewMode === 'all' && 'No locations available.'}
                        </p>
                    </div>
                )}

                {/* Locations Grid */}
                {!loading && locations.length > 0 && (
                    <div className="card-grid">
                        {locations.map((location, index) => (
                            <motion.div
                                key={location.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    background: 'var(--bg-card)',
                                }}
                                onClick={() => openInMaps(location)}
                            >
                                {/* Header */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div style={{ fontSize: '2rem' }}>🚚</div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{location.name}</h3>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {location.description}
                                    </p>
                                </div>

                                {/* Special Event Badge */}
                                {location.specialEvent && (
                                    <div
                                        style={{
                                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            marginBottom: '1rem',
                                            display: 'inline-block',
                                        }}
                                    >
                                        🎉 {location.specialEvent}
                                    </div>
                                )}

                                {/* Location */}
                                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <MapPin size={18} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{location.location}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{location.address}</div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                    <div>
                                        <span style={{ fontWeight: 600 }}>{DAYS[location.dayOfWeek]}</span>
                                        {' • '}
                                        <span>{location.hours}</span>
                                    </div>
                                </div>

                                {/* Distance (if available) */}
                                {(location as any).distance !== undefined && (
                                    <div
                                        style={{
                                            background: 'var(--bg-body)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: 'var(--primary)',
                                            marginTop: '1rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <Navigation size={16} />
                                        {(location as any).distance.toFixed(1)} km away
                                    </div>
                                )}

                                {/* Open in Maps Button */}
                                <div
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    📍 Open in Google Maps
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
