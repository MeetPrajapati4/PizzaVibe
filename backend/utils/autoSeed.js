import User from '../models/User.js';
import Pizza from '../models/Pizza.js';
import Coupon from '../models/Coupon.js';

const PIZZAS = [
  { name: 'Classic Margherita', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80', price: 299, category: 'veg', description: 'Fresh mozzarella, tomato sauce, and aromatic basil.' },
  { name: 'Truffle Mushroom Italian', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80', price: 589, category: 'premium', description: 'Wild mushrooms with truffle oil and fresh thyme.' },
  { name: 'Prawn Pesto', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&q=80', price: 649, category: 'premium', description: 'Tiger prawns, house-made basil pesto, and goat cheese.' },
  { name: 'Seafood Sensation', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', price: 699, category: 'premium', description: 'Squid, mussels, prawns, and tuna with a dash of lemon.' },
  { name: 'Burrata & Prosciutto', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&q=80', price: 749, category: 'premium', description: 'Whole burrata cheese, premium prosciutto, and balsamic.' },
  { name: 'Spiced Lamb Kofta', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80', price: 619, category: 'non-veg', description: 'Moroccan-spiced lamb, mint yogurt, and roasted peppers.' },
  { name: 'Butter Chicken Special', image: 'https://images.unsplash.com/photo-1613564834361-9436948817d1?w=800&q=80', price: 599, category: 'non-veg', description: 'Classic butter chicken gravy base with succulent chicken.' },
  { name: 'Peri-Peri Poultry', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&q=80', price: 529, category: 'non-veg', description: 'Peri-peri marinated chicken and red peppers.' },
  { name: 'Four Cheese Bliss', image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80', price: 519, category: 'premium', description: 'Mozzarella, gorgonzola, parmesan, and cheddar.' },
  { name: 'Veggie Supreme', image: 'https://foodish-api.com/images/pizza/pizza1.jpg', price: 449, category: 'veg', description: 'An explosion of flavors with seasonal fresh vegetables.' },
  { name: 'Artichoke Pine Nut', image: 'https://foodish-api.com/images/pizza/pizza10.jpg', price: 429, category: 'veg', description: 'Marinated artichoke hearts and toasted pine nuts.' },
  { name: 'Pesto Paradise', image: 'https://foodish-api.com/images/pizza/pizza15.jpg', price: 469, category: 'veg', description: 'Home-made basil pesto with sun-dried tomatoes.' },
  { name: 'Neapolitan Classic', image: 'https://foodish-api.com/images/pizza/pizza20.jpg', price: 389, category: 'veg', description: 'Authentic Naples style thin crust with premium olive oil.' },
  { name: 'Ultimate Meat Feast', image: 'https://foodish-api.com/images/pizza/pizza25.jpg', price: 679, category: 'non-veg', description: 'The ultimate meat feast: loaded with 5 types of meat.' },
  { name: 'Keema Do Pyaza', image: 'https://foodish-api.com/images/pizza/pizza30.jpg', price: 489, category: 'non-veg', description: 'Traditional minced chicken (Keema) with crunchy onions.' },
  { name: 'Pepper BBQ & Onion', image: 'https://foodish-api.com/images/pizza/pizza35.jpg', price: 479, category: 'non-veg', description: 'Succulent pepper barbecue chicken and crunchy onions.' },
  { name: 'Paneer Makhani Magic', image: 'https://foodish-api.com/images/pizza/pizza40.jpg', price: 539, category: 'veg', description: 'Paneer chunks in a creamy Makhani sauce with capsicum.' },
  { name: 'Vibe Garden Special', image: 'https://foodish-api.com/images/pizza/pizza45.jpg', price: 569, category: 'veg', description: 'A lush garden of onions, capsicum, tomato, and mushroom.' }
];

export const autoSeed = async () => {
  try {
    // 1. Ensure Admin exists
    const adminExists = await User.findOne({ where: { email: 'admin@pizzavibe.com' } });
    if (!adminExists) {
      await User.create({
        name: 'The Boss',
        email: 'admin@pizzavibe.com',
        password: 'Admin@BossPassword123',
        role: 'admin'
      });
      console.log('👑 admin@pizzavibe.com account auto-created (Supabase).');
    }

    // 2. Ensure Pizzas exist
    const pizzaCount = await Pizza.count();
    if (pizzaCount === 0) {
      const processedPizzas = PIZZAS.map((p, idx) => ({
        ...p,
        small_price: Math.round(p.price * 0.8),
        medium_price: p.price,
        large_price: Math.round(p.price * 1.3),
        isAvailable: true,
        averageRating: 4.5 + (idx % 5) / 10
      }));
      await Pizza.bulkCreate(processedPizzas);
      console.log(`🍕 Auto-seeded ${processedPizzas.length} artisan pizzas (Supabase).`);
    }

    // 3. Ensure Coupons exist
    const couponCount = await Coupon.count();
    if (couponCount === 0) {
      await Coupon.bulkCreate([
        { code: 'WELCOME20', discount: 20, minOrder: 300, maxDiscount: 200, expiryDate: new Date('2027-12-31') },
        { code: 'PIZZAVIBE50', discount: 50, minOrder: 500, maxDiscount: 500, expiryDate: new Date('2027-06-30') }
      ]);
      console.log('🎟️ Auto-seeded starter coupons (Supabase).');
    }
  } catch (error) {
    console.warn('⚠️ Auto-seeding skipped or failed:', error.message);
  }
};
