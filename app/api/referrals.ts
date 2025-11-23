const REFERRALS_API = process.env.NEXT_PUBLIC_REFERRALS_API || 'https://foodtruck-referrals-service.onrender.com';

export interface ReferralCode {
    id: string;
    userId: string;
    code: string;
    totalReferred: number;
    totalEarned: number;
    isActive: boolean;
}

export interface Reward {
    id: string;
    userId: string;
    type: string;
    amount: number;
    description: string;
    isRedeemed: boolean;
    redeemedAt?: string;
    expiresAt?: string;
    createdAt: string;
}

export const referralsApi = {
    async generateReferralCode(userId: string): Promise<ReferralCode> {
        const res = await fetch(`${REFERRALS_API}/api/referrals/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error('Failed to generate referral code');
        return res.json();
    },

    async getReferralStats(userId: string): Promise<ReferralCode> {
        const res = await fetch(`${REFERRALS_API}/api/referrals/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch referral stats');
        return res.json();
    },

    async getRewards(userId: string): Promise<Reward[]> {
        const res = await fetch(`${REFERRALS_API}/api/referrals/${userId}/rewards`);
        if (!res.ok) throw new Error('Failed to fetch rewards');
        return res.json();
    },

    async redeemReward(rewardId: string): Promise<void> {
        const res = await fetch(`${REFERRALS_API}/api/referrals/rewards/${rewardId}/redeem`, {
            method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to redeem reward');
    },

    async applyReferralCode(code: string, newUserId: string): Promise<void> {
        const res = await fetch(`${REFERRALS_API}/api/referrals/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, newUserId }),
        });
        if (!res.ok) throw new Error('Failed to apply referral code');
    },
};
