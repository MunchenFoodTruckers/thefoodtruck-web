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
        <div style={{ position: 'relative' }} className={className}>
            <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.5rem'
            }}>
                Delivery Address
            </label>

            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                }}>
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
                    style={{
                        width: '100%',
                        paddingLeft: '2.5rem',
                        paddingRight: '3rem',
                        padding: '0.75rem',
                        border: `2px solid ${error ? '#ef4444' : isValidated ? 'var(--primary)' : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        background: 'var(--bg-body)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem'
                    }}
                />

                <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                    {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                            <Loader2 size={20} style={{ color: 'var(--text-muted)' }} />
                        </motion.div>
                    ) : isValidated ? (
                        <Check size={20} style={{ color: 'var(--primary)' }} />
                    ) : error ? (
                        <AlertCircle size={20} style={{ color: '#ef4444' }} />
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
                        style={{
                            position: 'absolute',
                            zIndex: 50,
                            width: '100%',
                            marginTop: '0.5rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-lg)',
                            maxHeight: '240px',
                            overflowY: 'auto'
                        }}
                    >
                        {predictions.map((prediction, index) => (
                            <button
                                key={prediction.place_id}
                                onClick={() => handleSelectPrediction(prediction)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: index < predictions.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    color: 'var(--text-main)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-body)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                                    <MapPin size={16} style={{ color: 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {prediction.structured_formatting.main_text}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {prediction.structured_formatting.secondary_text}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
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
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        background: 'none',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.5 : 1,
                        padding: 0
                    }}
                >
                    Validate this address
                </motion.button>
            )}

            {/* Success Message */}
            {isValidated && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <Check size={14} />
                    Address validated successfully
                </motion.p>
            )}
        </div>
    );
}
