import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Pizza from './models/Pizza.js';
import Coupon from './models/Coupon.js';

const PIZZAS = [
  {
    name: 'Margherita Classic',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
    price: 249,
    sizes: { small: -50, medium: 0, large: 80 },
    category: 'veg',
    description: 'Fresh mozzarella, San Marzano tomato sauce, and aromatic basil on a thin crust.',
    averageRating: 4.5,
    totalReviews: 128
  },
  {
    name: 'Farmhouse Veggie',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    price: 329,
    sizes: { small: -60, medium: 0, large: 90 },
    category: 'veg',
    description: 'Loaded with capsicum, onion, tomato, mushroom, and fresh paneer on a wheat crust.',
    averageRating: 4.3,
    totalReviews: 95
  },
  {
    name: 'Paneer Tikka Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
    price: 349,
    sizes: { small: -50, medium: 0, large: 100 },
    category: 'veg',
    description: 'Tandoori-spiced paneer, bell peppers, onion, and a smoky tikka sauce base.',
    averageRating: 4.7,
    totalReviews: 210
  },
  {
    name: 'Pepperoni Feast',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80',
    price: 399,
    sizes: { small: -70, medium: 0, large: 120 },
    category: 'non-veg',
    description: 'Double layer of premium pepperoni with extra mozzarella and zesty marinara.',
    averageRating: 4.8,
    totalReviews: 340
  },
  {
    name: 'Chicken Supreme',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600&q=80',
    price: 429,
    sizes: { small: -80, medium: 0, large: 130 },
    category: 'non-veg',
    description: 'Grilled chicken, mushroom, capsicum, and olives with a white garlic sauce.',
    averageRating: 4.6,
    totalReviews: 178
  },
  {
    name: 'BBQ Chicken',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80',
    price: 449,
    sizes: { small: -80, medium: 0, large: 140 },
    category: 'non-veg',
    description: 'Smoky BBQ-glazed chicken, red onion, jalapeños, and cilantro on a thick crust.',
    averageRating: 4.4,
    totalReviews: 156
  },
  {
    name: 'Truffle Mushroom',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80',
    price: 549,
    sizes: { small: -100, medium: 0, large: 150 },
    category: 'premium',
    description: 'Wild mushroom medley with truffle oil, fontina cheese, and fresh thyme.',
    averageRating: 4.9,
    totalReviews: 89
  },
  {
    name: 'Prawn Pesto Artisan',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80',
    price: 599,
    sizes: { small: -100, medium: 0, large: 160 },
    category: 'premium',
    description: 'Tiger prawns, house-made basil pesto, sun-dried tomatoes, and goat cheese.',
    averageRating: 4.8,
    totalReviews: 67
  },
  {
    name: 'Four Cheese Delight',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&q=80',
    price: 479,
    sizes: { small: -80, medium: 0, large: 120 },
    category: 'premium',
    description: 'Mozzarella, gorgonzola, parmesan, and cheddar with a honey drizzle.',
    averageRating: 4.6,
    totalReviews: 134
  }
];

const COUPONS = [
  {
    code: 'WELCOME20',
    discount: 20,
    minOrder: 300,
    maxDiscount: 200,
    expiresAt: new Date('2027-12-31'),
    usageLimit: 1000
  },
  {
    code: 'PIZZAVIBE50',
    discount: 50,
    minOrder: 500,
    maxDiscount: 500,
    expiresAt: new Date('2027-06-30'),
    usageLimit: 500
  },
  {
    code: 'FLAT100',
    discount: 30,
    minOrder: 400,
    maxDiscount: 100,
    expiresAt: new Date('2027-03-31'),
    usageLimit: 200
  }
];

export async function seedData() {
  try {
    const User = mongoose.models.User || (await import('./models/User.js')).default;
    const Pizza = mongoose.models.Pizza || (await import('./models/Pizza.js')).default;
    const Coupon = mongoose.models.Coupon || (await import('./models/Coupon.js')).default;

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Pizza.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    // Create Admin
    await User.create({
      name: 'Admin',
      email: 'admin@pizzavibe.com',
      password: 'Admin@123',
      role: 'admin'
    });

    // Create Demo User
    await User.create({
      name: 'Demo User',
      email: 'user@pizzavibe.com',
      password: 'User@123',
      role: 'user'
    });

    // Insert Products
    await Pizza.insertMany(PIZZAS);
    await Coupon.insertMany(COUPONS);

    console.log('✅ Database seeded successfully!');
    console.log('🔑 Admin: admin@pizzavibe.com / Admin@123');
    console.log('🔑 User:  user@pizzavibe.com / User@123');
    return true;
  } catch (error) {
    if (error.code === 11000) {
      console.warn('⚠️ Seeding skipped: Data already exists.');
      return true;
    }
    console.error('❌ Seed error:', error);
    throw error;
  }
}


import { fileURLToPath } from 'url';

// Support CLI execution
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  mongoose.connect(process.env.MONGODB_URI).then(async () => {
    await seedData();
    process.exit(0);
  });
}


