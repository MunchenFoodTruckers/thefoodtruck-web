const PAYMENTS_API = process.env.NEXT_PUBLIC_PAYMENTS_API || 'https://foodtruck-payments-service.onrender.com';

export interface Payment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    tip: number;
    discount: number;
    promoCode?: string;
    createdAt: string;
}

export interface PaymentMethod {
    id: string;
    userId: string;
    type: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
}

export interface CreatePaymentData {
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    paymentMethodId?: string;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    tip?: number;
    discount?: number;
    promoCode?: string;
}

export const paymentsApi = {
    async getPaymentHistory(userId: string): Promise<Payment[]> {
        const res = await fetch(`${PAYMENTS_API}/api/payments/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch payment history');
        return res.json();
    },

    async processPayment(data: CreatePaymentData): Promise<Payment> {
        const res = await fetch(`${PAYMENTS_API}/api/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Payment failed');
        return res.json();
    },

    async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        const res = await fetch(`${PAYMENTS_API}/api/payment-methods/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch payment methods');
        return res.json();
    },

    async addPaymentMethod(userId: string, method: Partial<PaymentMethod>): Promise<PaymentMethod> {
        const res = await fetch(`${PAYMENTS_API}/api/payment-methods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, ...method }),
        });
        if (!res.ok) throw new Error('Failed to add payment method');
        return res.json();
    },

    async setDefaultPaymentMethod(methodId: string): Promise<void> {
        const res = await fetch(`${PAYMENTS_API}/api/payment-methods/${methodId}/default`, {
            method: 'PUT',
        });
        if (!res.ok) throw new Error('Failed to set default payment method');
    },

    async deletePaymentMethod(methodId: string): Promise<void> {
        const res = await fetch(`${PAYMENTS_API}/api/payment-methods/${methodId}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete payment method');
    },
};
