export const inventorySeed = [
  { category: "base", name: "Classic Hand Tossed", quantity: 60, threshold: 20, unit: "pcs", priceDelta: 0 },
  { category: "base", name: "Thin Crust", quantity: 60, threshold: 20, unit: "pcs", priceDelta: 20 },
  { category: "base", name: "Cheese Burst", quantity: 45, threshold: 20, unit: "pcs", priceDelta: 55 },
  { category: "base", name: "Whole Wheat", quantity: 50, threshold: 20, unit: "pcs", priceDelta: 25 },
  { category: "base", name: "Fresh Pan", quantity: 55, threshold: 20, unit: "pcs", priceDelta: 35 },

  { category: "sauce", name: "Classic Tomato", quantity: 70, threshold: 20, unit: "servings", priceDelta: 0 },
  { category: "sauce", name: "Spicy Peri Peri", quantity: 55, threshold: 20, unit: "servings", priceDelta: 15 },
  { category: "sauce", name: "Barbecue", quantity: 50, threshold: 20, unit: "servings", priceDelta: 20 },
  { category: "sauce", name: "Pesto Basil", quantity: 45, threshold: 20, unit: "servings", priceDelta: 25 },
  { category: "sauce", name: "Creamy Alfredo", quantity: 45, threshold: 20, unit: "servings", priceDelta: 30 },

  { category: "cheese", name: "Mozzarella", quantity: 80, threshold: 25, unit: "servings", priceDelta: 0 },
  { category: "cheese", name: "Cheddar", quantity: 65, threshold: 25, unit: "servings", priceDelta: 20 },
  { category: "cheese", name: "Parmesan", quantity: 45, threshold: 15, unit: "servings", priceDelta: 35 },
  { category: "cheese", name: "Vegan Cheese", quantity: 35, threshold: 15, unit: "servings", priceDelta: 45 },
  { category: "cheese", name: "Four Cheese Blend", quantity: 40, threshold: 15, unit: "servings", priceDelta: 55 },

  { category: "veggie", name: "Onion", quantity: 100, threshold: 25, unit: "servings", priceDelta: 10 },
  { category: "veggie", name: "Capsicum", quantity: 95, threshold: 25, unit: "servings", priceDelta: 10 },
  { category: "veggie", name: "Sweet Corn", quantity: 90, threshold: 25, unit: "servings", priceDelta: 15 },
  { category: "veggie", name: "Jalapeno", quantity: 75, threshold: 20, unit: "servings", priceDelta: 15 },
  { category: "veggie", name: "Mushroom", quantity: 80, threshold: 20, unit: "servings", priceDelta: 20 },
  { category: "veggie", name: "Olives", quantity: 70, threshold: 20, unit: "servings", priceDelta: 25 },

  { category: "meat", name: "Chicken Tikka", quantity: 70, threshold: 20, unit: "servings", priceDelta: 45 },
  { category: "meat", name: "Pepperoni", quantity: 65, threshold: 20, unit: "servings", priceDelta: 55 },
  { category: "meat", name: "Chicken Sausage", quantity: 65, threshold: 20, unit: "servings", priceDelta: 50 },
  { category: "meat", name: "Smoked Ham", quantity: 50, threshold: 15, unit: "servings", priceDelta: 60 }
];

export const pizzaSeed = [
  {
    name: "Margherita Melt",
    description: "Classic tomato sauce, mozzarella, and fresh basil notes.",
    price: 199,
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Farmhouse Feast",
    description: "Loaded with onion, capsicum, sweet corn, mushroom, and olives.",
    price: 269,
    imageUrl:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Peri Peri Chicken",
    description: "Spicy peri peri sauce with chicken tikka and jalapenos.",
    price: 329,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Smoky Pepperoni",
    description: "Thin crust, barbecue sauce, mozzarella, and pepperoni.",
    price: 349,
    imageUrl:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80"
  }
];
