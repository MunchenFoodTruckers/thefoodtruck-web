'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CreditCard, AlertCircle, MapPin, Clock, Package, CheckCircle2 } from 'lucide-react';
import AddressAutocomplete from '../components/checkout/AddressAutocomplete';
import DeliveryEstimation from '../components/checkout/DeliveryEstimation';
import { ValidatedAddress, DeliveryEstimate, calculateDeliveryEstimate } from '../utils/googleMaps';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

const steps = [
    { id: 1, name: 'Address', icon: MapPin, description: 'Delivery location' },
    { id: 2, name: 'Review', icon: Package, description: 'Order details' },
    { id: 3, name: 'Confirm', icon: CheckCircle2, description: 'Place order' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [validatedAddress, setValidatedAddress] = useState<ValidatedAddress | null>(null);
    const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [estimateError, setEstimateError] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Mock food truck location (Marienplatz, München)
    const FOOD_TRUCK_LOCATION = {
        lat: 48.1374,
        lng: 11.5755,
    };

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        } else {
            router.push('/menu');
        }
    }, [router]);

    useEffect(() => {
        if (validatedAddress && deliveryEstimate) {
            setCurrentStep(2);
        }
    }, [validatedAddress, deliveryEstimate]);

    const handleAddressSelect = async (address: ValidatedAddress) => {
        setValidatedAddress(address);
        setIsCalculating(true);
        setEstimateError('');

        try {
            const estimate = await calculateDeliveryEstimate(
                FOOD_TRUCK_LOCATION,
                address.coordinates
            );
            setDeliveryEstimate(estimate);
        } catch (error: any) {
            setEstimateError(error.message || 'Failed to calculate delivery estimate');
            setDeliveryEstimate(null);
        } finally {
            setIsCalculating(false);
        }
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const calculateTax = (subtotal: number) => {
        return subtotal * 0.19;
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax(subtotal);
        const deliveryFee = deliveryEstimate?.deliveryFee || 0;
        return subtotal + tax + deliveryFee;
    };

    const handlePlaceOrder = async () => {
        if (!validatedAddress || !deliveryEstimate) {
            alert('Please enter and validate your delivery address');
            return;
        }

        setCurrentStep(3);
        setIsProcessing(true);

        try {
            const orderData = {
                items: cart,
                deliveryAddress: validatedAddress.formattedAddress,
                deliveryCoordinates: validatedAddress.coordinates,
                estimatedDeliveryTime: deliveryEstimate.estimatedArrival,
                distanceFromTruck: deliveryEstimate.distanceMeters,
                deliveryFee: deliveryEstimate.deliveryFee,
                subtotal: calculateSubtotal(),
                tax: calculateTax(calculateSubtotal()),
                total: calculateTotal(),
                specialInstructions,
            };

            console.log('Order data:', orderData);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            localStorage.removeItem('cart');
            router.push('/order-success');
        } catch (error) {
            console.error('Order failed:', error);
            alert('Failed to place order. Please try again.');
            setCurrentStep(2);
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-body)',
            paddingTop: '2rem',
            paddingBottom: '4rem'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            marginBottom: '1rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <ArrowLeft size={20} />
                        Back to Menu
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        Checkout
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Complete your order and get fresh food delivered
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '3rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 1.5rem',
                                background: currentStep >= step.id
                                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
                                    : 'var(--bg-card)',
                                border: `2px solid ${currentStep >= step.id ? 'transparent' : 'var(--border-color)'}`,
                                borderRadius: '12px',
                                color: currentStep >= step.id ? 'white' : 'var(--text-muted)',
                                transition: 'all 0.3s',
                                boxShadow: currentStep >= step.id ? 'var(--shadow-md)' : 'none'
                            }}
                        >
                            <step.icon size={20} />
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.name}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{step.description}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Left Column - Address & Delivery */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Address Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        <MapPin size={20} />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                                        Delivery Address
                                    </h2>
                                </div>
                                <AddressAutocomplete
                                    onAddressSelect={handleAddressSelect}
                                    placeholder="Enter your delivery address in München"
                                />
                            </motion.div>

                            {/* Delivery Estimation */}
                            <AnimatePresence>
                                {(validatedAddress || isCalculating || estimateError) && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <DeliveryEstimation
                                            estimate={deliveryEstimate}
                                            isLoading={isCalculating}
                                            error={estimateError}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Special Instructions */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    boxShadow: 'var(--shadow-md)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                                    📝 Special Instructions
                                </h2>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="Any special requests? (e.g., ring doorbell, leave at door)"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: '12px',
                                        background: 'var(--bg-body)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        resize: 'none',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        fontFamily: 'inherit'
                                    }}
                                    rows={3}
                                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                />
                            </motion.div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: '20px',
                                padding: '2rem',
                                boxShadow: 'var(--shadow-lg)',
                                border: '1px solid var(--border-color)',
                                height: 'fit-content',
                                position: 'sticky',
                                top: '2rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <ShoppingBag size={20} />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                                    Order Summary
                                </h2>
                            </div>

                            {/* Cart Items */}
                            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start',
                                            padding: '1rem 0',
                                            borderBottom: '1px solid var(--border-color)'
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p style={{ fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                                            €{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div style={{ padding: '1.5rem 0', borderTop: '2px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Subtotal</span>
                                    <span>€{subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Tax (19%)</span>
                                    <span>€{tax.toFixed(2)}</span>
                                </div>
                                {deliveryEstimate && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                                        <span>Delivery Fee</span>
                                        <span>€{deliveryEstimate.deliveryFee.toFixed(2)}</span>
                                    </div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    paddingTop: '1rem',
                                    borderTop: '2px solid var(--border-color)',
                                    color: 'var(--text-main)'
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary)' }}>€{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePlaceOrder}
                                disabled={!validatedAddress || !deliveryEstimate || isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '1.25rem',
                                    background: (!validatedAddress || !deliveryEstimate || isProcessing)
                                        ? 'var(--text-muted)'
                                        : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    cursor: (!validatedAddress || !deliveryEstimate || isProcessing) ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {isProcessing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        >
                                            ⏳
                                        </motion.div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Place Order
                                    </>
                                )}
                            </motion.button>

                            {!validatedAddress && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        marginTop: '1rem',
                                        fontSize: '0.875rem',
                                        color: 'var(--text-muted)',
                                        textAlign: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <AlertCircle size={14} />
                                    Please enter your delivery address to continue
                                </motion.p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
