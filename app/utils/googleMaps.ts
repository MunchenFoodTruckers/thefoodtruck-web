// Google Maps API utilities for address validation and delivery estimation

export interface ValidatedAddress {
    formattedAddress: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    placeId: string;
    addressComponents: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export interface DeliveryEstimate {
    distanceMeters: number;
    distanceText: string;
    durationSeconds: number;
    durationText: string;
    deliveryFee: number;
    estimatedArrival: Date;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Base delivery fee configuration
const BASE_DELIVERY_FEE = 2.99; // €2.99 base fee
const PRICE_PER_KM = 0.50; // €0.50 per kilometer
const MAX_DELIVERY_DISTANCE_KM = 15; // Maximum 15km delivery radius
const PREPARATION_TIME_MINUTES = 15; // Average food preparation time

/**
 * Load Google Maps API script dynamically
 */
export const loadGoogleMapsScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject(new Error('Window is not defined'));
            return;
        }

        if ((window as any).google?.maps) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.head.appendChild(script);
    });
};

/**
 * Geocode an address to get coordinates and validated address
 */
export const geocodeAddress = async (address: string): Promise<ValidatedAddress> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.[0]) {
        throw new Error('Address not found or invalid');
    }

    const result = data.results[0];
    const location = result.geometry.location;

    // Extract address components
    const components = result.address_components;
    const getComponent = (type: string) =>
        components.find((c: any) => c.types.includes(type))?.long_name || '';

    return {
        formattedAddress: result.formatted_address,
        coordinates: {
            lat: location.lat,
            lng: location.lng,
        },
        placeId: result.place_id,
        addressComponents: {
            street: getComponent('route'),
            city: getComponent('locality') || getComponent('administrative_area_level_2'),
            postalCode: getComponent('postal_code'),
            country: getComponent('country'),
        },
    };
};

/**
 * Calculate delivery time and distance using Distance Matrix API
 */
export const calculateDeliveryEstimate = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
): Promise<DeliveryEstimate> => {
    const originStr = `${origin.lat},${origin.lng}`;
    const destStr = `${destination.lat},${destination.lng}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.rows?.[0]?.elements?.[0]) {
        throw new Error('Unable to calculate delivery estimate');
    }

    const element = data.rows[0].elements[0];

    if (element.status !== 'OK') {
        throw new Error('No route found to destination');
    }

    const distanceMeters = element.distance.value;
    const distanceKm = distanceMeters / 1000;
    const durationSeconds = element.duration.value;

    // Check if within delivery radius
    if (distanceKm > MAX_DELIVERY_DISTANCE_KM) {
        throw new Error(`Address is outside our delivery zone (max ${MAX_DELIVERY_DISTANCE_KM}km)`);
    }

    // Calculate delivery fee
    const deliveryFee = Number((BASE_DELIVERY_FEE + (distanceKm * PRICE_PER_KM)).toFixed(2));

    // Calculate estimated arrival (preparation time + travel time)
    const totalMinutes = PREPARATION_TIME_MINUTES + Math.ceil(durationSeconds / 60);
    const estimatedArrival = new Date(Date.now() + totalMinutes * 60 * 1000);

    return {
        distanceMeters,
        distanceText: element.distance.text,
        durationSeconds,
        durationText: element.duration.text,
        deliveryFee,
        estimatedArrival,
    };
};

/**
 * Get autocomplete predictions for an address
 */
export const getAddressPredictions = async (input: string): Promise<any[]> => {
    if (!input || input.length < 3) return [];

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:de&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Autocomplete error:', data.status);
        return [];
    }

    return data.predictions || [];
};

/**
 * Validate if address is within München area
 */
export const isWithinMunichArea = (address: ValidatedAddress): boolean => {
    const city = address.addressComponents.city.toLowerCase();
    const formattedAddress = address.formattedAddress.toLowerCase();

    return city.includes('münchen') ||
        city.includes('munich') ||
        formattedAddress.includes('münchen') ||
        formattedAddress.includes('munich');
};

/**
 * Calculate delivery fee based on distance
 */
export const calculateDeliveryFee = (distanceKm: number): number => {
    return Number((BASE_DELIVERY_FEE + (distanceKm * PRICE_PER_KM)).toFixed(2));
};
