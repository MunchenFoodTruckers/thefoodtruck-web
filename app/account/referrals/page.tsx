'use client';

import { useState, useEffect } from 'react';
import { referralsApi, ReferralCode, Reward } from '../../api/referrals';

export default function ReferralsPage() {
    const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId] = useState('user-123'); // TODO: Get from auth context
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        loadReferralData();
    }, []);

    const loadReferralData = async () => {
        setLoading(true);
        try {
            const [code, rewardsList] = await Promise.all([
                referralsApi.getReferralStats(userId).catch(() => null),
                referralsApi.getRewards(userId).catch(() => []),
            ]);

            if (!code) {
                const newCode = await referralsApi.generateReferralCode(userId);
                setReferralCode(newCode);
            } else {
                setReferralCode(code);
            }

            setRewards(rewardsList);
        } catch (err) {
            console.error('Failed to load referral data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = () => {
        if (referralCode) {
            navigator.clipboard.writeText(referralCode.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRedeemReward = async (rewardId: string) => {
        try {
            await referralsApi.redeemReward(rewardId);
            await loadReferralData();
            alert('Reward redeemed successfully!');
        } catch (err) {
            alert('Failed to redeem reward');
        }
    };

    const shareUrl = referralCode ? `${window.location.origin}/register?ref=${referralCode.code}` : '';

    return (
        <>
            <section className="hero" style={{ paddingBottom: '2rem' }}>
                <h1>Refer & Earn</h1>
                <p>Share the love and get rewarded!</p>
            </section>

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
                        <p style={{ color: 'var(--gray-600)' }}>Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Referral Code Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            borderRadius: '24px',
                            padding: '3rem',
                            color: 'white',
                            marginBottom: '3rem',
                            boxShadow: '0 20px 60px rgba(6, 193, 103, 0.25)'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>Your Referral Code</h2>
                                <p style={{ opacity: 0.9 }}>Share this code with friends and family</p>
                            </div>

                            <div style={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                padding: '2rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{
                                    fontSize: '3rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.5rem',
                                    textAlign: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    {referralCode?.code}
                                </div>
                                <button
                                    onClick={handleCopyCode}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'white',
                                        color: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy Code'}
                                </button>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                                        {referralCode?.totalReferred || 0}
                                    </div>
                                    <div style={{ opacity: 0.9 }}>Friends Referred</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                                        €{(referralCode?.totalEarned || 0).toFixed(2)}
                                    </div>
                                    <div style={{ opacity: 0.9 }}>Total Earned</div>
                                </div>
                            </div>
                        </div>

                        {/* Share Options */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Share Your Code</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                <a
                                    href={`https://wa.me/?text=Join München Food Truckers with my code ${referralCode?.code} and get €5 off! ${shareUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '1.25rem',
                                        background: '#25D366',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>💬</span> WhatsApp
                                </a>
                                <a
                                    href={`mailto:?subject=Join München Food Truckers&body=Use my code ${referralCode?.code} to get €5 off! ${shareUrl}`}
                                    style={{
                                        padding: '1.25rem',
                                        background: '#EA4335',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>📧</span> Email
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.share?.({
                                            title: 'Join München Food Truckers',
                                            text: `Use my code ${referralCode?.code} to get €5 off!`,
                                            url: shareUrl
                                        });
                                    }}
                                    style={{
                                        padding: '1.25rem',
                                        background: 'var(--gray-800)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>🔗</span> More
                                </button>
                            </div>
                        </div>

                        {/* Rewards */}
                        <div>
                            <h3 style={{ marginBottom: '1.5rem' }}>Your Rewards</h3>

                            {rewards.length === 0 ? (
                                <div style={{
                                    background: 'var(--gray-100)',
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
                                    <p style={{ color: 'var(--gray-600)' }}>
                                        No rewards yet. Start referring friends to earn rewards!
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {rewards.map(reward => (
                                        <div
                                            key={reward.id}
                                            style={{
                                                background: 'white',
                                                borderRadius: '16px',
                                                padding: '1.5rem',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                border: '1px solid var(--gray-200)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                                    €{reward.amount.toFixed(2)}
                                                </div>
                                                <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                                    {reward.description}
                                                </div>
                                                {reward.expiresAt && (
                                                    <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                                        Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            {reward.isRedeemed ? (
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    background: 'var(--gray-200)',
                                                    color: 'var(--gray-600)',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600
                                                }}>
                                                    ✓ Redeemed
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleRedeemReward(reward.id)}
                                                    className="btn-primary"
                                                    style={{ padding: '0.75rem 1.5rem' }}
                                                >
                                                    Redeem
                                                </button>
                                            )}
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
