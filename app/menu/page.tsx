'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocation } from '../context/LocationContext';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    available: boolean;
    dietary: string[];
    popular?: boolean;
    calories?: number;
}

interface CartItem extends MenuItem {
    quantity: number;
}

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const { address, deliveryMode, isAddressSet } = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }

        fetch('/api/menu')
            .then(res => res.json())
            .then(data => {
                setMenuItems(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const saveCart = (newCart: CartItem[]) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const addToCart = (item: MenuItem) => {
        const existingItem = cart.find(c => c.id === item.id);
        if (existingItem) {
            const newCart = cart.map(c =>
                c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
            );
            saveCart(newCart);
        } else {
            saveCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId: string) => {
        const existingItem = cart.find(c => c.id === itemId);
        if (existingItem && existingItem.quantity > 1) {
            const newCart = cart.map(c =>
                c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
            );
            saveCart(newCart);
        } else {
            saveCart(cart.filter(c => c.id !== itemId));
        }
    };

    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const checkout = () => {
        if (!user) {
            alert('Please login to place an order');
            window.location.href = '/login';
            return;
        }

        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Navigate to checkout page
        window.location.href = '/checkout';
    };

    if (loading) return <div className="loading">Loading delicious menu...</div>;

    return (
        <div className="container">
            {/* Delivery Context Bar */}
            <div style={{
                background: 'var(--gray-100)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{deliveryMode === 'delivery' ? '🛵' : '🏃'}</span>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#666' }}>
                            {deliveryMode === 'delivery' ? 'Delivering to' : 'Pickup at'}
                        </div>
                        <div style={{ fontWeight: 700 }}>
                            {address || (deliveryMode === 'delivery' ? 'Select Address' : 'München Food Truck')}
                        </div>
                    </div>
                </div>
                <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                    Change
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Menu</h1>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Fresh ingredients, authentic recipes</p>

                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            ⭐ Popular Items
                        </h2>
                        <div className="card-grid">
                            {menuItems.filter(item => item.popular).map(item => (
                                <MenuItemCard key={item.id} item={item} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                            ))}
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>All Items</h2>
                    <div className="card-grid">
                        {menuItems.map(item => (
                            <MenuItemCard key={item.id} item={item} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                        ))}
                    </div>
                </div>

                <div className="cart-sidebar" style={{ width: '350px', minWidth: '300px' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🛒 Your Cart
                    </h2>

                    {cart.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty</p>
                    ) : (
                        <>
                            <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#666' }}>€{item.price} × {item.quantity}</div>
                                        </div>
                                        <div className="quantity-control">
                                            <button onClick={() => removeFromCart(item.id)} className="quantity-btn">
                                                -
                                            </button>
                                            <span style={{ fontWeight: 600, minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="quantity-btn primary">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '2px solid var(--gray-100)', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                                    <span>Total ({getTotalItems()} items)</span>
                                    <span style={{ color: 'var(--primary)' }}>€{getTotal().toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={checkout}
                                    className="btn-primary"
                                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                                >
                                    Checkout
                                </button>

                                <button
                                    onClick={clearCart}
                                    style={{
                                        width: '100%',
                                        marginTop: '0.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#999',
                                        cursor: 'pointer',
                                        padding: '0.5rem'
                                    }}
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}

                    {!user && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            background: '#fff3e0',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#e65100'
                        }}>
                            Please <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>login</Link> to checkout
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MenuItemCard({ item, cart, addToCart, removeFromCart }: {
    item: MenuItem;
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (id: string) => void;
}) {
    const cartItem = cart.find(c => c.id === item.id);
    const quantity = cartItem?.quantity || 0;

    return (
        <div className="card" style={{ position: 'relative' }}>
            {item.popular && (
                <div className="popular-badge">
                    ⭐ Popular
                </div>
            )}

            <div className="menu-image-container">
                <img
                    src={item.image}
                    alt={item.name}
                />
            </div>

            <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
            <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.description}</p>

            {item.calories && (
                <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
                    {item.calories} cal
                </p>
            )}

            {item.dietary && item.dietary.length > 0 && (
                <div className="badges" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {item.dietary.map(diet => (
                        <span key={diet} className={`badge ${diet}`}>
                            {diet === 'vegan' && '🌱'} {diet === 'vegetarian' && '🥬'} {diet === 'gluten-free' && '🌾'}
                            {diet}
                        </span>
                    ))}
                </div>
            )}

            <div className="price" style={{ marginBottom: '1rem' }}>€{item.price.toFixed(2)}</div>

            {!item.available ? (
                <div style={{
                    background: '#ffebee',
                    color: '#c62828',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 600
                }}>
                    Sold Out
                </div>
            ) : quantity > 0 ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                    <button onClick={() => removeFromCart(item.id)} className="quantity-btn">
                        -
                    </button>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, minWidth: '50px', textAlign: 'center' }}>
                        {quantity}
                    </span>
                    <button onClick={() => addToCart(item)} className="quantity-btn primary">
                        +
                    </button>
                </div>
            ) : (
                <button onClick={() => addToCart(item)} className="btn-primary" style={{ width: '100%' }}>
                    Add to Cart
                </button>
            )}
        </div>
    );
}
