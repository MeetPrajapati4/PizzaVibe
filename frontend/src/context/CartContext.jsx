import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('pizzavibe_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('pizzavibe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pizza) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === pizza.id);
      if (existing) {
        return prev.map(item => 
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaId) => {
    setCartItems(prev => prev.filter(item => item.id !== pizzaId));
  };

  const updateQuantity = (pizzaId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === pizzaId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
