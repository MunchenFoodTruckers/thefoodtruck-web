'use client';

import { useState, useEffect } from 'react';
import { paymentsApi, PaymentMethod, Payment } from '../../api/payments';

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddCard, setShowAddCard] = useState(false);
    const [userId] = useState('user-123'); // TODO: Get from auth context

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [methods, history] = await Promise.all([
                paymentsApi.getPaymentMethods(userId),
                paymentsApi.getPaymentHistory(userId),
            ]);
            setPaymentMethods(methods);
            setPaymentHistory(history);
        } catch (err) {
            console.error('Failed to load payment data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (methodId: string) => {
        try {
            await paymentsApi.setDefaultPaymentMethod(methodId);
            await loadData();
        } catch (err) {
            alert('Failed to set default payment method');
        }
    };

    const handleDeleteMethod = async (methodId: string) => {
        if (confirm('Are you sure you want to remove this payment method?')) {
            try {
                await paymentsApi.deletePaymentMethod(methodId);
                await loadData();
            } catch (err) {
                alert('Failed to delete payment method');
            }
        }
    };

    const getCardIcon = (brand?: string) => {
        const icons: Record<string, string> = {
            visa: '💳',
            mastercard: '💳',
            amex: '💳',
            paypal: '💰',
        };
        return icons[brand?.toLowerCase() || ''] || '💳';
    };

    return (
        <>
            <section className="hero" style={{ paddingBottom: '2rem' }}>
                <h1>Payment Methods</h1>
                <p>Manage your payment methods and view order history</p>
            </section>

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                        <p style={{ color: 'var(--gray-600)' }}>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Payment Methods */}
                        <div style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2>Saved Payment Methods</h2>
                                <button
                                    onClick={() => setShowAddCard(!showAddCard)}
                                    className="btn-primary"
                                >
                                    + Add Card
                                </button>
                            </div>

                            {showAddCard && (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    marginBottom: '2rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: '1px solid var(--gray-200)'
                                }}>
                                    <h3 style={{ marginBottom: '1.5rem' }}>Add New Card</h3>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '12px',
                                                border: '1px solid var(--gray-300)',
                                                fontSize: '1rem'
                                            }}
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--gray-300)',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVV"
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--gray-300)',
                                                    fontSize: '1rem'
                                                }}
                                            />
                                        </div>
                                        <button className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                            Add Card
                                        </button>
                                    </div>
                                </div>
                            )}

                            {paymentMethods.length === 0 ? (
                                <div style={{
                                    background: 'var(--gray-100)',
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        No payment methods saved yet
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {paymentMethods.map(method => (
                                        <div
                                            key={method.id}
                                            style={{
                                                background: 'white',
                                                borderRadius: '16px',
                                                padding: '1.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                border: method.isDefault ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ fontSize: '2rem' }}>{getCardIcon(method.brand)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                                        {method.brand?.toUpperCase()} •••• {method.last4}
                                                    </div>
                                                    <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                                        Expires {method.expiryMonth}/{method.expiryYear}
                                                    </div>
                                                </div>
                                                {method.isDefault && (
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        background: 'var(--primary)',
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 600
                                                    }}>
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {!method.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(method.id)}
                                                        className="btn-secondary"
                                                        style={{ padding: '0.5rem 1rem' }}
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteMethod(method.id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: '#fee',
                                                        color: '#c00',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontWeight: 600,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment History */}
                        <div>
                            <h2 style={{ marginBottom: '2rem' }}>Payment History</h2>

                            {paymentHistory.length === 0 ? (
                                <div style={{
                                    background: 'var(--gray-100)',
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        No payment history yet
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {paymentHistory.map(payment => (
                                        <div
                                            key={payment.id}
                                            style={{
                                                background: 'white',
                                                borderRadius: '16px',
                                                padding: '1.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                border: '1px solid var(--gray-200)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                                        €{payment.amount.toFixed(2)}
                                                    </div>
                                                    <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                                        {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    background: payment.status === 'completed' ? '#d4edda' : '#fff3cd',
                                                    color: payment.status === 'completed' ? '#155724' : '#856404',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600
                                                }}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                                gap: '1rem',
                                                padding: '1rem',
                                                background: 'var(--gray-50)',
                                                borderRadius: '12px',
                                                fontSize: '0.9rem'
                                            }}>
                                                <div>
                                                    <div style={{ color: 'var(--gray-600)' }}>Subtotal</div>
                                                    <div style={{ fontWeight: 600 }}>€{payment.subtotal.toFixed(2)}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--gray-600)' }}>Tax</div>
                                                    <div style={{ fontWeight: 600 }}>€{payment.tax.toFixed(2)}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--gray-600)' }}>Delivery</div>
                                                    <div style={{ fontWeight: 600 }}>€{payment.deliveryFee.toFixed(2)}</div>
                                                </div>
                                                {payment.tip > 0 && (
                                                    <div>
                                                        <div style={{ color: 'var(--gray-600)' }}>Tip</div>
                                                        <div style={{ fontWeight: 600 }}>€{payment.tip.toFixed(2)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
