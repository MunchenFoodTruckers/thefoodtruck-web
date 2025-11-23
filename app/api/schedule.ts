const SCHEDULE_API = process.env.NEXT_PUBLIC_SCHEDULE_API || 'https://foodtruck-schedule-service.onrender.com';

export interface FoodTruck {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface Schedule {
    id: string;
    foodTruckId: string;
    foodTruck?: FoodTruck;
    locationName: string;
    address: string;
    latitude: number;
    longitude: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
    specialEvent?: string;
    distance?: number;
}

export const scheduleApi = {
    async getTodaySchedules(): Promise<Schedule[]> {
        const res = await fetch(`${SCHEDULE_API}/api/schedules/today`);
        if (!res.ok) throw new Error('Failed to fetch schedules');
        return res.json();
    },

    async getNearbySchedules(latitude: number, longitude: number, radiusKm: number = 5): Promise<Schedule[]> {
        const res = await fetch(
            `${SCHEDULE_API}/api/schedules/near?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
        );
        if (!res.ok) throw new Error('Failed to fetch nearby schedules');
        return res.json();
    },

    async getAllSchedules(): Promise<Schedule[]> {
        const res = await fetch(`${SCHEDULE_API}/api/schedules`);
        if (!res.ok) throw new Error('Failed to fetch schedules');
        return res.json();
    },

    async getFoodTrucks(): Promise<FoodTruck[]> {
        const res = await fetch(`${SCHEDULE_API}/api/food-trucks`);
        if (!res.ok) throw new Error('Failed to fetch food trucks');
        return res.json();
    },

    async getFoodTruckSchedule(foodTruckId: string): Promise<Schedule[]> {
        const res = await fetch(`${SCHEDULE_API}/api/food-trucks/${foodTruckId}/schedule`);
        if (!res.ok) throw new Error('Failed to fetch food truck schedule');
        return res.json();
    },
};
