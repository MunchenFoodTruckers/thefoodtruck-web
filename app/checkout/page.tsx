'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import AddressAutocomplete from '../components/checkout/AddressAutocomplete';
import DeliveryEstimation from '../components/checkout/DeliveryEstimation';
import Button from '../components/ui/Button';
import { ValidatedAddress, DeliveryEstimate, calculateDeliveryEstimate } from '../utils/googleMaps';
import FadeIn from '../components/animations/FadeIn';
import SlideIn from '../components/animations/SlideIn';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [validatedAddress, setValidatedAddress] = useState<ValidatedAddress | null>(null);
    const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [estimateError, setEstimateError] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock food truck location (Marienplatz, München)
    const FOOD_TRUCK_LOCATION = {
        lat: 48.1374,
        lng: 11.5755,
    };

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        } else {
            // Redirect to menu if cart is empty
            router.push('/menu');
        }
    }, [router]);

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
        return subtotal * 0.19; // 19% VAT in Germany
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

        setIsProcessing(true);

        try {
            // TODO: Integrate with actual orders service
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

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Clear cart
            localStorage.removeItem('cart');

            // Redirect to success page
            router.push('/order-success');
        } catch (error) {
            console.error('Order failed:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container max-w-6xl mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeft size={20} />
                            Back to Menu
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                        <p className="text-gray-600 mt-2">Complete your order and get fresh food delivered</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Address & Delivery */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Address Section */}
                        <SlideIn direction="left">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
                                <AddressAutocomplete
                                    onAddressSelect={handleAddressSelect}
                                    placeholder="Enter your delivery address in München"
                                />
                            </div>
                        </SlideIn>

                        {/* Delivery Estimation */}
                        {(validatedAddress || isCalculating || estimateError) && (
                            <SlideIn direction="left" delay={0.1}>
                                <DeliveryEstimation
                                    estimate={deliveryEstimate}
                                    isLoading={isCalculating}
                                    error={estimateError}
                                />
                            </SlideIn>
                        )}

                        {/* Special Instructions */}
                        <SlideIn direction="left" delay={0.2}>
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="Any special requests? (e.g., ring doorbell, leave at door)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                                    rows={3}
                                />
                            </div>
                        </SlideIn>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <SlideIn direction="right">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShoppingBag size={20} />
                                    Order Summary
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-start py-2 border-b border-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-2 py-4 border-t border-gray-200">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>€{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (19%)</span>
                                        <span>€{tax.toFixed(2)}</span>
                                    </div>
                                    {deliveryEstimate && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Delivery Fee</span>
                                            <span>€{deliveryEstimate.deliveryFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>€{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={!validatedAddress || !deliveryEstimate || isProcessing}
                                    isLoading={isProcessing}
                                    className="w-full mt-4"
                                    size="lg"
                                >
                                    <CreditCard size={20} className="mr-2" />
                                    {isProcessing ? 'Processing...' : 'Place Order'}
                                </Button>

                                {!validatedAddress && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1"
                                    >
                                        <AlertCircle size={12} />
                                        Please enter your delivery address to continue
                                    </motion.p>
                                )}
                            </div>
                        </SlideIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
