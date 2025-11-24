// Mock food truck location data for München
export interface FoodTruckLocation {
    id: string;
    name: string;
    description: string;
    location: string;
    address: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    hours: string;
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string;
    endTime: string;
    specialEvent?: string;
    image?: string;
}

export const foodTruckLocations: FoodTruckLocation[] = [
    {
        id: '1',
        name: 'Marienplatz Food Truck',
        description: 'Authentic Bavarian street food',
        location: 'Marienplatz',
        address: 'Marienplatz 1, 80331 München',
        coordinates: { lat: 48.1374, lng: 11.5755 },
        hours: '11:00 - 22:00',
        dayOfWeek: new Date().getDay(),
        startTime: '11:00',
        endTime: '22:00',
    },
    {
        id: '2',
        name: 'Viktualienmarkt Stand',
        description: 'Fresh local ingredients',
        location: 'Viktualienmarkt',
        address: 'Viktualienmarkt 3, 80331 München',
        coordinates: { lat: 48.1351, lng: 11.5762 },
        hours: '10:00 - 20:00',
        dayOfWeek: new Date().getDay(),
        startTime: '10:00',
        endTime: '20:00',
    },
    {
        id: '3',
        name: 'English Garden Truck',
        description: 'Perfect for park picnics',
        location: 'Englischer Garten',
        address: 'Englischer Garten, 80538 München',
        coordinates: { lat: 48.1642, lng: 11.6056 },
        hours: '12:00 - 21:00',
        dayOfWeek: new Date().getDay(),
        startTime: '12:00',
        endTime: '21:00',
    },
    {
        id: '4',
        name: 'Odeonsplatz Express',
        description: 'Quick bites near the palace',
        location: 'Odeonsplatz',
        address: 'Odeonsplatz, 80539 München',
        coordinates: { lat: 48.1426, lng: 11.5770 },
        hours: '11:30 - 21:30',
        dayOfWeek: new Date().getDay(),
        startTime: '11:30',
        endTime: '21:30',
    },
    {
        id: '5',
        name: 'Olympiapark Food Hub',
        description: 'Sports and street food',
        location: 'Olympiapark',
        address: 'Spiridon-Louis-Ring 21, 80809 München',
        coordinates: { lat: 48.1740, lng: 11.5547 },
        hours: '10:00 - 22:00',
        dayOfWeek: new Date().getDay(),
        startTime: '10:00',
        endTime: '22:00',
        specialEvent: 'Weekend Special',
    },
    {
        id: '6',
        name: 'Sendlinger Tor Bites',
        description: 'Traditional Munich flavors',
        location: 'Sendlinger Tor',
        address: 'Sendlinger-Tor-Platz, 80336 München',
        coordinates: { lat: 48.1349, lng: 11.5667 },
        hours: '11:00 - 20:00',
        dayOfWeek: new Date().getDay(),
        startTime: '11:00',
        endTime: '20:00',
    },
    {
        id: '7',
        name: 'Gärtnerplatz Gourmet',
        description: 'Upscale street food',
        location: 'Gärtnerplatz',
        address: 'Gärtnerplatz, 80469 München',
        coordinates: { lat: 48.1323, lng: 11.5702 },
        hours: '12:00 - 23:00',
        dayOfWeek: new Date().getDay(),
        startTime: '12:00',
        endTime: '23:00',
    },
    {
        id: '8',
        name: 'Theresienwiese Truck',
        description: 'Oktoberfest vibes year-round',
        location: 'Theresienwiese',
        address: 'Theresienwiese, 80336 München',
        coordinates: { lat: 48.1312, lng: 11.5497 },
        hours: '11:00 - 22:00',
        dayOfWeek: new Date().getDay(),
        startTime: '11:00',
        endTime: '22:00',
    },
];

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Get locations sorted by distance from user
export function getNearbyLocations(
    userLat: number,
    userLng: number,
    maxDistance: number = 10
): FoodTruckLocation[] {
    return foodTruckLocations
        .map((location) => ({
            ...location,
            distance: calculateDistance(
                userLat,
                userLng,
                location.coordinates.lat,
                location.coordinates.lng
            ),
        }))
        .filter((location) => location.distance <= maxDistance)
        .sort((a, b) => a.distance! - b.distance!);
}

// Get today's locations
export function getTodayLocations(): FoodTruckLocation[] {
    const today = new Date().getDay();
    return foodTruckLocations.filter((loc) => loc.dayOfWeek === today);
}

// Get all locations
export function getAllLocations(): FoodTruckLocation[] {
    return foodTruckLocations;
}
