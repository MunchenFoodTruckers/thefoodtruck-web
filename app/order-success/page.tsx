'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from '../components/ui/Button';
import FadeIn from '../components/animations/FadeIn';

export default function OrderSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        // Trigger confetti animation
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#06c167', '#10b981', '#34d399'],
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#06c167', '#10b981', '#34d399'],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
            <FadeIn>
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
                        className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle size={48} className="text-green-600" />
                    </motion.div>

                    {/* Success Message */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-gray-900 mb-3"
                    >
                        Order Placed Successfully!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-600 mb-8"
                    >
                        Your delicious food is being prepared and will be delivered soon. We'll send you updates via email.
                    </motion.p>

                    {/* Order Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gray-50 rounded-lg p-4 mb-8"
                    >
                        <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
                            <Package size={20} />
                            <span className="font-semibold">Order #{Math.floor(Math.random() * 10000)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                            Track your order status in your email
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full"
                            size="lg"
                        >
                            <Home size={20} className="mr-2" />
                            Back to Home
                        </Button>

                        <button
                            onClick={() => router.push('/menu')}
                            className="w-full py-3 text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                            Order More Food
                        </button>
                    </motion.div>
                </div>
            </FadeIn>
        </div>
    );
}
