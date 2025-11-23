'use client';

import { useState, useEffect } from 'react';
import { dietApi, DietPlan, DietaryPreference } from '../api/diet';

const GOALS = [
    { value: 'weight_loss', label: 'Weight Loss', emoji: '📉', calories: 1800 },
    { value: 'muscle_gain', label: 'Muscle Gain', emoji: '💪', calories: 2500 },
    { value: 'maintenance', label: 'Maintenance', emoji: '⚖️', calories: 2200 },
];

const PREFERENCES = [
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'keto', label: 'Keto', emoji: '🥑' },
    { value: 'paleo', label: 'Paleo', emoji: '🍖' },
    { value: 'gluten_free', label: 'Gluten Free', emoji: '🌾' },
    { value: 'dairy_free', label: 'Dairy Free', emoji: '🥛' },
];

const ALLERGIES = [
    { value: 'nuts', label: 'Nuts' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'soy', label: 'Soy' },
    { value: 'wheat', label: 'Wheat' },
];

export default function DietPage() {
    const [step, setStep] = useState<'preferences' | 'goals' | 'plans'>('preferences');
    const [preferences, setPreferences] = useState<string[]>([]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [selectedGoal, setSelectedGoal] = useState('maintenance');
    const [plans, setPlans] = useState<DietPlan[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId] = useState('user-123'); // TODO: Get from auth context

    useEffect(() => {
        loadPreferences();
        loadPlans();
    }, []);

    const loadPreferences = async () => {
        try {
            const prefs = await dietApi.getDietaryPreferences(userId);
            if (prefs) {
                setPreferences(prefs.preferences);
                setAllergies(prefs.allergies);
            }
        } catch (err) {
            console.error('Failed to load preferences:', err);
        }
    };

    const loadPlans = async () => {
        try {
            const data = await dietApi.getDietPlans(userId);
            setPlans(data);
        } catch (err) {
            console.error('Failed to load plans:', err);
        }
    };

    const handleSavePreferences = async () => {
        setLoading(true);
        try {
            await dietApi.updateDietaryPreferences(userId, preferences, allergies);
            setStep('goals');
        } catch (err) {
            alert('Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePlan = async () => {
        setLoading(true);
        try {
            const goal = GOALS.find(g => g.value === selectedGoal)!;
            await dietApi.createDietPlan({
                userId,
                name: `${goal.label} Plan`,
                goal: selectedGoal,
                targetCalories: goal.calories,
                targetProtein: Math.round(goal.calories * 0.3 / 4),
                targetCarbs: Math.round(goal.calories * 0.4 / 4),
                targetFat: Math.round(goal.calories * 0.3 / 9),
            });
            await loadPlans();
            setStep('plans');
        } catch (err) {
            alert('Failed to create plan');
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = (pref: string) => {
        setPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies(prev =>
            prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
        );
    };

    return (
        <>
            <section className="hero" style={{ paddingBottom: '2rem' }}>
                <h1>Diet & Meal Planning</h1>
                <p>Create personalized meal plans that fit your goals</p>
            </section>

            <div className="container">
                {/* Step Indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '3rem',
                    flexWrap: 'wrap'
                }}>
                    {['preferences', 'goals', 'plans'].map((s, i) => (
                        <div
                            key={s}
                            onClick={() => setStep(s as any)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                background: step === s ? 'var(--primary)' : 'var(--gray-100)',
                                color: step === s ? 'white' : 'var(--gray-600)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                        </div>
                    ))}
                </div>

                {/* Step 1: Preferences */}
                {step === 'preferences' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Dietary Preferences</h2>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>What's your diet style?</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '1rem'
                            }}>
                                {PREFERENCES.map(pref => (
                                    <div
                                        key={pref.value}
                                        onClick={() => togglePreference(pref.value)}
                                        style={{
                                            padding: '1.5rem',
                                            borderRadius: '16px',
                                            border: `2px solid ${preferences.includes(pref.value) ? 'var(--primary)' : 'var(--gray-200)'}`,
                                            background: preferences.includes(pref.value) ? 'var(--primary-light)' : 'white',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{pref.emoji}</div>
                                        <div style={{ fontWeight: 600 }}>{pref.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Any allergies?</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {ALLERGIES.map(allergy => (
                                    <button
                                        key={allergy.value}
                                        onClick={() => toggleAllergy(allergy.value)}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: '24px',
                                            border: `2px solid ${allergies.includes(allergy.value) ? '#f00' : 'var(--gray-200)'}`,
                                            background: allergies.includes(allergy.value) ? '#fee' : 'white',
                                            color: allergies.includes(allergy.value) ? '#c00' : 'var(--gray-700)',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {allergies.includes(allergy.value) && '⚠️ '}{allergy.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSavePreferences}
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Saving...' : 'Continue to Goals →'}
                        </button>
                    </div>
                )}

                {/* Step 2: Goals */}
                {step === 'goals' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ marginBottom: '2rem' }}>What's your goal?</h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            {GOALS.map(goal => (
                                <div
                                    key={goal.value}
                                    onClick={() => setSelectedGoal(goal.value)}
                                    style={{
                                        padding: '2rem',
                                        borderRadius: '20px',
                                        border: `3px solid ${selectedGoal === goal.value ? 'var(--primary)' : 'var(--gray-200)'}`,
                                        background: selectedGoal === goal.value ? 'var(--primary-light)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s',
                                        transform: selectedGoal === goal.value ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{goal.emoji}</div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{goal.label}</h3>
                                    <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                                        Target: {goal.calories} cal/day
                                    </p>
                                    <div style={{
                                        background: 'var(--gray-100)',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem'
                                    }}>
                                        Protein: {Math.round(goal.calories * 0.3 / 4)}g<br />
                                        Carbs: {Math.round(goal.calories * 0.4 / 4)}g<br />
                                        Fat: {Math.round(goal.calories * 0.3 / 9)}g
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleCreatePlan}
                            disabled={loading}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                        >
                            {loading ? 'Creating Plan...' : 'Create My Plan →'}
                        </button>
                    </div>
                )}

                {/* Step 3: Plans */}
                {step === 'plans' && (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Your Meal Plans</h2>
                            <button
                                onClick={() => setStep('goals')}
                                className="btn-secondary"
                            >
                                + Create New Plan
                            </button>
                        </div>

                        {plans.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                                <h3>No meal plans yet</h3>
                                <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
                                    Create your first meal plan to get started
                                </p>
                                <button onClick={() => setStep('goals')} className="btn-primary">
                                    Create Plan
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {plans.map(plan => (
                                    <div
                                        key={plan.id}
                                        style={{
                                            background: 'white',
                                            borderRadius: '20px',
                                            padding: '2rem',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            border: plan.isActive ? '2px solid var(--primary)' : '1px solid var(--gray-200)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                            <div>
                                                <h3 style={{ marginBottom: '0.5rem' }}>{plan.name}</h3>
                                                <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
                                                    Goal: {plan.goal.replace('_', ' ')}
                                                </div>
                                            </div>
                                            {plan.isActive && (
                                                <span style={{
                                                    background: 'var(--primary)',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 600
                                                }}>
                                                    Active
                                                </span>
                                            )}
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Calories</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.targetCalories}</div>
                                            </div>
                                            <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Protein</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.targetProtein}g</div>
                                            </div>
                                            <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Carbs</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.targetCarbs}g</div>
                                            </div>
                                            <div style={{ background: 'var(--gray-100)', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>Fat</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{plan.targetFat}g</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
