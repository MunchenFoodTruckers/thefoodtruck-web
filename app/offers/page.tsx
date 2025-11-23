import Link from 'next/link';

export default function OffersPage() {
    const offers = [
        {
            id: '1',
            title: '50% Off First Order',
            description: 'New customers get 50% off their first order',
            code: 'FIRST50',
            validUntil: '2025-12-31',
            emoji: '🎉'
        },
        {
            id: '2',
            title: 'Free Delivery',
            description: 'Free delivery on orders over €20',
            code: 'FREEDEL',
            validUntil: '2025-12-31',
            emoji: '🚚'
        },
        {
            id: '3',
            title: 'Lunch Special',
            description: '20% off on weekday lunches (11 AM - 2 PM)',
            code: 'LUNCH20',
            validUntil: '2025-12-31',
            emoji: '🍔'
        },
        {
            id: '4',
            title: 'Student Discount',
            description: '15% off for students with valid ID',
            code: 'STUDENT15',
            validUntil: '2025-12-31',
            emoji: '🎓'
        }
    ];

    return (
        <div className="container">
            <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                Special Offers
            </h1>
            <p style={{ color: '#666', marginBottom: '3rem' }}>
                Save money with our exclusive deals and promotions
            </p>

            <div className="card-grid">
                {offers.map(offer => (
                    <div key={offer.id} style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        border: '2px solid var(--primary)',
                        boxShadow: '0 4px 12px rgba(6, 193, 103, 0.15)',
                        transition: 'all 0.3s'
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{offer.emoji}</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{offer.title}</h3>
                        <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            {offer.description}
                        </p>

                        <div style={{
                            background: 'var(--gray-100)',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            border: '2px dashed var(--primary)'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>
                                Promo Code
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                letterSpacing: '2px',
                                fontFamily: 'monospace'
                            }}>
                                {offer.code}
                            </div>
                        </div>

                        <div style={{ fontSize: '0.875rem', color: '#999', marginBottom: '1.5rem' }}>
                            Valid until {new Date(offer.validUntil).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        <Link href="/menu" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                            Order Now
                        </Link>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '4rem',
                padding: '3rem',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '24px',
                textAlign: 'center',
                border: '1px solid rgba(6, 193, 103, 0.2)'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Want More Deals?</h2>
                <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.05rem' }}>
                    Sign up for our newsletter and never miss a special offer!
                </p>
                <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        style={{
                            flex: 1,
                            padding: '0.875rem 1rem',
                            border: '1.5px solid var(--gray-300)',
                            borderRadius: '12px',
                            fontSize: '1rem'
                        }}
                    />
                    <button className="btn-primary" style={{ padding: '0.875rem 2rem' }}>
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}
