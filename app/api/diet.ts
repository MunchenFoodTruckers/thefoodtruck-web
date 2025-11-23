const DIET_API = process.env.NEXT_PUBLIC_DIET_API || 'https://foodtruck-diet-plan-service.onrender.com';

export interface DietPlan {
    id: string;
    userId: string;
    name: string;
    goal: string;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    isActive: boolean;
    createdAt: string;
}

export interface DietaryPreference {
    id: string;
    userId: string;
    preferences: string[];
    allergies: string[];
}

export interface CreateDietPlanData {
    userId: string;
    name: string;
    goal: string;
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
}

export const dietApi = {
    async getDietPlans(userId: string): Promise<DietPlan[]> {
        const res = await fetch(`${DIET_API}/api/diet-plans/${userId}`);
        if (!res.ok) throw new Error('Failed to fetch diet plans');
        return res.json();
    },

    async createDietPlan(data: CreateDietPlanData): Promise<DietPlan> {
        const res = await fetch(`${DIET_API}/api/diet-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create diet plan');
        return res.json();
    },

    async activateDietPlan(planId: string): Promise<void> {
        const res = await fetch(`${DIET_API}/api/diet-plans/${planId}/activate`, {
            method: 'POST',
        });
        if (!res.ok) throw new Error('Failed to activate diet plan');
    },

    async getDietaryPreferences(userId: string): Promise<DietaryPreference | null> {
        const res = await fetch(`${DIET_API}/api/dietary-preferences/${userId}`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to fetch dietary preferences');
        return res.json();
    },

    async updateDietaryPreferences(userId: string, preferences: string[], allergies: string[]): Promise<DietaryPreference> {
        const res = await fetch(`${DIET_API}/api/dietary-preferences/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences, allergies }),
        });
        if (!res.ok) throw new Error('Failed to update dietary preferences');
        return res.json();
    },
};
