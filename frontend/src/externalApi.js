// ==========================
// 🍕 PIZZAVIBE PREMIUM SPECIALS (20 UNIQUE HANDCRAFTED PIZZAS)
// Accurate Domino's codes included for backend validation
// ==========================



// Fallback high-quality images
const PIZZA_BACKUP = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

// ==========================
// 📦 API FUNCTIONS
// ==========================

import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/_/backend/api`; // Using the new /_/backend prefix

export const getByCategory = async (category) => {
  try {
    if (category === 'pizzas') {
      const response = await axios.get(`${API_URL}/pizzas`);
      // Robustly handle different response formats
      if (response.data && Array.isArray(response.data.pizzas)) {
        return response.data.pizzas;
      }
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch pizzas:", error);
    return [];
  }
};

export const localizeItem = (item) => {
  // Handle both static and backend formats
  return {
    ...item,
    id: item.id,
    name: item.name,
    description: item.description || item.dsc,
    image: item.image || item.img || PIZZA_BACKUP,
    price: item.price,
    isVeg: item.category === 'veg' || item.isVeg === true,
    rate: item.averageRating || item.rate || 0,
    badges: [
      (item.category === 'veg' || item.isVeg) ? 'Veg' : 'Non-Veg',
      (item.averageRating >= 4.5 || item.rate >= 5) ? 'Chef Spl' : ''
    ].filter(Boolean)
  };
};

export const isIndianDish = () => true;

// ==========================
// 👨‍🍳 EXTRA DATA
// ==========================

export const getChefTip = async () => {
  const tips = [
    "Our dough is hand-stretched and baked at 450°C for the perfect char.",
    "Try the Paneer Makhani Magic for a creamy, buttery experience.",
    "The Vibe Garden Special is our most nutritious and loaded veg option.",
    "Order a side of our peri-peri fries to complete your meal.",
    "Our Non-Veg Supreme features 4 different types of premium chicken."
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

export const getLocalWeather = async () => ({ temp: 28, desc: 'Clear Vibe', city: 'Mumbai' });
