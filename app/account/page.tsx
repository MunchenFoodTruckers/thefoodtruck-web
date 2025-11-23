'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [pastOrders, setPastOrders] = useState<any[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            window.location.href = '/login';
            return;
        }
        setUser(JSON.parse(userData));

        const orders = JSON.parse(localStorage.getItem('pastOrders') || '[]');
        setPastOrders(orders);
    }, []);

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                Account
            </h1>
            <p style={{ color: '#666', marginBottom: '3rem' }}>
                Manage your orders, addresses, and account settings
            </p>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                {/* Sidebar */}
                <div style={{
                    width: '250px',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2.5rem',
                            marginBottom: '1rem'
                        }}>
                            👤
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#666' }}>{user.email}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                            📦 Orders
                        </TabButton>
                        <TabButton active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')}>
                            📍 Addresses
                        </TabButton>
                        <TabButton active={activeTab === 'payment'} onClick={() => setActiveTab('payment')}>
                            💳 Payment Methods
                        </TabButton>
                        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                            ⚙️ Settings
                        </TabButton>
                    </nav>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'orders' && <OrdersTab orders={pastOrders} />}
                    {activeTab === 'addresses' && <AddressesTab />}
                    {activeTab === 'payment' && <PaymentTab />}
                    {activeTab === 'settings' && <SettingsTab user={user} />}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, children }: any) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'var(--primary)' : 'transparent',
                color: active ? 'white' : 'var(--gray-700)',
                border: 'none',
                padding: '0.875rem 1rem',
                borderRadius: '10px',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: active ? 600 : 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s'
            }}
        >
            {children}
        </button>
    );
}

function OrdersTab({ orders }: { orders: any[] }) {
    if (orders.length === 0) {
        return (
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No orders yet</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Start ordering delicious food!</p>
                <Link href="/menu" className="btn-primary">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
                <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                Order #{order.id.slice(-6)}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: '#666' }}>
                                {new Date(order.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                display: 'inline-block',
                                background: '#e8f5e9',
                                color: '#2e7d32',
                                padding: '0.375rem 0.875rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                marginBottom: '0.5rem'
                            }}>
                                Completed
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                €{order.total.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1rem' }}>
                        {order.items.map((item: any) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <span>{item.quantity}× {item.name}</span>
                                <span style={{ color: '#666' }}>€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function AddressesTab() {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Delivery Addresses</h2>

            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Add your delivery addresses for faster checkout
            </p>

            <button className="btn-primary">
                + Add New Address
            </button>
        </div>
    );
}

function PaymentTab() {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Payment Methods</h2>

            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Securely save your payment methods
            </p>

            <button className="btn-primary">
                + Add Payment Method
            </button>
        </div>
    );
}

function SettingsTab({ user }: { user: any }) {
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(0, 0, 0, 0.06)'
        }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Account Settings</h2>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Personal Information</h3>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" defaultValue={user.name} disabled />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={user.email} disabled />
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Preferences</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <input type="checkbox" />
                    <span>Email me about special offers</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" />
                    <span>SMS notifications for order updates</span>
                </label>
            </div>

            <button className="btn-primary">
                Save Changes
            </button>
        </div>
    );
}
