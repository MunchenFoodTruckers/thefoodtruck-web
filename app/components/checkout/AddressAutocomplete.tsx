'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';
import { loadGoogleMapsScript, geocodeAddress, ValidatedAddress } from '../../utils/googleMaps';

interface AddressAutocompleteProps {
    onAddressSelect: (address: ValidatedAddress) => void;
    initialValue?: string;
    placeholder?: string;
    className?: string;
}

export default function AddressAutocomplete({
    onAddressSelect,
    initialValue = '',
    placeholder = 'Enter your delivery address',
    className = '',
}: AddressAutocompleteProps) {
    const [input, setInput] = useState(initialValue);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteService = useRef<any>(null);
    const debounceTimer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        loadGoogleMapsScript()
            .then(() => {
                autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
            })
            .catch((err) => {
                console.error('Failed to load Google Maps:', err);
                setError('Failed to load address service');
            });
    }, []);

    const handleInputChange = (value: string) => {
        setInput(value);
        setIsValidated(false);
        setError('');

        if (value.length < 3) {
            setPredictions([]);
            setShowDropdown(false);
            return;
        }

        // Debounce autocomplete requests
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (autocompleteService.current) {
                autocompleteService.current.getPlacePredictions(
                    {
                        input: value,
                        types: ['address'],
                        componentRestrictions: { country: 'de' },
                    },
                    (results: any[], status: string) => {
                        if (status === 'OK' && results) {
                            setPredictions(results);
                            setShowDropdown(true);
                        } else {
                            setPredictions([]);
                            setShowDropdown(false);
                        }
                    }
                );
            }
        }, 300);
    };

    const handleSelectPrediction = async (prediction: any) => {
        setInput(prediction.description);
        setShowDropdown(false);
        setIsLoading(true);
        setError('');

        try {
            const validatedAddress = await geocodeAddress(prediction.description);
            setIsValidated(true);
            onAddressSelect(validatedAddress);
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to validate address');
            setIsValidated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualValidation = async () => {
        if (!input || input.length < 5) {
            setError('Please enter a valid address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const validatedAddress = await geocodeAddress(input);
            setIsValidated(true);
            setInput(validatedAddress.formattedAddress);
            onAddressSelect(validatedAddress);
        } catch (err: any) {
            setError(err.message || 'Failed to validate address');
            setIsValidated(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
            </label>

            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MapPin size={20} />
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => predictions.length > 0 && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder={placeholder}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all ${error ? 'border-red-500' : isValidated ? 'border-green-500' : 'border-gray-300'
                        }`}
                />

                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isLoading ? (
                        <Loader2 size={20} className="text-gray-400 animate-spin" />
                    ) : isValidated ? (
                        <Check size={20} className="text-green-500" />
                    ) : error ? (
                        <AlertCircle size={20} className="text-red-500" />
                    ) : null}
                </div>
            </div>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
                {showDropdown && predictions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                        {predictions.map((prediction) => (
                            <motion.button
                                key={prediction.place_id}
                                whileHover={{ backgroundColor: '#f3f4f6' }}
                                onClick={() => handleSelectPrediction(prediction)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {prediction.structured_formatting.main_text}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {prediction.structured_formatting.secondary_text}
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                >
                    <AlertCircle size={14} />
                    {error}
                </motion.p>
            )}

            {/* Manual Validation Button */}
            {input && !isValidated && !showDropdown && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleManualValidation}
                    disabled={isLoading}
                    className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50"
                >
                    Validate this address
                </motion.button>
            )}

            {/* Success Message */}
            {isValidated && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-green-600 flex items-center gap-1"
                >
                    <Check size={14} />
                    Address validated successfully
                </motion.p>
            )}
        </div>
    );
}
