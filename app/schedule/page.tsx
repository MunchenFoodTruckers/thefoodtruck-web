'use client';

import { useState, useEffect } from 'react';
import { scheduleApi, Schedule } from '../api/schedule';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [viewMode, setViewMode] = useState<'today' | 'all' | 'nearby'>('today');

    useEffect(() => {
        loadSchedules();
    }, [viewMode, userLocation]);

    const loadSchedules = async () => {
        setLoading(true);
        setError('');
        try {
            let data: Schedule[] = [];

            if (viewMode === 'today') {
                data = await scheduleApi.getTodaySchedules();
            } else if (viewMode === 'nearby' && userLocation) {
                data = await scheduleApi.getNearbySchedules(userLocation.lat, userLocation.lng);
            } else {
                data = await scheduleApi.getAllSchedules();
            }

            setSchedules(data);
        } catch (err) {
            setError('Failed to load schedules. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                (error) => {
                    alert('Could not get your location. Please enable location services.');
                }
            );
        }
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
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
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
                        🗓️ All Schedules
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                        <p style={{ color: 'var(--gray-600)' }}>Loading schedules...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div style={{
                        background: '#fee',
                        border: '1px solid #fcc',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ color: '#c00', margin: 0 }}>{error}</p>
                    </div>
                )}

                {/* Schedules List */}
                {!loading && !error && schedules.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚚</div>
                        <h3>No trucks found</h3>
                        <p style={{ color: 'var(--gray-600)' }}>
                            {viewMode === 'today' && 'No food trucks scheduled for today.'}
                            {viewMode === 'nearby' && 'No food trucks found near your location.'}
                            {viewMode === 'all' && 'No schedules available.'}
                        </p>
                    </div>
                )}

                {!loading && !error && schedules.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.06)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                }}
                            >
                                {/* Truck Name */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ fontSize: '2rem' }}>🚚</div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                                            {schedule.foodTruck?.name || 'Food Truck'}
                                        </h3>
                                        {schedule.foodTruck?.description && (
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                                                {schedule.foodTruck.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Special Event Badge */}
                                {schedule.specialEvent && (
                                    <div style={{
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                        color: 'white',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        marginBottom: '1rem',
                                        display: 'inline-block'
                                    }}>
                                        🎉 {schedule.specialEvent}
                                    </div>
                                )}

                                {/* Location */}
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>📍</span>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                                {schedule.locationName}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                                                {schedule.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>🕐</span>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{DAYS[schedule.dayOfWeek]}</span>
                                            {' • '}
                                            <span>{schedule.startTime} - {schedule.endTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Distance (if available) */}
                                {schedule.distance !== undefined && (
                                    <div style={{
                                        background: 'var(--gray-100)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: 'var(--primary)',
                                        marginTop: '1rem'
                                    }}>
                                        📏 {schedule.distance.toFixed(1)} km away
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
