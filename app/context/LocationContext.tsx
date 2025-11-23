'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
    address: string | null;
    setAddress: (address: string) => void;
    deliveryMode: 'delivery' | 'pickup';
    setDeliveryMode: (mode: 'delivery' | 'pickup') => void;
    isAddressSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddressState] = useState<string | null>(null);
    const [deliveryMode, setDeliveryModeState] = useState<'delivery' | 'pickup'>('delivery');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedAddress = localStorage.getItem('deliveryAddress');
        const savedMode = localStorage.getItem('deliveryMode');

        if (savedAddress) setAddressState(savedAddress);
        if (savedMode) setDeliveryModeState(savedMode as 'delivery' | 'pickup');
    }, []);

    const setAddress = (addr: string) => {
        setAddressState(addr);
        localStorage.setItem('deliveryAddress', addr);
    };

    const setDeliveryMode = (mode: 'delivery' | 'pickup') => {
        setDeliveryModeState(mode);
        localStorage.setItem('deliveryMode', mode);
    };

    if (!mounted) return null;

    return (
        <LocationContext.Provider value={{
            address,
            setAddress,
            deliveryMode,
            setDeliveryMode,
            isAddressSet: !!address || deliveryMode === 'pickup'
        }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
