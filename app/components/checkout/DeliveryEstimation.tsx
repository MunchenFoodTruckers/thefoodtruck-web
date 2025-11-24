'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Truck, Euro } from 'lucide-react';
import { DeliveryEstimate } from '../../utils/googleMaps';

interface DeliveryEstimationProps {
    estimate: DeliveryEstimate | null;
    isLoading: boolean;
    error?: string;
}

export default function DeliveryEstimation({ estimate, isLoading, error }: DeliveryEstimationProps) {
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
                <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 border border-gray-200 rounded-lg p-6"
            >
                <div className="flex items-center justify-center gap-3">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Truck size={24} className="text-green-600" />
                    </motion.div>
                    <p className="text-gray-600">Calculating delivery estimate...</p>
                </div>
            </motion.div>
        );
    }

    if (!estimate) {
        return null;
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-green-600" size={20} />
                Delivery Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Estimated Time */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock size={16} />
                        <span className="text-xs font-medium uppercase">Estimated Arrival</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        {formatTime(estimate.estimatedArrival)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        In approximately {estimate.durationText}
                    </p>
                </motion.div>

                {/* Distance */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin size={16} />
                        <span className="text-xs font-medium uppercase">Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {estimate.distanceText}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        From nearest food truck
                    </p>
                </motion.div>

                {/* Delivery Fee */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-lg p-4 shadow-sm"
                >
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Euro size={16} />
                        <span className="text-xs font-medium uppercase">Delivery Fee</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        €{estimate.deliveryFee.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Based on distance
                    </p>
                </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg"
            >
                <p className="text-xs text-gray-600 text-center">
                    ⚡ Your order will be prepared fresh and delivered hot to your door
                </p>
            </motion.div>
        </motion.div>
    );
}
